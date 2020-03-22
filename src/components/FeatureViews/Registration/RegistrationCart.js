/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines-per-function */
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";

import * as apiActions from "actions/apiActions";
import * as hooks from "actions/hooks";
import * as registrationActions from "actions/registrationActions";

import BackArrow from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import NavLinkNoDup from "components/Routes/NavLinkNoDup";
import Paper from "@material-ui/core/Paper";
import PriceQuoteForm from "components/Form/PriceQuoteForm";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import {dateParser, weeklySessionsParser} from "components/Form/FormUtils";

import "./registration.scss";

const RegistrationCart = () => {
    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(registrationActions, dispatch),
        [dispatch]);

    const registration = useSelector(({Registration}) => Registration);
    const {CurrentParent} = registration;
    const registered_courses = registration.registered_courses || {};
    const studentAccounts = useSelector(({Users}) => Users.StudentList);
    const courseList = useSelector(({Course}) => Course.NewCourseList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);

    const [selectedCourses, setSelectedCourses] = useState({});
    const [updatedCourses, setUpdatedCourse] = useState([]);

    const courseIDs = useMemo(() =>
        Object.values(registered_courses)
            .reduce((list, array) => [...list, ...array], [])
            .map(({course_id}) => course_id),
    [registered_courses]);
    const studentIDs = useMemo(() =>
        Object.keys(registered_courses),
        [registered_courses]);

    const allValid = useMemo(() =>
        Object.values(selectedCourses)
            .reduce((list, vals) => [...list, ...Object.values(vals)], [])
            .every(({validated}) => validated),
    [selectedCourses]);
    const coursesStatus = hooks.useCourse(courseIDs);
    const studentsStatus = hooks.useStudent(studentIDs);

    useEffect(() => {
        studentIDs.forEach((id) => {
            api.fetchEnrollmentsByStudent(id);
        });
    }, [api, studentIDs]);

    useEffect(() => {
        dispatch(registrationActions.initializeRegistration());
    }, [dispatch]);

    useEffect(() => {
        if (registered_courses) {
            setSelectedCourses(studentIDs.reduce((studentsList, studentID) => ({
                ...studentsList,
                // for each student
                [studentID]: registered_courses[studentID]
                    // find courses that have ids
                    .filter(({course_id}) => course_id)
                    // make them unchecked, validated, and set the number of sessions
                    .reduce((studentCourses, {course_id, sessions}) => ({
                        ...studentCourses,
                        [course_id]: {
                            "checked": false,
                            sessions,
                            "validated": true,
                        },
                    }), {}),
            }), {}));
        }
    }, [registered_courses, studentIDs]);

    useEffect(() => {
        if (registered_courses && CurrentParent) {
            sessionStorage.setItem("registered_courses", JSON.stringify(registered_courses));
            sessionStorage.setItem("CurrentParent", JSON.stringify(CurrentParent));
        }
    }, [CurrentParent, registered_courses]);

    const updateQuantity = useCallback(() => {
        updatedCourses.forEach((updatedCourse) => {
            dispatch(registrationActions.editRegistration(updatedCourse));
        });
    }, [dispatch, updatedCourses]);

    const handleCourseSelect = useCallback((studentID, courseID) => () => {
        setSelectedCourses((prevCourses) => {
            const newCourses = JSON.parse(JSON.stringify(prevCourses));
            newCourses[studentID][courseID] = {
                ...newCourses[studentID][courseID],
                "checked": !newCourses[studentID][courseID].checked,
            };
            return newCourses;
        });
    }, []);

    const handleCourseSessionsChange = useCallback((studentID, courseID) => ({target}) => {
        let {value} = target;
        if (value && !isNaN(value)) {
            value = Number(value);
        }
        const enrollment = enrollments[studentID] && enrollments[studentID][courseID];
        const paidSessions = enrollment ? enrollment.sessions_left : 0;

        setUpdatedCourse((prevCourses) => {
            const courseIndex = registered_courses[studentID]
                .findIndex(({course_id}) => Number(courseID) === course_id);
            const course = courseList[courseID];
            const newOne = {
                ...registered_courses[studentID][courseIndex],
                "sessions": value,
                "isNew": !course,
            };
            if (!(course && course.course_type === "class")) {
                const it = registered_courses[studentID][courseIndex];//.new_course.schedule;
                if (!it.new_course) {
                    it.new_course = JSON.parse(JSON.stringify(course));
                }

                let finalVal = value;
                if (course) {
                    finalVal += weeklySessionsParser(course.schedule.start_date, course.schedule.end_date);
                }

                newOne.new_course = {
                    ...it.new_course,
                    "schedule": {
                        ...it.new_course.schedule,
                        // calculates appropriate date and formats it
                        "end_date": dateParser(new Date(it.new_course.schedule.start_date)
                            .getTime() + 7 * 24 * 60 * 60 * 1000 * (finalVal-1) + 24 * 60 * 60 * 1000),
                    },
                };
            }
            return [
                ...prevCourses,
                newOne,
            ];
        });

        setSelectedCourses((prevCourses) => {
            const updated = JSON.parse(JSON.stringify(prevCourses));
            const course = courseList[courseID];
            updated[studentID][courseID] = {
                ...updated[studentID][courseID],
                "sessions": value,
            };
            if (course && course.course_type === "class") {
                const {start_date, end_date} = course.schedule;
                const numSessions = weeklySessionsParser(start_date, end_date);
                updated[studentID][courseID] = {
                    ...updated[studentID][courseID],
                    "validated": Number.isInteger(value) &&
                        (0 <= value && value <= (numSessions - paidSessions + 1)),
                };
            }
            return updated;
        });
    }, [registered_courses, enrollments, courseList]);

    if (hooks.isLoading(coursesStatus) || hooks.isLoading(studentsStatus)) {
        return <Loading />;
    }

    const studentRegistrations = Object.keys(registered_courses).map((student_id) => studentAccounts[student_id] &&
        <div className="student-cart-wrapper">
            <Grid container>
                <Grid
                    item
                    xs={12}>
                    <Typography
                        align="left"
                        gutterBottom
                        variant="h5">
                        {studentAccounts[student_id].name}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}>
                    <Grid
                        className="accounts-table-heading"
                        container>
                        <Grid
                            item
                            xs={1} />
                        <Grid
                            item
                            xs={3}>
                            <Typography
                                align="left"
                                className="cart-header">
                                Course
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={3}>
                            <Typography
                                align="left"
                                className="cart-header">
                                Dates
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={1}>
                            <Typography
                                align="center"
                                className="cart-header">
                                Sessions
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={2}>
                            <Typography
                                align="center"
                                className="cart-header">
                                Tuition
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={2}>
                            <Typography
                                align="center"
                                className="cart-header">
                                Material Fee
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}>
                    <Grid container>
                        {
                            registered_courses[student_id].map(({new_course, course_id}) => {
                                const course = new_course || courseList[course_id];
                                if (course) {
                                    const dateOptions = {
                                        "day": "numeric",
                                        "month": "short",
                                        "year": "numeric",
                                    };
                                    const {checked, sessions, validated} = selectedCourses[student_id][course_id];
                                    let endDate = new Date(course.schedule.end_date),
                                        startDate = new Date(course.schedule.start_date);

                                    startDate = startDate.toLocaleDateString("en-US", dateOptions);
                                    endDate = endDate.toLocaleDateString("en-US", dateOptions);

                                    return (
                                        <Grid
                                            item
                                            xs={12}>
                                            <Paper square>
                                                <Grid
                                                    alignItems="center"
                                                    container>
                                                    <Grid
                                                        item
                                                        xs={1}>
                                                        <Checkbox
                                                            checked={checked}
                                                            onChange={handleCourseSelect(student_id, course_id)} />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={3}>
                                                        <Typography align="left">
                                                            {course.title}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={3}>
                                                        <Typography align="left">
                                                            {startDate} - {endDate}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={1}>
                                                        {
                                                            !checked
                                                                ? <Typography align="center">
                                                                    {sessions}
                                                                  </Typography>
                                                                : <TextField
                                                                    InputLabelProps={{
                                                                        "shrink": true,
                                                                    }}
                                                                    error={!validated}
                                                                    id="outlined-number"
                                                                    label="Quantity"
                                                                    margin="normal"
                                                                    onChange={handleCourseSessionsChange(
                                                                        student_id,
                                                                        course_id
                                                                    )}
                                                                    type="number"
                                                                    value={sessions}
                                                                    variant="outlined" />
                                                        }
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}>
                                                        <Typography align="center">
                                                            {course.tuition}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    );
                                }
                                return "";
                            })
                        }
                    </Grid>
                </Grid>
            </Grid>
        </div>);


    const renderPayment = (isOneCourse, selectedStudentID, selectedCourseID) => {
        const selectedRegistration = registered_courses[selectedStudentID]
            .find(({course_id}) => Number(course_id) === Number(selectedCourseID));
        const isSmallGroup = selectedCourseID.indexOf("T") === -1 && courseList[selectedCourseID].capacity < 5;
        const {form, course_id} = selectedRegistration;
        const formType = form ? form.form : "class";

        const selectedCoursesHaveSession = () => {
            let haveSession = true;
            Object.values(selectedCourses).forEach((student) => {
                Object.values(student).forEach((course) => {
                    if (course.checked && course.sessions < 1) {
                        haveSession = false;
                    }
                });
            });
            return haveSession;
        };

        // This determines if there's been an update to the number of sessions to checkout for any course
        const selectedCourseSameAsRedux = () => {
            // go to each selectedCourses
            // get selectedCourse from registered_courses
            // compare if both sessions are equal
            let sameSessions = true;
            Object.entries(selectedCourses).forEach(([studentID, studentVal]) => {
                Object.entries(studentVal).forEach(([courseID, courseVal]) => {
                    const reduxCourse = registered_courses[studentID]
                        .find(({course_id}) => Number(course_id) === Number(courseID));
                    if (reduxCourse.sessions !== courseVal.sessions) {
                        sameSessions = false;
                    }
                });
            });
            return sameSessions;
        };

        // generate registered course object split by class and tutoring
        const registeredCourses = () => {
            const courses = {
                "courses": [],
                "tutoring": [],
            };
            Object.entries(selectedCourses).forEach(([studentID, studentVal]) => {
                Object.entries(studentVal).forEach(([courseID, courseVal]) => {
                    if (courseVal.checked) {
                        const course = registered_courses[studentID]
                            .find(({course_id}) => Number(course_id) === Number(courseID));
                        if (courseID.indexOf("T") > -1 )  {
                            // {category, academic_level, sessions, form}
                            let {category, academic_level, form, new_course} = course;
                            new_course = new_course || {};
                            courses.tutoring.push({
                                "category_id": category || new_course.category,
                                "academic_level": academic_level || new_course.academic_level,
                                "sessions": courseVal.sessions,
                                "duration": apiActions.durationParser[form.Schedule && form.Schedule.Duration],
                                "student_id": studentID,
                                new_course,
                                "courseID": course.course_id,
                            });
                        } else {
                            courses.courses.push({
                                "course_id": courseID,
                                "sessions": courseVal.sessions,
                                "student_id": studentID,
                                "enrollment": course && course.form.Enrollment,
                            });
                        }
                    }
                });
            });
            return courses;
        };

        return (
            <Grid
                container
                spacing={1}>
                {
                    <Grid
                        item
                        xs={12}>
                        <Grid
                            container
                            justify="flex-end"
                            spacing={2}>
                            <Grid
                                item
                                xs={6} />
                            {
                                isOneCourse &&
                                <>
                                    <Grid item>
                                        {
                                            isSmallGroup && <Button
                                                className="button"
                                                component={NavLinkNoDup}
                                                to={`/registration/form/course_details/${selectedCourseID}/edit`}>
                                                    Edit Group Course
                                            </Button>
                                        }
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className="button"
                                            component={NavLinkNoDup}
                                            to={`/registration/form/${formType}/${selectedStudentID}+${course_id}/edit`}>
                                            Edit Registration
                                        </Button>
                                    </Grid>
                                </>
                            }
                            <Grid item >
                                <Grid
                                    container
                                    justify="flex-end">
                                    {
                                        !selectedCourseSameAsRedux() &&
                                        <Button
                                            className="button"
                                            disabled={!allValid}
                                            onClick={updateQuantity}>
                                            UPDATE SESSIONS
                                        </Button>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                <Grid
                    item
                    xs={12}>
                    <PriceQuoteForm
                        courses={registeredCourses().courses}
                        disablePay={!(selectedCoursesHaveSession() && selectedCourseSameAsRedux())}
                        tutoring={registeredCourses().tutoring} />
                </Grid>
            </Grid>
        );
    };

    const selectedCourseOptions = () => {
        let displaySelectionOptions = 0;
        let selectedCourseID = -1,
            selectedStudentID = -1;
        Object.keys(selectedCourses).forEach((studentID) => {
            for (const [courseID, checkbox] of Object.entries(selectedCourses[studentID])) {
                if (checkbox.checked) {
                    displaySelectionOptions++;
                    selectedCourseID = courseID;
                    selectedStudentID = studentID;
                }
            }
        });
        if (selectedCourseID !== -1) {
            return renderPayment(displaySelectionOptions === 1, selectedStudentID, selectedCourseID);
        }
        return "";
    };

    return (
        <form>
            <Paper className="registration-cart paper">
                <Grid
                    container
                    layout="row"
                    spacing={1}>
                    <Grid
                        item
                        xs={12}>
                        <Grid container>
                            <Grid item={3}>
                                <Button
                                    className="button"
                                    component={NavLinkNoDup}
                                    to="/registration">
                                    <BackArrow />
                                    Register
                                </Button>
                            </Grid>
                        </Grid>
                        <hr />
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        <Typography
                            align="left"
                            variant="h3">
                            Select Course(s)
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        {studentRegistrations}
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        {selectedCourseOptions()}
                    </Grid>
                </Grid>
            </Paper>
        </form>
    );
};

export default RegistrationCart;
