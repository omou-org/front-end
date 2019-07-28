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
            value:0,
            usersList: [],
            viewToggle: true, // true = list, false = card view
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            usersList: this.props.teachers.concat(this.props.parents).concat(this.props.students),
        });
    }


    render(){
        return (<Grid item xs={'12'} className="TimeSelector">
            {/*Select from Available Class Dates*/}
            {/*Select when class will meet*/}
            {/*Select class time*/}
        </Grid>)
    }
}

TimeSelector.propTypes = {};

function mapStateToProps(state) {
    return {
        teachers: state.Users.TeacherList,
        parents: state.Users.ParentList,
        students: state.Users.StudentList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeSelector);