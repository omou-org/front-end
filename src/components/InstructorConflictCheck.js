import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import {instructorConflictCheck} from "utils";

const parseString = (string) => {
    const [sentence, eventName, remainder] = string.split("\"");
    return (
        <>
            {sentence}<br /><br />
            {eventName && <><b>{eventName}</b> <br /> <br /></>}
            {remainder && <>{remainder}<br /><br /></>}
        </>
    );
};

const InstructorConflictCheck = ({
    active = true, instructorID, start, end, eventID, onSubmit = () => {}, children,
}) => {
    const [open, setOpen] = useState(false);
    const [conflictText, setConflictText] = useState("");

    const closeDialog = useCallback(() => {
        setOpen(false);
    }, []);

    const openDialog = useCallback((message) => {
        setConflictText(parseString(message));
        setOpen(true);
    }, []);

    // detects if there's an actual conflict
    const conflictDetect = useCallback(({data}) =>
        data && data.status === false &&
        (!(data.conflicting_course || data.conflicting_session) ||
        (data.conflicting_course || data.conflicting_session) != eventID),
    [eventID]);

    const handleSubmit = useCallback(async () => {
        if (active) {
            const {session, course} = await instructorConflictCheck(
                instructorID, start, end
            );

            const seshConf = conflictDetect(session);
            const courseConf = conflictDetect(course);

            if (courseConf && seshConf) {
                openDialog(course.data.reason);
            } else if (courseConf) {
                // course conflict but the usual session is not there
                openDialog(`${course.data.reason}
                        but the session at this time is rescheduled.`);
            } else if (seshConf) {
                // session conflict but the usual course is not there
                openDialog(`${session.data.reason}
                        but the course is not normally taught at this time.`);
            } else {
                // no conflict
                onSubmit();
            }
        } else {
            onSubmit();
        }
    }, [active, conflictDetect, instructorID, start, end, onSubmit, openDialog]);

    return (
        <>
            <div onClick={handleSubmit}>
                {children}
            </div>
            {
                active &&
                <Dialog
                    onClose={closeDialog}
                    open={open}>
                    <DialogTitle>Scheduling Conflict</DialogTitle>
                    <DialogContent>
                        {conflictText}
                        Are you sure you want to continue?
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="secondary"
                            onClick={onSubmit}
                            variant="outlined">
                            Continue anyways
                        </Button>
                        <Button
                            color="primary"
                            onClick={closeDialog}
                            variant="outlined">
                            Go back
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    );
};

InstructorConflictCheck.propTypes = {
    "active": PropTypes.bool,
    "children": PropTypes.node.isRequired,
    "end": PropTypes.instanceOf(Date).isRequired,
    "eventID": PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    "instructorID": PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    "onSubmit": PropTypes.func,
    "start": PropTypes.instanceOf(Date).isRequired,
};

export default InstructorConflictCheck;
