import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import AddIcon from "@material-ui/icons/AddOutlined";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import Avatar from "@material-ui/core/Avatar";
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
import Loading from "components/OmouComponents/Loading";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton'

import "./Notes.scss";
import {
    DELETE_ACCOUNT_NOTE_SUCCESSFUL,
    DELETE_COURSE_NOTE_SUCCESSFUL,
    DELETE_ENROLLMENT_NOTE_SUCCESSFUL,
} from "actions/actionTypes";
import { instance } from "actions/apiActions";

const useStyles = makeStyles((theme) => ({
    "icons": {
        padding: "3px",
        transform: "scale(.8)",
    },
    "notePaper": {
        height: "150px"
    },
    "notesTitle": {
        letterSpacing: "0.01071em",
        fontSize: "0.875rem",
    },
    "dateDisplay": {
        bottom: "40px !important",
        fontSize: ".825rem",
        position: "relative",
        padding: "3px",
        [theme.breakpoints.down('lg')]: {
            fontSize: ".625rem",
            fontWeight: "200px"
        }
    },
    "actionDashboardIcons": {
        float: "left",
        padding: "0"
    },
    "notesNotification": {
        cursor: "pointer",
        height: "30px",
        width: "30px",
        [theme.breakpoints.down('md')]: {
            height: "20px",
            width: "20px"
        }
    },
    "actionIcons": {
        "bottom": "5%",
        "position": "absolute",
        "right": "5%",
    },
    "addNote": {
        "backgroundColor": "#f5f5f5",
        "border": "1.5px dashed #999999",
        "cursor": "pointer",
        "height": "250px",
        "padding": "7%",
        "position": "relative",
    },
    "center": {
        "paddingTop": "35%",
    },
    "deleteActions": {
        "& Button": {
            "color": "white",
        },
    },
    "deleteButton": {
        "backgroundColor": theme.palette.error.main,
    },
    "notesTitle": {
        "fontSize": "0.875rem",
        "letterSpacing": "0.01071em",
    },
}));

const numericDateString = (date) => new Date(date).toLocaleTimeString("en-US", {
    "day": "numeric",
    "hour": "2-digit",
    "minute": "2-digit",
    "month": "numeric",
});

const QUERIES = {
    "account": gql`
        query AccountNotesQuery($ownerID: ID!) {
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
        query CourseNotesQuery($ownerID: ID!) {
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
        query CourseNotesQuery($ownerID: ID!) {
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

const MUTATIONS = {
    "account": gql`
        mutation CreateAccountNote($ownerID: ID!, $title: String, $body: String,
            $complete: Boolean, $important: Boolean, $id: ID) {
            createNote(userId: $ownerID, title: $title, important: $important,
                body: $body, complete: $complete, id: $id) {
                note {
                    id
                    body
                    complete
                    important
                    timestamp
                    title
                }
            }
        }`,
    "course": gql`
        mutation CreateCourseNote($ownerID: ID!, $title: String, $body: String,
            $complete: Boolean, $important: Boolean, $id: ID) {
            createCourseNote(course: $ownerID, title: $title, id: $id,
                important: $important, body: $body, complete: $complete) {
                courseNote {
                    id
                    body
                    complete
                    important
                    timestamp
                    title
                }
            }
        }`,
    "enrollment": gql`
        mutation CreateEnrollmentNote($ownerID: ID!, $title: String, $id: ID,
            $body: String, $complete: Boolean, $important: Boolean) {
            createEnrollmentNote(enrollment: $ownerID, title: $title, id: $id,
                important: $important, body: $body, complete: $complete) {
                enrollmentNote {
                    id
                    body
                    complete
                    important
                    timestamp
                    title
                }
            }
        }`,
};

const QUERY_KEY = {
    "account": "notes",
    "course": "courseNotes",
    "enrollment": "enrollmentNotes",
};

const MUTATION_KEY = {
    "account": "createNote",
    "course": "createCourseNote",
    "enrollment": "createEnrollmentNote",
};

// eslint-disable-next-line max-statements
const Notes = ({ ownerType, ownerID, isDashboard }) => {
    const dispatch = useDispatch();

    const [alert, setAlert] = useState(false);
    const [noteBody, setNoteBody] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [editID, setEditID] = useState(null);
    const [important, setImportant] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [deleteError, setDeleteError] = useState(false);
    const classes = useStyles();

    const [mutateNote, createResults] = useMutation(MUTATIONS[ownerType], {
        "onCompleted": () => {
            setAlert(false);
        },
        "update": (cache, { data }) => {
            const [newNote] = Object.values(data[MUTATION_KEY[ownerType]]);
            const cachedNotes = cache.readQuery({
                "query": QUERIES[ownerType],
                "variables": { ownerID },
            })[QUERY_KEY[ownerType]];

            let updatedNotes = [...cachedNotes];
            const matchingIndex = updatedNotes.findIndex(({ id }) => id === newNote.id);
            if (matchingIndex === -1) {
                updatedNotes = [...cachedNotes, newNote];
            } else {
                updatedNotes[matchingIndex] = newNote;
            }
            
            cache.writeQuery({
                "data": {
                    [QUERY_KEY[ownerType]]: updatedNotes,
                },
                "query": QUERIES[ownerType],
                "variables": { ownerID },
            });
        },
    });

    const query = useQuery(QUERIES[ownerType], {
        "variables": { ownerID },
    });

    const notes = query.data?.[QUERY_KEY[ownerType]] || [];
    const getNoteByID = useCallback(
        (noteID) => notes.find(({ id }) => noteID == id), [notes],
    );

    const openNewNote = useCallback(() => {
        setAlert(true);
        setEditID(null);
        setNoteBody("");
        setNoteTitle("");
        setImportant(false);
    }, []);

    const openExistingNote = useCallback((note) => () => {
        setAlert(true);
        setEditID(note.id);
        setNoteBody(note.body);
        setNoteTitle(note.title);
        setImportant(note.important);
    }, []);

    const handleBodyUpdate = useCallback((event) => {
        setNoteBody(event.target.value);
    }, []);

    const handleTitleUpdate = useCallback((event) => {
        setNoteTitle(event.target.value);
    }, []);

    const toggleImportant = useCallback(() => {
        setImportant((prevImportant) => !prevImportant);
    }, []);

    const hideWarning = useCallback(() => {
        setAlert(false);
        setDeleteID(null);
        setDeleteError(false);
    }, []);

    const notificationColor = useMemo(() => ({
        "color": important ? "red" : "grey",
        "cursor": "pointer",
    }), [important]);

    const saveNote = useCallback(() => {
        mutateNote({
            "variables": {
                "body": noteBody,
                "complete": false,
                "id": editID,
                important,
                ownerID,
                "title": noteTitle,
            },
        });
    }, [mutateNote, editID, important, noteBody, noteTitle, ownerID]);

    const openDelete = useCallback((noteID) => () => {
        setDeleteID(noteID);
    }, []);

    const toggleNoteField = useCallback((noteID, field) => () => {
        mutateNote({
            "variables": {
                [field]: !getNoteByID(noteID)[field],
                "id": noteID,
                ownerID,
            },
        });
    }, [mutateNote, ownerID, getNoteByID]);

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

    if (query.loading) {
        return <Loading loadingText="NOTES LOADING" small />;
    }

    if (query.error) {
        return <LoadingError error="notes" />;
    }

    // return (
    //     <Grid
    //         className="notes-container"
    //         container
    //         item
    //         xs={12}
    //         spacing={2}>
    //         <Dialog
    //             aria-describedby="simple-modal-description"
    //             aria-labelledby="simple-modal-title"
    //             className="popup"
    //             fullWidth
    //             maxWidth="xs"
    //             onClose={hideWarning}
    //             open={alert}>
    //             <DialogTitle>
    //                 <TextField
    //                     className="textfield"
    //                     id="standard-name"
    //                     label="Subject"
    //                     onChange={handleTitleUpdate}
    //                     value={noteTitle} />
    //                 <NotificationIcon
    //                     className="notification"
    //                     onClick={toggleImportant}
    //                     style={notificationColor} />
    //             </DialogTitle>
    //             <DialogContent>
    //                 <InputBase
    //                     className="note-body"
    //                     inputProps={{"aria-label": "naked"}}
    //                     multiline
    //                     onChange={handleBodyUpdate}
    //                     placeholder="Body (required)"
    //                     required
    //                     rows={15}
    //                     value={noteBody}
    //                     variant="filled" />
    //             </DialogContent>
    //             <DialogActions>
    //                 <Button
    //                     onClick={hideWarning}
    //                     variant="outlined">
    //                     Cancel
    //                 </Button>
    //                 <Button
    //                     color="primary"
    //                     disabled={!noteBody || createResults.loading}
    //                     onClick={saveNote}
    //                     variant="outlined">
    //                     {createResults.loading ? "Saving..." : "Save"}
    //                 </Button>
    //                 {
    //                     createResults.error &&
    //                     <span style={{"float": "right"}}>
    //                             Error while saving!
    //                     </span>
    //                 }
    //             </DialogActions>
    //         </Dialog>
    //         <Dialog
    //             aria-describedby="simple-modal-description"
    //             aria-labelledby="simple-modal-title"
    //             className="delete-popup"
    //             fullWidth
    //             maxWidth="xs"
    //             onClose={hideWarning}
    //             open={deleteID !== null}>
    //             <DialogTitle>
    //                 Confirm Delete
    //             </DialogTitle>
    //             <DialogContent>
    //                 Are you sure you want to delete {
    //                     notes[deleteID] && notes[deleteID].title
    //                         ? `"${notes[deleteID].title}"`
    //                         : "this note"
    //                 }?
    //             </DialogContent>
    //             <DialogActions className="delete-actions">
    //                 <Button
    //                     className="cancel-button"
    //                     onClick={hideWarning}
    //                     variant="contained">
    //                     Cancel
    //                 </Button>
    //                 <Button
    //                     className="delete-button"
    //                     onClick={handleDelete}
    //                     variant="contained">
    //                     Delete
    //                 </Button>
    //                 {
    //                     deleteError &&
    //                     <span style={{"float": "right"}}>
    //                         Error while deleting!
    //                     </span>
    //                 }
    //             </DialogActions>
    //         </Dialog>

    return (
        <Grid container item md={12} spacing={2}>
            <Dialog aria-describedby="simple-modal-description"
                aria-labelledby="simple-modal-title" className="popup" fullWidth
                maxWidth="xs" onClose={hideWarning} open={alert}>
                <DialogTitle>
                    <TextField className="textfield" id="standard-name"
                        onChange={handleTitleUpdate} placeholder="Title"
                        value={noteTitle} />
                    <Tooltip interactive title="This is an Important Note!">
                        <NotificationIcon className="notification"
                            onClick={toggleImportant}
                            style={notificationColor} />
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <InputBase className="note-body"
                        inputProps={{ "aria-label": "naked" }} multiline
                        onChange={handleBodyUpdate}
                        placeholder="Body (required)" required rows={15}
                        value={noteBody} variant="filled" />
                </DialogContent>
                <DialogActions>
                    <ResponsiveButton onClick={hideWarning} variant="outlined">
                        Cancel
                    </ResponsiveButton>
                    <ResponsiveButton 
                        color="primary"
                        disabled={!noteBody || createResults.loading}
                        onClick={saveNote} 
                        variant="outlined"
                    >
                        {createResults.loading ? "Saving..." : "Save"}
                    </ResponsiveButton>
                    {createResults.error &&
                        <span style={{ "float": "right" }}>
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
                    Are you sure you want to delete {
                        getNoteByID(deleteID)?.title ?
                            `"${getNoteByID(deleteID).title}"` :
                            "this note"
                    }?
                </DialogContent>
                <DialogActions className={classes.deleteActions}>
                    <ResponsiveButton 
                        color="primary" 
                        onClick={hideWarning}
                        variant="contained"
                    >
                        Cancel
                    </ResponsiveButton>
                    <ResponsiveButton 
                        className={classes.deleteButton}
                        onClick={handleDelete}
                        variant="contained"
                    >
                        Delete
                    </ResponsiveButton>
                    {deleteError &&
                        <span style={{ "float": "right" }}>
                            Error while deleting!
                        </span>}
                </DialogActions>
            </Dialog>
            {isDashboard
                ? <>
                    <Grid item xs={9}>
                        <Typography
                            variant="h5"
                            style={{ marginTop: "10px" }}
                        >My Tasks
                            </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <AssignmentTurnedInIcon fontSize="large" style={{ marginTop: "10px" }} />
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        <div
                            className={`addNote ${classes.addNote}`}
                            onClick={openNewNote}
                            style={{ "cursor": "pointer", height: "100%", backgroundColor: "white" }}>
                            <Typography className="center" style={{ padding: 0 }}>
                                <AddIcon /> Add Note
                                    </Typography>
                        </div>
                    </Grid>
                </>
                : <Grid item md={3}>
                    <div className={classes.addNote} onClick={openNewNote}>
                        <Typography className={classes.center}>
                            <AddIcon /><br />Add Note
                                </Typography>
                    </div>
                </Grid>
            }

            {notes && isDashboard && Object.values(notes).map((note) => (
                <Grid item key={note.id || note.body} xs={12}>
                    <Paper className={`note ${classes.notePaper}`} elevation={2} >
                        <Typography align="left"
                            className={`noteHeader ${classes.notesTitle}`}>
                            {note.title}
                            <Avatar
                                variant="square"
                                className={`noteNotification ${isDashboard ? classes.notesNotification : null}`}
                                onClick={toggleNoteField(note.id, "important")}
                                style={note.important ? { "background-color": "red" } : {}}>
                                !
                            </Avatar>
                        </Typography>
                        <Typography align="left" className="body">
                            {note.body}
                        </Typography>
                        <Grid item xs={12}>
                            <Typography className={`date ${classes.dateDisplay}`}
                                style={{ "fontWeight": "500" }}>
                                {numericDateString(note.timestamp)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={`date ${classes.actionDashboardIcons}`}>
                                <IconButton
                                    className={classes.icons}
                                    onClick={openDelete(note.id)}
                                    size="small"
                                    edge="start">
                                    <Delete />
                                </IconButton>
                                <IconButton
                                    className={classes.icons}
                                    onClick={openExistingNote(note)}
                                    size="small">
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    className={classes.icons}
                                    onClick={toggleNoteField(note.id, "complete")}
                                    style={note.complete ? { "color": "#43B5D9" } : {}}
                                    size="small"
                                    edge="end">
                                    <DoneIcon />
                                </IconButton>
                            </div>
                        </Grid>
                    </Paper>
                </Grid>

            ))}
            {notes && !isDashboard && Object.values(notes).map((note) => (
                <Grid item key={note.id || note.body} xs={3}>
                    <Paper className="note" elevation={2}>
                        <Typography align="left"
                            className={`noteHeader ${classes.notesTitle}`}>
                            {note.title}
                            <NotificationIcon className="noteNotification"
                                onClick={toggleNoteField(note.id, "important")}
                                style={note.important ? { "color": "red" } : {}} />
                        </Typography>import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

                        <Typography align="left" className="body">
                            {note.body}
                        </Typography>
                        <Typography className="date"
                            style={{ "fontWeight": "500" }}>
                            {numericDateString(note.timestamp)}
                        </Typography>
                        <div className={`actions ${classes.actionIcons}`}>
                            <Delete className="icon"
                                onClick={openDelete(note.id)} />
                            <EditIcon className="icon"
                                onClick={openExistingNote(note)} />
                            <DoneIcon className="icon"
                                onClick={toggleNoteField(note.id, "complete")}
                                style={note.complete ? { "color": "#43B5D9" } : {}} />
                        </div>
                    </Paper>
                </Grid>

            ))}


        </Grid>
    )
};

Notes.propTypes = {
    "ownerID": PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    "ownerType": PropTypes.oneOf(["account", "course", "enrollment"])
        .isRequired,
};

export default Notes;
