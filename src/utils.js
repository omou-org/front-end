import {DayConverter} from "./components/FeatureViews/Accounts/TabComponents/CourseSessionStatus";
import {useDispatch, useSelector} from "react-redux";
import React, {useMemo, useState} from "react";
import {useHistory} from "react-router-dom";
import {bindActionCreators} from "redux";
import * as registrationActions from "./actions/registrationActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/es/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/es/Dialog";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from 'prop-types';

export const timeFormat = {
    "hour12": false,
    "hour": "2-digit",
    "minute": "2-digit",
};

export const dateFormat = {
    "year": "numeric",
    "month": "2-digit",
    "day": "2-digit",
};

export const dateTimeFormat = {
    "year": "numeric",
    "month": "2-digit",
    "day": "2-digit",
    "hour12": false,
    "hour": "2-digit",
    "minute": "2-digit",
};

const dateOptions = {
    "day": "numeric",
    "month": "short",
    "year": "numeric",
};

export const dateFormatter = (date) => {
    return new Date(date.replace(/-/g, '\/'))
        .toDateString().substr(3);
};

export const courseDateFormat = (course) => {
    let start_date = dateFormatter(course.schedule.start_date),
        end_date = dateFormatter(course.schedule.end_date),
        start_time = new Date("2020-01-01" + course.schedule.start_time)
            .toLocaleTimeString('eng-US', timeFormat),
        end_time = new Date("2020-01-01" + course.schedule.end_time)
            .toLocaleTimeString('eng-US', timeFormat),
        days = DayConverter[new Date(course.schedule.start_date).getDay()];

    return {
        "end_date": end_date,
        "end_time": end_time,
        "start_date": start_date,
        "start_time": start_time,
        "days": days,
        "is_confirmed": course.is_confirmed,
    };
};

export const sessionPaymentStatus = (session, enrollment) => {
    const session_date = new Date(session.start_datetime),
        last_session = new Date(enrollment.last_paid_session_datetime);

    const sessionIsBeforeLastPaidSession = session_date <= last_session;
    const sessionIsLastPaidSession = session_date == last_session;
    const thereIsPartiallyPaidSession = !Number.isInteger(enrollment.sessions_left);
    const classSessionNotBeforeFirstPayment = session_date >= new Date(enrollment.payment_list[0].created_at);

    if( sessionIsBeforeLastPaidSession && !thereIsPartiallyPaidSession && classSessionNotBeforeFirstPayment){
        return "Paid";
    } else if ( sessionIsLastPaidSession && thereIsPartiallyPaidSession && thereIsPartiallyPaidSession){
        return "Partial";
    } else if (!classSessionNotBeforeFirstPayment ) {
        return "NA"
    } else {
        return "Unpaid";
    }
};

const courseToRegister = (enrollment, course, student) => ({
    "Enrollment": enrollment.enrollment_id,
    "Course Selection": {
        "Course": {
            label: course.title,
            value: Number(course.course_id),
        },
    },
    "Course Selection_validated": {
        "Course": true,
    },
    "Student": {
        "Student": {
            label: student.name,
            value: student.user_id,
        }
    },
    "Student_validated": {
        "Student": true,
    },
    "Student Information": {},
    "activeSection": "Student",
    "activeStep": 0,
    "conditional": "",
    "existingUser": false,
    "form": course.course_type,
    "hasLoaded": true,
    "preLoaded": false,
    "submitPending": false,
});

/**
 * @description button/menu item to start registering for more sessions for a course.
 * This will display a warning popover in the case that you're about to override
 * an existing registering parent.
 * @param {String} componentOption this will either be a button or a menu item
 * @param {Number} parentOfCurrentStudent this is the id of the parent that will be registering
 * @param {Object} enrollment this is the enrollment we'll be updating
 */
export const AddSessions = ({componentOption, parentOfCurrentStudent, enrollment}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    const students = useSelector(({ Users }) => Users.StudentList);
    const courses = useSelector(({ Course }) => Course.NewCourseList);

    const registeringParent = useSelector(({ Registration }) => Registration.CurrentParent);
    const [discardParentWarning, setDiscardParentWarning] = useState(false);

    const handleRegisterMoreSessions = event => {
        event.preventDefault();
        // check if registering parent is the current student's parent
        if ((registeringParent && registeringParent !== "none") && registeringParent.user.id !== parentOfCurrentStudent) {
            // if not, warn user they're about to discard everything with the current registering parent
            setDiscardParentWarning(true);
        } else if ((registeringParent && registeringParent !== "none") && registeringParent.user.id === parentOfCurrentStudent) {
            //registering parent is the same as the current student's parent
            api.addCourseRegistration(courseToRegister(enrollment,courses[enrollment.course_id], students[enrollment.student_id]));
            history.push("/registration/cart/");
        } else if (!registeringParent || registeringParent === "none") {
            api.setParentAddCourseRegistration(parentOfCurrentStudent,
                courseToRegister(enrollment,courses[enrollment.course_id], students[enrollment.student_id]));
            history.push("/registration/cart/");
        }
    };

    const closeDiscardParentWarning = (toContinue) => event => {
        event.preventDefault();
        setDiscardParentWarning(false);
        if (toContinue) {
            api.setParentAddCourseRegistration(parentOfCurrentStudent,
                courseToRegister(enrollment,courses[enrollment.course_id], students[enrollment.student_id]));
            history.push("/registration/cart/");
        }
    };

    const renderComponent = () => {
        switch(componentOption){
            case "button":{
                return <Button
                    onClick={handleRegisterMoreSessions}
                    className={"button add-sessions"}
                >
                    Add Sessions
                </Button>
            }
            case "menuItem":{
                return <MenuItem
                    onClick={handleRegisterMoreSessions}
                >
                    Add Sessions
                </MenuItem>
            }
        }
    };

    return <>
        {renderComponent()}
        <Dialog
            open={discardParentWarning}
            onClose={closeDiscardParentWarning(false)}
            aria-labelledby="warn-discard-parent"
        >
            <DialogTitle id="warn-discard-parent">
                {"Finished registering parent?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`
                        You are currently registering ${(registeringParent && registeringParent !== "none") && registeringParent.user.name}. If you wish to continue to add sessions, you will
                        discard all of the currently registered courses with this parent.
                        `}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color={"secondary"}
                    onClick={closeDiscardParentWarning(true)}>
                    Continue & Add Session
                </Button>
                <Button
                    color={"primary"}
                    onClick={closeDiscardParentWarning(false)}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    </>;
};

AddSessions.propTypes = {
    componentOption: PropTypes.string.isRequired,
    parentOfCurrentStudent: PropTypes.string.isRequired,
    enrollment: PropTypes.object.isRequired,
};

