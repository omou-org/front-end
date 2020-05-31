import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";

import AddIcon from "@material-ui/icons/AddOutlined";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DoneIcon from "@material-ui/icons/CheckCircleOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import Loading from "components/Loading";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import "./Notes.scss";
import "../Accounts/TabComponents/TabComponents.scss";
import * as hooks from "actions/hooks";
import * as userActions from "actions/userActions";
import {
    DELETE_ACCOUNT_NOTE_SUCCESSFUL,
    DELETE_COURSE_NOTE_SUCCESSFUL,
    DELETE_ENROLLMENT_NOTE_SUCCESSFUL,
    PATCH,
    POST,
} from "actions/actionTypes";
import {instance, REQUEST_STARTED} from "actions/apiActions";

const useStyles = makeStyles({
    "actionIcons": {
        "position": "absolute",
        "bottom": "5%",
        "right": "5%",
    },
    "notesTitle": {
        "letterSpacing": "0.01071em",
        "fontSize": "0.875rem",
    },
});

const numericDateString = (date) => new Date(date).toLocaleTimeString("en-US", {
    "day": "numeric",
    "hour": "2-digit",
    "minute": "2-digit",
    "month": "numeric",
});

const QUERIES = {
    "account": gql`
        query AccountNotesQuery($ownerID: Int!) {
            notes(userId: $ownerID) {
                id
                body
                complete
                important
                timestamp
                title
            }
        }
    `,
    "course": gql`
        query CourseNotesQuery($ownerID: Int!) {
            courseNotes(courseId: $ownerID) {
                id
                body
                complete
                important
                timestamp
                title
            }
        }
    `,
    "enrollment": gql`
        query CourseNotesQuery($ownerID: Int!) {
            enrollmentNotes(enrollmentId: $ownerID) {
                id
                body
                complete
                important
                timestamp
                title
            }
        }
    `,
};

const DATA_KEY = {
    "account": "notes",
    "course": "courseNotes",
    "enrollment": "enrollmentNotes",
};


// eslint-disable-next-line complexity, max-statements
const Notes = ({ownerType, ownerID}) => {
    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(userActions, dispatch), [dispatch]);

    const {loading, err, data} = useQuery(QUERIES[ownerType], {
        "variables": {
            ownerID,
        },
    });

    const notes = data ? data[DATA_KEY[ownerType]] : [];
    const getNoteByID = useCallback(
        (noteID) => notes.find(({id}) => noteID == id), [notes],
    );

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
    const [submitError, setError] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [deleteError, setDeleteError] = useState(false);
    const classes = useStyles();

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
        setDeleteID(null);
        setError(false);
        setDeleteError(false);
    }, []);

    const notificationColor = useMemo(() => ({
        "color": notification ? "red" : "grey",
        "cursor": "pointer",
    }), [notification]);

    // eslint-disable-next-line max-statements
    const saveNote = useCallback(() => {
        switch (ownerType) {
            case "enrollment": {
                const note = {
                    "body": noteBody,
                    "complete": false,
                    "enrollment": ownerID.enrollmentID,
                    "important": notification,
                    "title": noteTitle,
                };
                if (editID) {
                    api.patchEnrollmentNote(
                        editID,
                        note,
                        ownerID.enrollmentID,
                        ownerID.studentID,
                        ownerID.courseID,
                    );
                    setIsPost(false);
                } else {
                    api.postEnrollmentNote(
                        note,
                        ownerID.enrollmentID,
                        ownerID.studentID,
                        ownerID.courseID,
                    );
                    setIsPost(true);
                }
                setSubmitting(true);
                break;
            }
            case "course": {
                const note = {
                    "body": noteBody,
                    "complete": false,
                    "course": ownerID,
                    "important": notification,
                    "title": noteTitle,
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

    const openDelete = (noteID) => () => {
        setDeleteID(noteID);
    };

    const toggleNoteField = useCallback(
        (noteID, field) => () => {
            const note = {
                [field]: !getNoteByID(noteID)[field],
            };
            switch (ownerType) {
                case "enrollment":
                    api.patchEnrollmentNote(
                        noteID,
                        note,
                        ownerID.enrollmentID,
                        ownerID.studentID,
                        ownerID.courseID,
                    );
                    break;
                case "course":
                    api.patchCourseNote(noteID, note, ownerType, ownerID);
                    break;
                default:
                    api.patchAccountNote(noteID, note, ownerType, ownerID);
            }
        },
        [api, ownerType, ownerID, getNoteByID],
    );

    const handleDelete = useCallback(async () => {
        let URL = "",
            type = "";
        switch (ownerType) {
            case "course":
                URL = "/course/catalog_note/";
                type = DELETE_COURSE_NOTE_SUCCESSFUL;
                break;
            case "enrollment":
                URL = "/course/enrollment_note/";
                type = DELETE_ENROLLMENT_NOTE_SUCCESSFUL;
                break;
            default:
                URL = "/account/note/";
                type = DELETE_ACCOUNT_NOTE_SUCCESSFUL;
                break;
        }
        try {
            await instance.delete(`${URL}${deleteID}/`);
            dispatch({
                "payload": {
                    "noteID": deleteID,
                    ownerID,
                    ownerType,
                },
                type,
            });
            hideWarning();
        } catch {
            // if note not actually deleted
            setDeleteError(true);
        }
    }, [deleteID, dispatch, hideWarning, ownerID, ownerType]);

    if (loading) {
        return <Loading loadingText="NOTES LOADING" small />;
    }

    if (err) {
        return <LoadingError error="notes" />;
    }

    if (submitting && alert) {
        if (isPost && postRequestStatus && postRequestStatus !== REQUEST_STARTED) {
            setSubmitting(false);
            if (hooks.isFail(postRequestStatus)) {
                setError(true);
            } else {
                setAlert(false);
            }
        } else if (
            !isPost &&
            patchRequestStatus &&
            patchRequestStatus !== REQUEST_STARTED
        ) {
            setSubmitting(false);
            if (hooks.isFail(patchRequestStatus)) {
                setError(true);
            } else {
                setAlert(false);
            }
        }
    }

    return (
        <Grid className="notes-container" container item md={12} spacing={2}>
            <Dialog aria-describedby="simple-modal-description"
                aria-labelledby="simple-modal-title" className="popup" fullWidth
                maxWidth="xs" onClose={hideWarning} open={alert}>
                <DialogTitle>
                    <TextField className="textfield" id="standard-name"
                        onChange={handleTitleUpdate} value={noteTitle} />
                    <Tooltip interactive title="This is an Important Note!">
                        <NotificationIcon className="notification"
                            onClick={toggleNotification}
                            style={notificationColor} />
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <InputBase className="note-body"
                        inputProps={{"aria-label": "naked"}} multiline
                        onChange={handleBodyUpdate}
                        placeholder="Body (required)" required rows={15}
                        value={noteBody} variant="filled" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={hideWarning} variant="outlined">
                        Cancel
                    </Button>
                    <Button color="primary" disabled={!noteBody}
                        onClick={saveNote} variant="outlined">
                        {submitting ? "Saving..." : "Save"}
                    </Button>
                    {!submitting && submitError &&
                        <span style={{"float": "right"}}>
                            Error while saving!
                        </span>}
                </DialogActions>
            </Dialog>
            <Dialog aria-describedby="simple-modal-description"
                aria-labelledby="simple-modal-title" className="delete-popup"
                fullWidth maxWidth="xs" onClose={hideWarning}
                open={deleteID !== null}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {getNoteByID(deleteID) &&
                        getNoteByID(deleteID).title ?
                        `"${getNoteByID(deleteID).title}"` :
                        "this note"}?
                </DialogContent>
                <DialogActions className="delete-actions">
                    <Button className="cancel-button" onClick={hideWarning}
                        variant="contained">
                        Cancel
                    </Button>
                    <Button className="delete-button" onClick={handleDelete}
                        variant="contained">
                        Delete
                    </Button>
                    {deleteError &&
                        <span style={{"float": "right"}}>
                            Error while deleting!
                        </span>}
                </DialogActions>
            </Dialog>
            <Grid item md={3}>
                <div className="addNote" onClick={openNewNote}
                    style={{"cursor": "pointer"}}>
                    <Typography className="center">
                        <AddIcon /><br />Add Note
                    </Typography>
                </div>
            </Grid>
            {notes && Object.values(notes).map((note) => (
                <Grid item key={note.id || note.body} xs={3}>
                    <Paper className="note" elevation={2}>
                        <Typography align="left"
                            className={`noteHeader ${classes.notesTitle}`}>
                            {note.title}
                            <NotificationIcon className="noteNotification"
                                onClick={toggleNoteField(note.id, "important")}
                                style={note.important ? {"color": "red"} : {}} />
                        </Typography>
                        <Typography align="left" className="body">
                            {note.body}
                        </Typography>
                        <Typography className="date" style={{"fontWeight": "500"}}>
                            {numericDateString(note.timestamp)}
                        </Typography>
                        <div className={`actions ${classes.actionIcons}`}>
                            <Delete className="icon" onClick={openDelete(note.id)} />
                            <EditIcon className="icon" onClick={openExistingNote(note)} />
                            <DoneIcon className="icon"
                                onClick={toggleNoteField(note.id, "complete")}
                                style={note.complete ? {"color": "#43B5D9"} : {}} />
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
            "courseID": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            "enrollmentID": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            "studentID": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
