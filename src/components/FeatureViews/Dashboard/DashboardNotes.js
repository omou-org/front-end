import React, {useEffect, useMemo, useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/AddOutlined";
import TextField from "@material-ui/core/TextField";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import InputBase from "@material-ui/core/InputBase";

import Grid from "@material-ui/core/Grid";
import * as hooks from "actions/hooks";
import * as userActions from "actions/userActions";
import {fetchAccountNotes, useAccountNotes} from "actions/userActions";
import Dashboard from "./Dashboard";
import Loading from "components/Loading";
import DashboardNotesCard from "./DashboardNotesCard";


const DashboardNotes = (owner) => {
    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(userActions, dispatch), );

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

    const ownerID = (owner.id);
    const ownerType = 'receptionist';
    useAccountNotes(ownerID, ownerType);
    const userList = useSelector(({Users}) => Users);
    let newArray;
    let currentUser
    let noteList;

    const openNewNote = useCallback(() => {
        setAlert(true);
        setEditID(null);
        setNoteBody("");
        setNoteTitle("");
        setNotification(false);
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

    const chooseUser = (userList) => {
        return userList.user_id===ownerID
    }

    const adminStatus = hooks.useAdmin();

if (hooks.isLoading(adminStatus)) {
    return (
        <Loading
            loadingText="NOTES ARE LOADING"
            small />
    );  
}

else if (Object.values(userList.ReceptionistList).length>0) {
    const displayNotes = Object.values(userList.ReceptionistList);
    newArray = displayNotes
    currentUser = newArray.filter(chooseUser);
    noteList = Object.values(currentUser[0].notes)
}
 
    return (
        <>
        <Grid
            item>
            <div
                className="addNote"
                onClick={openNewNote}>
                <Typography className="center">
                    <AddIcon /><br />Add Note
                </Typography>
            </div>
        </Grid>
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

        {noteList.map((notes)=>(
        <DashboardNotesCard
            key={notes}
            notes={notes}
            />
        ))}

        </>
    );
};


export default DashboardNotes;