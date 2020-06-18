import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {bindActionCreators} from "redux";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";

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
import Loading from "components/Loading";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {makeStyles} from "@material-ui/core/styles";

import "./Notes.scss";
import "../Accounts/TabComponents/TabComponents.scss";
import * as userActions from "actions/userActions";
import {
    DELETE_ACCOUNT_NOTE_SUCCESSFUL,
    DELETE_COURSE_NOTE_SUCCESSFUL,
    DELETE_ENROLLMENT_NOTE_SUCCESSFUL,
} from "actions/actionTypes";
import {instance} from "actions/apiActions";

const useStyles = makeStyles((theme) => ({
	actionIcons: {
		position: "absolute",
		bottom: "5%",
		right: "5%",
	},
	icons: {
		padding: "3px",
		transform: "scale(.8)",
	},
	notesTitle: {
		letterSpacing: "0.01071em",
		fontSize: "0.875rem",
	},
	dateDisplay: {
		fontSize: ".825rem",
		position: "relative",
		[theme.breakpoints.down('lg')]: {
			fontSize: ".625rem",
			fontWeight: "200px"
		}
	},
	actionDashboardIcons: {
		position: "absolute",
		bottom: "1%",
		right: "1%",
		[theme.breakpoints.down('lg')]: {
			transform: "scale(.5)",
			bottom: "0%",
			right: "0%"
		}
	},
	notesNotification: {
        [theme.breakpoints.down('md')]: {
            height: "20px",
            width: "20px"
        }
    }
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
        mutation EditNote($userID: Int!, $title: String!, $body: String,
            $complete: Boolean, $important: Boolean) {
            createNote(userId: $userID, title: $title, important: $important,
                body: $body, complete: $complete) {
                note {
                    id
                    body
                    complete
                    important
                    timestamp
                    title
                }
            }
        }
    `,
    // other mutations not yet implemented
};

const DATA_KEY = {
    "account": "notes",
    "course": "courseNotes",
    "enrollment": "enrollmentNotes",
};

const Notes = ({ownerType, ownerID, isDashboard}) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => bindActionCreators(userActions, dispatch), [dispatch],
    );
    const [createNote, createResults] = useMutation(MUTATIONS[ownerType], {
        "update": (cache, {data}) => {
            const {"note": newNote} = data.createNote;
            const {"notes": cachedNotes} = cache.readQuery({
                "query": QUERIES[ownerType],
                "variables": {ownerID},
            });
            cache.writeQuery({
                "data": {
                    "notes": [...cachedNotes, newNote],
                },
                "query": QUERIES[ownerType],
                "variables": {ownerID},
            });
        },
    });

    const query = useQuery(QUERIES[ownerType], {
        "variables": {ownerID},
    });

    const notes = query.data?.[DATA_KEY[ownerType]] || [];
    const getNoteByID = useCallback(
        (noteID) => notes.find(({id}) => noteID == id), [notes],
    );

    const [alert, setAlert] = useState(false);
    const [noteBody, setNoteBody] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [editID, setEditID] = useState(null);
    const [important, setImportant] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [deleteError, setDeleteError] = useState(false);
    const classes = useStyles();

    // close new note dialog when the note is created
    useEffect(() => {
        if (createResults.data) {
            setAlert(false);
        }
    }, [createResults]);

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
        switch (ownerType) {
            // TODO: wait for mutations for other note types
            case "account": {
                createNote({
                    "variables": {
                        "body": noteBody,
                        "complete": false,
                        important,
                        "title": noteTitle,
                        "userID": ownerID,
                    },
                });
                break;
            }
            // no default
        }
    }, [noteBody, important, noteTitle, ownerID, ownerType, createNote]);

    const openDelete = useCallback((noteID) => () => {
        setDeleteID(noteID);
    }, []);

    const toggleNoteField = useCallback((noteID, field) => () => {
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
    }, [api, ownerType, ownerID, getNoteByID]);

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

        return (
            <Grid
                className="notes-container"
                container
                item
                xs={12}
                spacing={2}>
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
                            onClick={toggleImportant}
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
                            disabled={!noteBody || createResults.loading}
                            onClick={saveNote}
                            variant="outlined">
                            {createResults.loading ? "Saving..." : "Save"}
                        </Button>
                        {
                            createResults.error &&
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
                            notes[deleteID] && notes[deleteID].title
                                ? `"${notes[deleteID].title}"`
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
                {isDashboard
                    ? <>
                        <Grid item xs={9}>
                            <Typography 
                                variant="h5"
                                style = {{marginTop:"10px"}}
                            >My Tasks
                            </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <AssignmentTurnedInIcon fontSize = "large" style={{marginTop: "10px"}}/>
                            </Grid>
                            <Grid
                                item
                                xs={12}>
                                <div
                                    className="addNote"
                                    onClick={openNewNote}
                                    style={{"cursor": "pointer", height: "100%"}}>
                                    <Typography className="center" style={{padding: 0}}>
                                        <AddIcon /> Add Note
                                    </Typography>
                                </div>
                            </Grid>
                    </>
                    :   <Grid item md={3}>
                            <div
                                className="addNote"
                                onClick={openNewNote}
                                style={{cursor: "pointer"}}
                            >
                                <Typography className="center">
                                    <AddIcon/>
                                    <br/>
                                    Add Note
                                </Typography>
                            </div>
                        </Grid>
                }               
                {notes && isDashboard && Object.values(notes).map((note) => (
                    <Grid
                    item
                    key={note.id || note.body}
                    xs={12}>
                        <Paper elevation={2} className="note"
                        style={{height: "150px", width: "100%"}}>
                            <Typography
                                align="left"
                                className={`noteHeader ${classes.notesTitle}`}>
                                {note.title}
                                <Avatar
                                    variant="square"
                                    variant="rounded"
									className={`noteNotification ${isDashboard ? classes.notesNotification : null }`}                                    
									onClick={toggleNoteField(note.id, "important")}
                                    style={note.important ? {"background-color": "red"} : {}} >!
                                </Avatar>
                            </Typography>
                            <Typography
                                align="left"
                                className="body">
                                {note.body}
                            </Typography>
							<Grid container>
								<Grid item xs={12}>
									<Typography
									className={`date ${classes.dateDisplay}`}>
									{numericDateString(note.timestamp)}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<div className={`actions ${classes.actionDashboardIcons}`}>
									<IconButton
										className={classes.icons}
										onClick={openDelete(note.id)}
										size="small"
										edge="start">
										<Delete/>
									</IconButton>
									<IconButton
										className={classes.icons}
										onClick={openExistingNote(note)}
										size="small">
										<EditIcon/>
									</IconButton>
									<IconButton
										className={classes.icons}
										onClick={toggleNoteField(note.id, "complete")}
										style={note.complete ? {"color": "#43B5D9"} : {}}
										size="small"
										edge="end">
										<DoneIcon/>
									</IconButton>
									</div>
								</Grid>
							</Grid>
                        </Paper>
                </Grid>
                    
                ))}
                
                {notes && !isDashboard && Object.values(notes).map((note) => (
                    <Grid
                        item
                        key={note.id || note.body}
                        xs={3}>
                        <Paper elevation={2} className="note">
                            <Typography
                                align="left"
                                className={`noteHeader ${classes.notesTitle}`}>
                                {note.title}
                                <NotificationIcon
                                    className="noteNotification"
                                    onClick={toggleNoteField(note.id, "important")}
                                    style={note.important ? {"color": "red"} : {}} />
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
                            <div className={`actions ${classes.actionIcons}`}>
                                <Delete
                                    className="icon"
                                    onClick={openDelete(note.id)} />
                                <EditIcon
                                    className="icon"
                                    onClick={openExistingNote(note)} />
                                <DoneIcon
                                    className="icon"
                                    onClick={toggleNoteField(note.id, "complete")}
                                    style={note.complete ? {"color": "#43B5D9"} : {}} />
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        )
    // }
};

Notes.propTypes = {
    "ownerID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
            "courseID":
                PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            "enrollmentID":
                PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            "studentID":
                PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
