import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import "./TabComponents.scss";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/EditOutlined";
import RemoveIcon from "@material-ui/icons/DeleteForeverOutlined";
import AlertIcon from "@material-ui/icons/AddAlertOutlined";

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
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

    render() {
        let numericDateString = (date) => {
            let DateObject = new Date(date),
                numericOptions = {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                };
            return DateObject.toLocaleTimeString("en-US", numericOptions);
        };
        return (<Grid item md={12}>
            <Grid container spacing={16}>
                {this.state.notes.map((note, i) => {
                    return <Grid item xs={3} key={i}>
                        <Paper className={"note"}>
                            <div className={"actions"}>
                                <EditIcon />
                                <AlertIcon />
                                <RemoveIcon />
                            </div>
                            <Typography className={"body"} align={'left'}>
                                {note.body}
                            </Typography>
                            <Typography className={"date"} align={'right'}>
                                {numericDateString(note.timestamp)}
                            </Typography>
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
