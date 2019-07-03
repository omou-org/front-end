import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stuffActions from '../../../actions/stuffActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";

import './Accounts.scss';

class Accounts extends Component {

    render(){
        let usersList = this.props.teachers.concat(this.props.parents).concat(this.props.students);
        console.log(usersList);
        return (<Grid item xs={'12'} className="Accounts">
            <Paper className={'paper'}>
                <BackButton/>

            </Paper>
        </Grid>)
    }
}

Accounts.propTypes = {
    stuffActions: PropTypes.object,
    stuffs: PropTypes.array
};

function mapStateToProps(state) {
    return {
        teachers: state.Users.TeacherList,
        parents: state.Users.ParentList,
        students: state.Users.StudentList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        stuffActions: bindActionCreators(stuffActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Accounts);