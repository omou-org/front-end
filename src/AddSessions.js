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
import {courseToRegister} from "utils";

/**
 * @description button/menu item to start registering for more sessions for a course.
 * This will display a warning popover in the case that you're about to override
 * an existing registering parent.
 * @param {String} componentOption this will either be a button or a menu item
 * @param {Number} parentOfCurrentStudent this is the id of the parent that will be registering
 * @param {Object} enrollment this is the enrollment we'll be updating
 */

const AddSessions = ({componentOption, parentOfCurrentStudent, enrollment}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const api = useMemo(
        () => bindActionCreators(registrationActions, dispatch),
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
                "Finished registering parent?"
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
    componentOption: PropTypes.oneOf(['button','menuItem']).isRequired,
    parentOfCurrentStudent: PropTypes.string.isRequired,
    enrollment: PropTypes.object.isRequired,
};

export default AddSessions;
