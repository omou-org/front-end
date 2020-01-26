import React, {useCallback, useEffect, useMemo, useState} from "react";
import * as userActions from "../../../actions/userActions";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";

import AddIcon from "@material-ui/icons/AddOutlined";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/CheckCircleOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import Modal from "@material-ui/core/Modal";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "../Accounts/TabComponents/TabComponents.scss";
import {GET, PATCH, POST} from "../../../actions/actionTypes";
import {REQUEST_STARTED} from "../../../actions/apiActions";

const numericDateString = (date) => {
    const DateObject = new Date(date);
    return DateObject.toLocaleTimeString("en-US", {
        "day": "numeric",
        "hour": "2-digit",
        "minute": "2-digit",
        "month": "numeric",
    });
};

const Notes = ({userRole, userID}) => {
    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(userActions, dispatch), [dispatch]);
    const user = useSelector(({Users, Course}) => {
        switch (userRole) {
            case "student":
                return Users.StudentList[userID];
            case "parent":
                return Users.ParentList[userID];
            case "instructor":
                return Users.InstructorList[userID];
            case "receptionist":
                return Users.ReceptionistList[userID];
            case "course":
                return Course.NewCourseList[userID];
            default:
                return -1;
        }
    });

    const getRequestStatus = useSelector(({RequestStatus}) =>
        userRole === "course"
            ? RequestStatus.courseNote[GET][userID]
            : RequestStatus.note[GET][userID]);
    const postRequestStatus = useSelector(({RequestStatus}) =>
        userRole === "course"
            ? RequestStatus.courseNote[POST]
            : RequestStatus.note[POST]);
    const patchRequestStatus = useSelector(({RequestStatus}) =>
        userRole === "course"
            ? RequestStatus.courseNote[PATCH][userID]
            : RequestStatus.note[PATCH][userID]);

    const [alert, setAlert] = useState(false);
    const [noteBody, setNoteBody] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [editID, setEditID] = useState(null);
    const [notification, setNotification] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isPost, setIsPost] = useState(false);
    const [error, setError] = useState(false);

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
        if (userRole === "course") {
            const note = {
                "body": noteBody,
                "complete": false,
                "important": notification,
                "title": noteTitle,
                "course": userID,
            };
            if (editID) {
                api.patchCourseNote(editID, note, userRole);
                setIsPost(false);
            } else {
                api.postCourseNote(note, userRole);
                setIsPost(true);
            }
            setSubmitting(true);
        } else {
            const note = {
                "body": noteBody,
                "complete": false,
                "important": notification,
                "title": noteTitle,
                "user": userID,
            };
            if (editID) {
                api.patchNote(editID, note, userRole);
                setIsPost(false);
            } else {
                api.postNote(note, userRole);
                setIsPost(true);
            }
            setSubmitting(true);
        }
    }, [api, noteBody, notification, noteTitle, userID, userRole, editID]);

    if (!getRequestStatus || getRequestStatus === REQUEST_STARTED) {
        return "Loading notes...";
    }

    if (getRequestStatus < 200 || getRequestStatus >= 300) {
        return "Error loading notes!";
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
                            margin="normal"
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
            {user.notes && Object.values(user.notes).map((note) => (
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
    "userID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    "userRole": PropTypes.string.isRequired,
};

export default Notes;
