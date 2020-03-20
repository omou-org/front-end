import React, { useEffect, useMemo, useState } from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import { connect, useDispatch, useSelector } from "react-redux";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { Prompt, useLocation, useParams, withRouter } from "react-router-dom";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import { usePayment, useSubmitRegistration } from "../../../actions/multiCallHooks";
import Loading from "../../Loading";
import { isFail, isLoading, isSuccessful, usePrevious } from "../../../actions/hooks";
import { GET } from "../../../actions/actionTypes";
import BackButton from "../../BackButton";
import { paymentToString } from "utils"

function RegistrationReceipt(props) {
    const currentPayingParent = useSelector((({ Registration }) => Registration.CurrentParent));
    const parents = useSelector(({ Users }) => Users.ParentList);

    const courses = useSelector(({ Course }) => Course.NewCourseList);
    const Payments = useSelector(({ Payments }) => Payments);
    const students = useSelector(({ Users }) => Users.StudentList);
    const RequestStatus = useSelector(({ RequestStatus }) => RequestStatus);

    const location = useLocation();
    const params = useParams();
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(apiActions, dispatch),
        }),
        [dispatch]
    );

    const [paymentReceipt, setPaymentReceipt] = useState({});
    const prevPaymentReceipt = usePrevious(paymentReceipt);
    const [courseReceipt, setCourseReceipt] = useState({});
    const Registration = useSelector(({ Registration }) => Registration);
    const registrationStatus = useSubmitRegistration(Registration.registration);

    const parent = parents[params.parentID];
    const paymentStatus = usePayment(params.paymentID && params.paymentID);

    useEffect(() => {
        if (isSuccessful(paymentStatus) &&
            (JSON.stringify(prevPaymentReceipt) !== JSON.stringify(paymentReceipt) ||
                JSON.stringify(prevPaymentReceipt) === "{}"
            )
        ) {
            let payment = Payments[params.parentID][params.paymentID];
            let enrollments = payment.registrations.map(registration => registration.enrollment_details);
            setPaymentReceipt(payment);
            setCourseReceipt(courseReceiptInitializer(enrollments));
        }
    }, [paymentStatus, paymentReceipt]);

    if ((!registrationStatus || isFail(registrationStatus)) && !params.paymentID) {
        return <Loading />
    }

    const courseReceiptInitializer = (enrollments) => {
        let receipt = {};
        let studentIDs = [...new Set(enrollments.map(enrollment => enrollment.student))];
        studentIDs.forEach(id => {
            if (RequestStatus.student[GET][id] !== 200) {
                api.fetchStudents(id);
            }

            enrollments.forEach(enrollment => {

                if (enrollment.student === id) {
                    if (Array.isArray(receipt[id])) {
                        receipt[id].push(courses[enrollment.course])
                    } else {
                        receipt[id] = [courses[enrollment.course]]
                    }
                }
            });
        });
        return receipt;
    };

    // If we're coming from the registration cart, set-up state variables after we've completed registration requests
    if (registrationStatus && registrationStatus.status >= 200 &&
        Object.keys(paymentReceipt).length < 1) {
        let payment = Payments[currentPayingParent.user.id][registrationStatus.paymentID];
        setPaymentReceipt(payment);
        let enrollments = payment.registrations.map(registration => registration.enrollment_details);
        setCourseReceipt(courseReceiptInitializer(enrollments));
    }

    const handleCloseReceipt = () => (e) => {
        e.preventDefault();
        props.history.push("/registration");
        api.closeRegistration("");
    };

    const renderParent = () => {
        if (currentPayingParent) {
            return currentPayingParent.user
        } else {
            return parent;
        }
    };

    if (Object.keys(paymentReceipt).length < 1 || (isLoading(paymentStatus) && !registrationStatus) || !renderParent()) {
        return <Loading />;
    }

    const numSessions = (courseID, studentID) => paymentReceipt.registrations
        .find((registration) => (
            registration.enrollment_details.student == studentID &&
            registration.enrollment_details.course == courseID)).num_sessions;

    const renderCourse = (enrolledCourse, studentID) => (<Grid item key={enrolledCourse.course_id}>
        <Grid
            className={"enrolled-course"}
            container
            direction="column"
            justify="flex-start">
            <Grid item>
                <Typography align="left" className={"enrolled-course-title"}>
                    {enrolledCourse.title}
                </Typography>
            </Grid>
            <Grid item>
                <Grid container direction="column" justify="flex-start">
                    <Grid item>
                        <Grid container direction="row">
                            <Grid item xs={2}>
                                <Typography align="left" className={"course-label"}>
                                    Dates
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="left">
                                    {new Date(enrolledCourse.schedule.start_date.replace(/-/g, '\/')).toLocaleDateString()} -
                                    {new Date(enrolledCourse.schedule.end_date.replace(/-/g, '\/')).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} className={"course-label"}>
                                <Typography align="left" className={"course-label"}>
                                    Tuition
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="left">
                                    ${Math.round(enrolledCourse.hourly_tuition *
                                        numSessions(enrolledCourse.course_id, studentID))}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row">
                            <Grid item xs={2}>
                                <Typography align="left" className={"course-label"}>
                                    Sessions
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="left">
                                    {numSessions(enrolledCourse.course_id, studentID)}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align="left" className={"course-label"}>
                                    Hourly Tuition
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="left">
                                    ${enrolledCourse.hourly_tuition}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>);

    const renderStudentReceipt = (studentID, enrolledCourses) => {
        let student = students[studentID];
        return (
            <Grid container direction="column" key={studentID}>
                <Paper className={"course-receipt"}>
                    <Grid item>
                        <Typography
                            className={"student-name"}
                            variant="h5"
                            align="left">
                            {student.name} <span>- ID# {student.user_id}</span>
                        </Typography>
                    </Grid>
                    {
                        enrolledCourses.map(enrolledCourse => renderCourse(enrolledCourse, studentID))
                    }
                </Paper>
            </Grid>)
    };

    const handlePrint = event => {
        event.preventDefault();
        window.print();
    };



    return (
        <Paper className={"paper registration-receipt"}>
            {
                params.paymentID && <>
                    <BackButton />
                    <hr />
                </>
            }
            <Prompt
                when={currentPayingParent !== "none" && location.pathname.includes("receipt")}
                message={"Remember to please close out the parent first!"}
            />
            <Grid container
                direction={"column"}
                spacing={16}
            >
                <Grid item>
                    <Typography variant={"h2"} align={"left"}>
                        Payment Confirmation
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant={"h5"} align={"left"}>
                        Thank you for your payment, {renderParent().name}
                    </Typography>
                </Grid>
                <Grid item xs={12}
                    className={"receipt-info"}
                >
                    <Grid container direction={"column"}>
                        <Grid item xs={8}>
                            <Grid container direction={"row"}>
                                <Grid item xs={3}>
                                    <Typography
                                        className={"label"}
                                        align={"left"}>
                                        Order ID#:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align={"left"}>
                                        {paymentReceipt.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography
                                        className={"label"}
                                        align={"left"}>
                                        Paid By:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align={"left"}>
                                        {`
                                        ${renderParent().name} - ID#:
                                        ${renderParent().user_id || renderParent().id}
                                    `}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container direction={"row"}>
                                <Grid item xs={3}>
                                    <Typography
                                        className={"label"}
                                        align={"left"}>
                                        Order Date:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align={"left"}>
                                        {new Date(paymentReceipt.created_at).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography
                                        className={"label"}
                                        align={"left"}>
                                        Payment Method:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align={"left"}>
                                        {paymentToString(paymentReceipt.method)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container
                        direction="column"
                        justify="center"
                        spacing={8}
                    >
                        <Grid item xs={12}>
                            {
                                Object.entries(courseReceipt)
                                    .map(([studentID, enrolledCourses]) =>
                                        renderStudentReceipt(studentID, enrolledCourses))
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={"receipt-details"}>
                    <Grid
                        container
                        direction="column"
                        alignItems="flex-end"
                    >
                        {
                            paymentReceipt.discount_total >= 0 &&
                            <Grid style={{ width: "100%" }}
                                item xs={3}>
                                <Grid container direction="row">
                                    <Grid item xs={7}>
                                        <Typography align="right">
                                            Discount Amount
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            align="right"
                                            variant="subheading">
                                            - ${paymentReceipt.discount_total}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                        {
                            paymentReceipt.price_adjustment > 0 &&
                            <Grid style={{ width: "100%" }}
                                item xs={3}>
                                <Grid container direction="row">
                                    <Grid item xs={7}>
                                        <Typography
                                            align="right"
                                            variant="p">
                                            Price Adjustment
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            align="right"
                                            variant="subheading">
                                            {paymentReceipt.price_adjustment}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                        <Grid style={{ width: "100%" }}
                            item xs={3}>
                            <Grid container direction="row">
                                <Grid item xs={7}>
                                    <Typography
                                        align="right"
                                        variant="h6">
                                        Total
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography
                                        align="right"
                                        variant="h6">
                                        ${paymentReceipt.total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={"receipt-actions"}>
                    <Grid container
                        spacing={8}
                        direction="row"
                        justify="flex-end">
                        <Grid item>
                            <Button onClick={handlePrint} className={"button"}>
                                Print
                            </Button>
                        </Grid>
                        {
                            !location.pathname.includes("parent") &&
                            <Grid item>
                                <Button
                                    onClick={handleCloseReceipt()}
                                    className={"button primary"}>
                                    End Registration
                                </Button>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "courseList": state.Course.NewCourseList,
});

export default withRouter(connect(
    mapStateToProps
)(RegistrationReceipt));
