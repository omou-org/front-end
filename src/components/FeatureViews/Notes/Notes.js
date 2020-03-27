import React, {useCallback, useEffect, useMemo, useState} from "react";
import * as userActions from "../../../actions/userActions";
import * as hooks from "actions/hooks";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";

import AddIcon from "@material-ui/icons/AddOutlined";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/CheckCircleOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import Loading from "components/Loading";
import Modal from "@material-ui/core/Modal";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError" 

import "../Accounts/TabComponents/TabComponents.scss";
import {GET, PATCH, POST} from "../../../actions/actionTypes";
import {REQUEST_STARTED} from "../../../actions/apiActions";

const numericDateString = (date) =>
    (new Date(date)).toLocaleTimeString("en-US", {
        "day": "numeric",
        "hour": "2-digit",
        "minute": "2-digit",
        "month": "numeric",
    });

const Notes = ({ownerType, ownerID}) => {
    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(userActions, dispatch), [dispatch]);
    const notes = useSelector(({Users, Course, Enrollments}) => {
        switch (ownerType) {
            case "student":
                return Users.StudentList[ownerID].notes;
            case "parent":
                return Users.ParentList[ownerID].notes;
            case "instructor":
                return Users.InstructorList[ownerID].notes;
            case "receptionist":
                return Users.ReceptionistList[ownerID].notes;
            case "course":
                return Course.NewCourseList[ownerID].notes;
            case "enrollment":
                return Enrollments[ownerID.studentID][ownerID.courseID].notes;
            default:
                return null;
        }
    });

    const getRequestStatus = useSelector(({RequestStatus}) => {
        switch (ownerType) {
            case "course":
                return RequestStatus.courseNote[GET][ownerID];
            case "enrollment":
                return RequestStatus.enrollmentNote[GET][ownerID.enrollmentID];
            default:
                return RequestStatus.accountNote[GET][ownerID];
        }
    });

    const postRequestStatus = useSelector(({RequestStatus}) => {
        switch (ownerType) {
            case "course":
                return RequestStatus.courseNote[POST];
            case "enrollment":
                return RequestStatus.enrollmentNote[POST];
            default:
                return RequestStatus.accountNote[POST];
        }
    });

    const patchRequestStatus = useSelector(({RequestStatus}) => {
        switch (ownerType) {
            case "course":
                return RequestStatus.courseNote[PATCH][ownerID];
            case "enrollment":
                return RequestStatus.enrollmentNote[PATCH][ownerID.enrollmentID];
            default:
                return RequestStatus.accountNote[PATCH][ownerID];
        }
    });

    const [alert, setAlert] = useState(false);
    const [noteBody, setNoteBody] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [editID, setEditID] = useState(null);
    const [notification, setNotification] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isPost, setIsPost] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (ownerType === "course") {
            api.fetchCourseNotes(ownerID);
        } else if (ownerType === "enrollment") {
            api.fetchEnrollmentNotes(ownerID.enrollmentID, ownerID.studentID, ownerID.courseID);
        } else {
            api.fetchAccountNotes(ownerID, ownerType);
        }
    }, [api, ownerID, ownerType]);

    const openNewNote = useCallback(() => {
        setAlert(true);
        setEditID(null);
        setNoteBody("");
        setNoteTitle("");
        setNotification(false);
    }, []);

    const openExistingNote = useCallback((note) => () => {
        setAlert(true);
        setEditID(note.id);
        setNoteBody(note.body);
        setNoteTitle(note.title);
        setNotification(note.important);
    }, []);

    const handleBodyUpdate = useCallback((event) => {
        setNoteBody(event.target.value);
    }, []);

    const handleTitleUpdate = useCallback((event) => {
        setNoteTitle(event.target.value);
    }, []);

    const toggleNotification = useCallback(() => {
        setNotification((prevNotification) => !prevNotification);
    }, []);

    const hideWarning = useCallback(() => {
        setAlert(false);
    }, []);

    const notificationColor = {
        "color": notification ? "red" : "grey",
        "cursor": "pointer",
    };

    const saveNote = useCallback(() => {
        switch (ownerType) {
            case "enrollment": {
                const note = {
                    "body": noteBody,
                    "complete": false,
                    "important": notification,
                    "title": noteTitle,
                    "enrollment": ownerID.enrollmentID,
                };
                if (editID) {
                    api.patchEnrollmentNote(editID, note, ownerID.enrollmentID, ownerID.studentID, ownerID.courseID);
                    setIsPost(false);
                } else {
                    api.postEnrollmentNote(note, ownerID.enrollmentID, ownerID.studentID, ownerID.courseID);
                    setIsPost(true);
                }
                setSubmitting(true);
                break;
            }
            case "course": {
                const note = {
                    "body": noteBody,
                    "complete": false,
                    "important": notification,
                    "title": noteTitle,
                    "course": ownerID,
                };
                if (editID) {
                    api.patchCourseNote(editID, note, ownerType, ownerID);
                    setIsPost(false);
                } else {
                    api.postCourseNote(note, ownerType);
                    setIsPost(true);
                }
                setSubmitting(true);
                break;
            }
            default: {
                const note = {
                    "body": noteBody,
                    "complete": false,
                    "important": notification,
                    "title": noteTitle,
                    "user": ownerID,
                };
                if (editID) {
                    api.patchAccountNote(editID, note, ownerType, ownerID);
                    setIsPost(false);
                } else {
                    api.postAccountNote(note, ownerType);
                    setIsPost(true);
                }
                setSubmitting(true);
            }
        }
    }, [api, noteBody, notification, noteTitle, ownerID, ownerType, editID]);

    if (hooks.isLoading(getRequestStatus) && (!notes || Object.entries(notes).length === 0)) {
        return <Loading small loadingText="NOTES LOADING" />;
    }

    if (hooks.isFail(getRequestStatus) && (!notes || Object.entries(notes).length === 0)) {
        return <LoadingError error="notes"/>;
    }

    if (submitting && alert) {
        if (isPost && postRequestStatus && postRequestStatus !== REQUEST_STARTED) {
            setSubmitting(false);
            if (postRequestStatus < 200 || postRequestStatus >= 300) {
                setError(true);
            } else {
                setAlert(false);
            }
        }
        if (!isPost && patchRequestStatus && patchRequestStatus !== REQUEST_STARTED) {
            setSubmitting(false);
            if (patchRequestStatus < 200 || patchRequestStatus >= 300) {
                setError(true);
            } else {
                setAlert(false);
            }
        }
    }

    return (
        <Grid
            container
            item
            md={12}
            spacing={16}>
            <Modal
                aria-describedby="simple-modal-description"
                aria-labelledby="simple-modal-title"
                className="popup"
                open={alert}>
                <div className="exit-popup">
                    <Grid>
                        <TextField
                            className="textfield"
                            id="standard-name"
                            label="Subject"
                            onChange={handleTitleUpdate}
                            value={noteTitle} />
                        <NotificationIcon
                            className="notification"
                            onClick={toggleNotification}
                            style={notificationColor} />
                    </Grid>
                    <Grid>
                        <InputBase
                            className="note-body"
                            inputProps={{"aria-label": "naked"}}
                            margin="normal"
                            multiline
                            onChange={handleBodyUpdate}
                            placeholder="Body (required)"
                            required
                            rows={15}
                            value={noteBody}
                            variant="filled" />
                    </Grid>
                    <Grid className="popUpActions">
                        <Button onClick={hideWarning}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!noteBody}
                            onClick={saveNote}>
                            {
                                submitting
                                    ? "Saving..."
                                    : "Save"
                            }
                        </Button>
                        {!submitting && error &&
                            <span style={{"float": "right"}}>
                                Error while saving!
                            </span>}
                    </Grid>
                </div>
            </Modal>
            <Grid
                item
                md={3}>
                <div
                    className="addNote"
                    onClick={openNewNote}
                    style={{
                        "cursor": "pointer",
                    }}>
                    <Typography className="center">
                        <AddIcon />
                        <br />
                        Add Note
                    </Typography>
                </div>
            </Grid>
            {notes && Object.values(notes).map((note) => (
                <Grid
                    item
                    key={note.id || note.body}
                    xs={3}>
                    <Paper className="note">
                        <Typography
                            align="left"
                            className="noteHeader">
                            {note.title}
                            {note.important &&
                                <NotificationIcon className="noteNotification" />}
                        </Typography>
                        <Typography
                            align="left"
                            className="body">
                            {note.body}
                        </Typography>
                        <Typography
                            className="date"
                            style={{"fontWeight": "500"}}>
                            {numericDateString(note.timestamp)}
                        </Typography>
                        <div className="actions">
                            <EditIcon
                                className="icon"
                                onClick={openExistingNote(note)} />
                            <DoneIcon className="icon" />
                        </div>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );

};

Notes.propTypes = {
    "ownerID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
            "courseID": PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            "enrollmentID": PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            "studentID": PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        }),
    ]).isRequired,
    "ownerType": PropTypes.oneOf([
        "course",
        "enrollment",
        "instructor",
        "parent",
        "receptionist",
        "student",
    ]).isRequired,
};

export default Notes;
