import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Prompt, useHistory, useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import * as registrationActions from "actions/registrationActions";
import * as userActions from "actions/userActions";
import {isFail, isLoading, isSuccessful, usePrevious} from "actions/hooks";
import {usePayment, useSubmitRegistration} from "actions/multiCallHooks";
import BackButton from "components/BackButton";
import {GET} from "actions/actionTypes";
import Loading from "components/Loading";
import {paymentToString} from "utils";

const RegistrationReceipt = () => {
    const history = useHistory();
    const currentPayingParent = useSelector(
        ({Registration}) => Registration.CurrentParent
    );
    const parents = useSelector(({Users}) => Users.ParentList);

    const courses = useSelector(({Course}) => Course.NewCourseList);
    const Payments = useSelector(({Payments}) => Payments);
    const students = useSelector(({Users}) => Users.StudentList);
    const RequestStatus = useSelector(({RequestStatus}) => RequestStatus);

    const location = useLocation();
    const params = useParams();
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
        }),
        [dispatch]
    );

    const [paymentReceipt, setPaymentReceipt] = useState({});
    const prevPaymentReceipt = usePrevious(paymentReceipt);
    const [courseReceipt, setCourseReceipt] = useState({});
    const Registration = useSelector(({Registration}) => Registration);
    const registrationStatus = useSubmitRegistration(Registration.registration);

    const parent = parents[params.parentID];
    const paymentStatus = usePayment(params.paymentID && params.paymentID);

    const courseReceiptInitializer = useCallback(
        (enrollments) => {
            const receipt = {};
            const studentIDs = [
                ...new Set(enrollments.map((enrollment) => enrollment.student)),
            ];
            studentIDs.forEach((id) => {
                if (RequestStatus.student[GET][id] !== 200) {
                    api.fetchStudents(id);
                }

                enrollments.forEach((enrollment) => {
                    if (enrollment.student === id) {
                        if (Array.isArray(receipt[id])) {
                            receipt[id].push(courses[enrollment.course]);
                        } else {
                            receipt[id] = [courses[enrollment.course]];
                        }
                    }
                });
            });
            return receipt;
        },
        [RequestStatus.student, api, courses]
    );

    useEffect(() => {
        if (
            isSuccessful(paymentStatus) &&
            (JSON.stringify(prevPaymentReceipt) !== JSON.stringify(paymentReceipt) ||
                JSON.stringify(prevPaymentReceipt) === "{}")
        ) {
            const payment = Payments[params.parentID][params.paymentID];
            const enrollments = payment.registrations.map(
                (registration) => registration.enrollment_details
            );
            setPaymentReceipt(payment);
            setCourseReceipt(courseReceiptInitializer(enrollments));
        }
    }, [
        paymentStatus,
        paymentReceipt,
        courseReceiptInitializer,
        Payments,
        params.parentID,
        params.paymentID,
        prevPaymentReceipt,
    ]);

    if (
        (!registrationStatus || isFail(registrationStatus)) &&
        !params.paymentID
    ) {
        return <Loading/>;
    }

    // If we're coming from the registration cart, set-up state variables after we've completed registration requests
    if (
        registrationStatus &&
        registrationStatus.status >= 200 &&
        Object.keys(paymentReceipt).length < 1
    ) {
        const payment =
            Payments[currentPayingParent.user.id][registrationStatus.paymentID];
        setPaymentReceipt(payment);
        const enrollments = payment.registrations.map(
            (registration) => registration.enrollment_details
        );
        setCourseReceipt(courseReceiptInitializer(enrollments));
    }

    const handleCloseReceipt = () => (e) => {
        e.preventDefault();
        history.push("/registration");
        dispatch(registrationActions.closeRegistration());
    };

    const getParent = () =>
        currentPayingParent ? currentPayingParent.user : parent;

    if (
        Object.keys(paymentReceipt).length < 1 ||
        (isLoading(paymentStatus) && !registrationStatus) ||
        !getParent()
    ) {
        return <Loading/>;
    }

    const numSessions = (courseID, studentID) =>
        paymentReceipt.registrations.find(
            (registration) =>
                registration.enrollment_details.student == studentID &&
                registration.enrollment_details.course == courseID
        ).num_sessions;

    const renderCourse = (enrolledCourse, studentID) => (
        <Grid item key={enrolledCourse.course_id}>
            <Grid
                className="enrolled-course"
                container
                direction="column"
                justify="flex-start"
            >
                <Grid item>
                    <Typography align="left" className="enrolled-course-title">
                        {enrolledCourse.title}
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container direction="column" justify="flex-start">
                        <Grid item>
                            <Grid container direction="row">
                                <Grid item xs={2}>
                                    <Typography align="left" className="course-label">
                                        Dates
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography align="left">
                                        {new Date(
                                            enrolledCourse.schedule.start_date.replace(/-/g, "/")
                                        ).toLocaleDateString()}{" "}
                                        -
                                        {new Date(
                                            enrolledCourse.schedule.end_date.replace(/-/g, "/")
                                        ).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid className="course-label" item xs={2}>
                                    <Typography align="left" className="course-label">
                                        Tuition
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography align="left">
                                        $
                                        {Math.round(
                                            enrolledCourse.hourly_tuition *
                                            numSessions(enrolledCourse.course_id, studentID)
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row">
                                <Grid item xs={2}>
                                    <Typography align="left" className="course-label">
                                        Sessions
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography align="left">
                                        {numSessions(enrolledCourse.course_id, studentID)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography align="left" className="course-label">
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
        </Grid>
    );

    const renderStudentReceipt = (studentID, enrolledCourses) => {
        const student = students[studentID];
        return (
            <Grid container direction="column" key={studentID}>
                <Paper elevation={2} className="course-receipt">
                    <Grid item>
                        <Typography align="left" className="student-name" variant="h5">
                            {student.name} <span>- ID# {student.user_id}</span>
                        </Typography>
                    </Grid>
                    {enrolledCourses.map((enrolledCourse) =>
                        renderCourse(enrolledCourse, studentID)
                    )}
                </Paper>
            </Grid>
        );
    };

    const handlePrint = (event) => {
        event.preventDefault();
        window.print();
    };

    return (
        <Paper elevation={2} className="paper registration-receipt">
            {params.paymentID && (
                <>
                    <BackButton/>
                    <hr/>
                </>
            )}
            <Prompt
                message="Remember to please close out the parent first!"
                when={
                    currentPayingParent !== null && location.pathname.includes("receipt")
                }
            />
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Typography align="left" variant="h2">
                        Payment Confirmation
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography align="left" variant="h5">
                        Thank you for your payment, {getParent().name}
                    </Typography>
                </Grid>
                <Grid className="receipt-info" item xs={12}>
                    <Grid container direction="column">
                        <Grid item xs={8}>
                            <Grid container direction="row">
                                <Grid item xs={3}>
                                    <Typography align="left" className="label">
                                        Order ID#:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align="left">{paymentReceipt.id}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align="left" className="label">
                                        Paid By:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align="left">
                                        {getParent().name} - ID#:{" "}
                                        {getParent().user_id || getParent().id}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container direction="row">
                                <Grid item xs={3}>
                                    <Typography align="left" className="label">
                                        Order Date:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align="left">
                                        {new Date(paymentReceipt.created_at).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align="left" className="label">
                                        Payment Method:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align="left">
                                        {paymentToString(paymentReceipt.method)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container direction="column" justify="center" spacing={1}>
                        <Grid item xs={12}>
                            {Object.entries(
                                courseReceipt
                            ).map(([studentID, enrolledCourses]) =>
                                renderStudentReceipt(studentID, enrolledCourses)
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className="receipt-details" item xs={12}>
                    <Grid alignItems="flex-end" container direction="column">
                        {paymentReceipt.discount_total >= 0 && (
                            <Grid item style={{width: "100%"}} xs={3}>
                                <Grid container direction="row">
                                    <Grid item xs={7}>
                                        <Typography align="right">Discount Amount</Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography align="right" variant="subtitle1">
                                            - ${paymentReceipt.discount_total}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        {paymentReceipt.price_adjustment > 0 && (
                            <Grid item style={{width: "100%"}} xs={3}>
                                <Grid container direction="row">
                                    <Grid item xs={7}>
                                        <Typography align="right" variant="p">
                                            Price Adjustment
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography align="right" variant="subtitle1">
                                            {paymentReceipt.price_adjustment}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        <Grid item style={{width: "100%"}} xs={3}>
                            <Grid container direction="row">
                                <Grid item xs={7}>
                                    <Typography align="right" variant="h6">
                                        Total
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography align="right" variant="h6">
                                        ${paymentReceipt.total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className="receipt-actions" item xs={12}>
                    <Grid container direction="row" justify="flex-end" spacing={1}>
                        <Grid item>
                            <Button className="button" onClick={handlePrint}>
                                Print
                            </Button>
                        </Grid>
                        {!location.pathname.includes("parent") && (
                            <Grid item>
                                <Button
                                    className="button primary"
                                    onClick={handleCloseReceipt()}
                                >
                                    End Registration
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default RegistrationReceipt;
