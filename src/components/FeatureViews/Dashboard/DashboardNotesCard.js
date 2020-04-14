import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import Card from '@material-ui/core/Card';
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { TextField } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DoneIcon from "@material-ui/icons/CheckCircleOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import Loading from "components/Loading";
import * as userActions from "actions/userActions";
import * as hooks from "actions/hooks";
import {
    DELETE_ACCOUNT_NOTE_SUCCESSFUL,
    GET,
    PATCH,
    POST,
} from "actions/actionTypes";
import {instance, REQUEST_STARTED} from "actions/apiActions";

const DashboardNotesCard = (noteList) => {

    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(userActions, dispatch),);

    const ownerID = noteList.user_id;
    const ownerType = noteList.admin_type

    const getRequestStatus = useSelector(({RequestStatus}) => {
        return RequestStatus.accountNote[GET][ownerID];
    });

    const postRequestStatus = useSelector(({RequestStatus}) => {
        return RequestStatus.accountNote[POST];
    });

    const patchRequestStatus = useSelector(({RequestStatus}) => {
        return RequestStatus.accountNote[PATCH][ownerID];
    });

    const [alert, setAlert] = useState(false);
    const [noteBody, setNoteBody] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [editID, setEditID] = useState(null);
    const [notification, setNotification] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isPost, setIsPost] = useState(false);
    const [error, setError] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [deleteError, setDeleteError] = useState(false);

    const numericDateString = (date) =>
    (new Date(date)).toLocaleTimeString("en-US", {
        "day": "numeric",
        "hour": "2-digit",
        "minute": "2-digit",
        "month": "numeric",
    });

    const hideWarning = useCallback(() => {
        setAlert(false);
        setDeleteID(null);
        setError(false);
        setDeleteError(false);
    }, []);

    const handleTitleUpdate = useCallback((event) => {
        setNoteTitle(event.target.value);
    }, []);

    const handleBodyUpdate = useCallback((event) => {
        setNoteBody(event.target.value);
    }, []);

    const toggleNotification = useCallback(() => {
        setNotification((prevNotification) => !prevNotification);
    }, []);

    const notificationColor = useEffect(() => ({
        "color": notification ? "red" : "grey",
        "cursor": "pointer",
    }), [notification]);

    const saveNote = useCallback(() => {
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
                
    }, [api, noteBody, notification, noteTitle, ownerID, ownerType, editID]);

    const handleDelete = useCallback(async () => {
        const URL = "/account/note/";
        const type = DELETE_ACCOUNT_NOTE_SUCCESSFUL;
                
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
        } catch (err) {
            // if note not actually deleted
            setDeleteError(true);
        }
    }, [deleteID, dispatch, hideWarning, ownerID, ownerType]);

    const toggleNoteField = useCallback((noteID, field) => () => {
        const note = {
            [field]: !noteList.notes.important,
        };
        api.patchAccountNote(noteID, note, ownerType, ownerID);
    }, [api, noteList.notes, ownerType, ownerID]);


    const openExistingNote = useCallback((note) => () => {
        setAlert(true);
        setEditID(note.id);
        setNoteBody(note.body);
        setNoteTitle(note.title);
        setNotification(note.important);
    }, []);

    const openDelete = (noteID) => () => {
        setDeleteID(noteID);
    };


    if (hooks.isLoading(getRequestStatus) &&
        (!noteList.notes || Object.entries(noteList.notes).length === 0)) {
        return (
            <Loading
                loadingText="noteList.notes LOADING"
                small />
        );
    }

    if (hooks.isFail(getRequestStatus) &&
        (!noteList.notes || Object.entries(noteList.notes).length === 0)) {
        return "Error loading notes!";
    }

    if (submitting && alert) {
        if (isPost && postRequestStatus && postRequestStatus !== REQUEST_STARTED) {
            setSubmitting(false);
            if (hooks.isFail(postRequestStatus)) {
                setError(true);
            } else {
                setAlert(false);
            }
        } else if (!isPost && patchRequestStatus && patchRequestStatus !== REQUEST_STARTED) {
            setSubmitting(false);
            if (hooks.isFail(patchRequestStatus)) {
                setError(true);
            } else {
                setAlert(false);
            }
        }
    }
    
    console.log(noteList)

    return(
        <Card container className="note-container">
            <Dialog
                aria-describedby="simple-modal-description"
                aria-labelledby="simple-modal-title"
                className="popup"
                fullWidth
                maxWidth="xs"
                onClose={hideWarning}
                open={alert}>
                <DialogTitle>
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
                </DialogTitle>
                <DialogContent>
                    <InputBase
                        className="note-body"
                        inputProps={{"aria-label": "naked"}}
                        multiline
                        onChange={handleBodyUpdate}
                        placeholder="Body (required)"
                        required
                        rows={15}
                        value={noteBody}
                        variant="filled" />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={hideWarning}
                        variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        disabled={!noteBody}
                        onClick={saveNote}
                        variant="outlined">
                        {submitting ? "Saving..." : "Save"}
                    </Button>
                    {
                        !submitting && error &&
                        <span style={{"float": "right"}}>
                                Error while saving!
                        </span>
                    }
                </DialogActions>
            </Dialog>
            <Dialog
                aria-describedby="simple-modal-description"
                aria-labelledby="simple-modal-title"
                className="delete-popup"
                fullWidth
                maxWidth="xs"
                onClose={hideWarning}
                open={deleteID !== null}>
                <DialogTitle>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {
                        noteList.notes[deleteID] && noteList.notes[deleteID].title
                            ? `"${noteList.notes[deleteID].title}"`
                            : "this note"
                    }?
                </DialogContent>
                <DialogActions className="delete-actions">
                    <Button
                        className="cancel-button"
                        onClick={hideWarning}
                        variant="contained">
                        Cancel
                    </Button>
                    <Button
                        className="delete-button"
                        onClick={handleDelete}
                        variant="contained">
                        Delete
                    </Button>
                    {
                        deleteError &&
                        <span style={{"float": "right"}}>
                            Error while deleting!
                        </span>
                    }
                </DialogActions>
            </Dialog>
            <Grid container>
                <Grid item xs={9}>
                    <Tooltip title={noteList.notes.title}>
                        <Typography variant='h5' gutterBottom wrap="nowrap">
                            {noteList.notes.title}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={3}>
                    <AnnouncementIcon
                        className="noteNotification"
                        onClick={toggleNoteField(noteList.notes.id, "important")}
                        style={noteList.notes.important ? {"color": "red"} : {}} />
                </Grid>
            </Grid>
            <br/>
            <Typography variant='body1' gutterBottom>
                {noteList.notes.body}
            </Typography>

            <Grid item xs={5}>
                <Typography variant='subtitle2' gutterBottom className='datetime'>
                    {numericDateString(noteList.notes.timestamp)}
                </Typography>
            </Grid>

            <Grid item xs={5} className='button-group'>
                <Delete
                    className="icon"
                    onClick={openDelete(noteList.notes.id)} />
                <EditIcon
                    className="icon"
                    onClick={openExistingNote(noteList.notes)} />
                <DoneIcon
                    className="icon"
                    onClick={toggleNoteField(noteList.notes.id, "complete")}
                    style={noteList.notes.complete ? {"color": "#43B5D9"} : {}} />
            </Grid>
        </Card>
    )

}

export default DashboardNotesCard