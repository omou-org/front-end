import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import "./TabComponents.scss";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/CheckCircleOutlined";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import AddIcon from "@material-ui/icons/AddOutlined";
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            alert: false,
            noteBody: "",
            notication: false,
        };
    }

    componentWillMount() {
        //TODO: notes in descending order
        this.setState(() => {
            let notes = Object.keys(this.props.user_notes).map((noteID) => {
                return this.props.user_notes[noteID];
            });
            return {
                notes: notes,
            }
        });
    }

    handleClick(notebody) {
        this.setState({
            alert: true,
            noteBody: notebody,
        })
    }

    hideWarning() {
        this.setState({
            alert: false,
        });
    }

    renderPopUp() {
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.alert}>
                onClick={this.hideWarning.bind(this)}>
                        <div><Typography variant="h6" id="modal-title">
                    asd
                        </Typography>
                </div>
            </Modal>
        );
    }

    render() {
        console.log(this.state.notes);
        let iconStyle = {
            fontSize: "16px",
            align: "right",
        }
        let notificationColor
        if (this.state.notification) {
            notificationColor = {
                color: "red",
                cursor: "pointer",
            }
        }
        else {
            notificationColor = {
                color: "grey",
                cursor: "pointer",
            }
        }
        let popup = {
            minHeight: 381,
            minWidth: 381,
        };
        let numericDateString = (date) => {
            let DateObject = new Date(date),
                numericOptions = {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                };
            return DateObject.toLocaleTimeString("en-US", numericOptions);
        };
        return (<Grid item md={12}>
            <Grid container spacing={16}>
                <Grid item md={3}>
                    <div className="addNote"
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
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.alert}
                        className="popup"
                    >
                        <div className="exit-popup" style={popup}>
                            <Grid>
                                <TextField
                                    id="standard-name"
                                    label="Subject"
                                    className="textfield"
                                    margin="normal"
                                />
                                <NotificationIcon
                                    className={"notification"}
                                    style={notificationColor}
                                    onClick={() => {
                                        this.state.notification = !this.state.notification;
                                        this.forceUpdate();
                                    }}
                                />
                            </Grid>
                            <Grid>
                                <InputBase
                                    defaultValue={this.state.noteBody}
                                    multiline
                                    rows={10}
                                    variant="filled"
                                    margin="normal"
                                    required={true}
                                    className="textfield"
                                    inputProps={{'aria-label': 'naked'}}
                                />
                            </Grid>
                            <div className="popUpActions">
                                <Button>
                                    Delete
                            </Button>
                                <Button onClick={this.hideWarning.bind(this)}>
                                    Cancel
                            </Button>
                                <Button>
                                    Save
                            </Button>
                            </div>
                        </div>
                    </Modal>
                </Grid>
                {this.state.notes.map((note, i) => {
                    return <Grid item xs={3} key={i}>
                        <Paper className={"note"}>
                            <Grid>
                                <Typography className={"header"} align={'left'}>
                                    {note.body}
                                </Typography>
                                <NotificationIcon />
                            </Grid>
                            <Typography className={"body"} align={'left'}>
                                {note.body}
                            </Typography>
                            <Typography className={"date"} style={{fontWeight: "500"}}>
                                {numericDateString(note.timestamp).replace(",", "ãƒ»")}
                            </Typography>
                            <div className={"actions"}>
                                <EditIcon style={iconStyle}
                                    onClick={() => {
                                        this.handleClick(note.body);
                                    }}
                                />
                                <DoneIcon style={iconStyle} />
                            </div>
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </Grid>)
    }

}

Notes.propTypes = {
    user_notes: PropTypes.object,
};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);
