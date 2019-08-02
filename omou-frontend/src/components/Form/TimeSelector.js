import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import {Card, Paper, Typography} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ListView from "@material-ui/icons/ViewList";
import CardView from "@material-ui/icons/ViewModule";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";

class TimeSelector extends Component {
    constructor(props){
        super(props);
        this.state = {
            availabilities:{},
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        // Set event variable based on type (i.e. teacher vs. room)
        // convert all events from this.props.availabilities times to be Date objects
        // set the "availabilities" key value in state
        // if recurring, set keys to be days of the week
        // if not recurring, set keys to be available days
            // value for each key is going to be available times
        this.setState((prevState)=>{
            return {
                availabilities: this.props[this.props.type][this.props.id],
            }
        });

    }


    render(){
        return (<Grid item xs={'12'} className="TimeSelector">
            {/*Select from Available Class Dates/dates*/}
            {/*Select when class will meet*/}
            {/*Select class time*/}
        </Grid>)
    }
}

TimeSelector.propTypes = {};

function mapStateToProps(state) {
    return {
        teachers: state.Users.TeacherList,
        teacher: state.Calendar.teacher_availabilities,
        room: state.Calendar.room_availabilities,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeSelector);