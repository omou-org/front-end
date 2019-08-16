import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import "./TabComponents.scss";

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes:[],
        };
    }

    componentWillMount(){
        this.setState(()=>{
            let notes = Object.keys(this.props.user_notes).map((noteID)=>{
               return this.props.user_notes[noteID];
            });
            return {
                notes:notes,
            }
        });
    }

    render() {
        let numericDateString = (date)=>{
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
        return(<Grid item md={12}>
            <Grid container spacing={8}>
                {this.state.notes.map((note,i) => {
                    return <Grid item xs={3} className={"note"} key={i}>
                        <div className={"actions"}>
                        </div>
                        <Typography className={"body"} align={'left'}>
                            {note.body}
                        </Typography>
                        <Typography className={"date"} align={'right'}>
                            {numericDateString(note.timestamp)}
                        </Typography>
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