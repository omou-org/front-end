import PropTypes from "prop-types";
import React, {Component} from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "./TabComponents.scss";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/CheckCircleOutlined";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import AddIcon from "@material-ui/icons/AddOutlined";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "notes": props.user_notes,
            "alert": false,
            "noteBody": "",
            "notication": false,
        };
    }

    handleClick(notebody) {
        this.setState({
            "alert": true,
            "noteBody": notebody,
        });
    }

    hideWarning = () => {
        this.setState({
            "alert": false,
        });
    }

    render() {
        const iconStyle = {
            "fontSize": "16px",
            "align": "right",
        };
        let notificationColor;
        if (this.state.notification) {
            notificationColor = {
                "color": "red",
                "cursor": "pointer",
            };
        } else {
            notificationColor = {
                "color": "grey",
                "cursor": "pointer",
            };
        }
        const popup = {
            "minHeight": 381,
            "minWidth": 381,
        };
        const numericDateString = (date) => {
            const DateObject = new Date(date),
                numericOptions = {
                    "month": "numeric",
                    "day": "numeric",
                    "hour": "2-digit",
                    "minute": "2-digit",
                };
            return DateObject.toLocaleTimeString("en-US", numericOptions);
        };
        console.log(this.state.notes);
        return (
            <Grid
                item
                md={12}>
                <Grid
                    container
                    spacing={16}>
                    <Grid
                        item
                        md={3}>
                        <div
                            className="addNote"
                            onClick={() => {
                                this.handleClick();
                            }}
                            style={{
                                "cursor": "pointer",
                            }}>
                            <Typography className="center">
                                <AddIcon />
                                <br />
                                Add Note
                            </Typography>
                        </div>
                        <Modal
                            aria-describedby="simple-modal-description"
                            aria-labelledby="simple-modal-title"
                            className="popup"
                            open={this.state.alert}
                            onClick={this.hideWarning}>
                            <div
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                                className="exit-popup"
                                style={popup}>
                                <Grid>
                                    <TextField
                                        className="textfield"
                                        id="standard-name"
                                        label="Subject"
                                        margin="normal" />
                                    <NotificationIcon
                                        className="notification"
                                        onClick={() => {
                                            this.setState(({notification}) => ({
                                                "notification": !notification
                                            }));
                                        }}
                                        style={notificationColor} />
                                </Grid>
                                <Grid>
                                    <InputBase
                                        className="textfield"
                                        defaultValue={this.state.noteBody}
                                        inputProps={{"aria-label": "naked"}}
                                        margin="normal"
                                        multiline
                                        required
                                        rows={10}
                                        variant="filled" />
                                </Grid>
                                <div className="popUpActions">
                                    {/* <Button>
                                        Delete
                                    </Button> */}
                                    <Button onClick={this.hideWarning}>
                                        Cancel
                                    </Button>
                                    <Button>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    </Grid>
                    {this.state.notes.map((note, i) => (
                        <Grid
                            item
                            key={i}
                            xs={3}>
                            <Paper className="note">
                                <Typography
                                    align="left"
                                    className="noteHeader">
                                    {note.title || "TITLE"}
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
                                        onClick={() => {
                                            this.handleClick(note.body);
                                        }}
                                        style={iconStyle} />
                                    <DoneIcon style={iconStyle} />
                                </div>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        );
    }

}

Notes.propTypes = {
    "user_notes": PropTypes.object,
};

export default Notes;
