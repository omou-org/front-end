import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Schedule from "./TabComponents/Schedule.js";
import InstructorCourses from './TabComponents/InstructorCourses';
import Bio from './TabComponents/Bio';
import CourseViewer from './TabComponents/CourseViewer';
import PaymentHistory from './TabComponents/PaymentHistory';
import ParentContact from './TabComponents/ParentContact';
import Notes from './TabComponents/Notes';
import Grid from "@material-ui/core/Grid";

class ComponentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_id: 0,
        };
    }

    renderComponent() {
        let component;
        switch (this.props.inView) {
            case 0:
                component = <Schedule/>;
                break;
            case 1:
                component = <InstructorCourses user_id={this.props.user.user_id}/>;
                break;
            case 2:
                component = <Bio/>;
                break;
            case 3:
                component = <CourseViewer
                    current={true}
                    user_id={this.props.user.user_id}
                    user_role={this.props.user.role}
                />;
                break;
            case 4:
                component = <CourseViewer
                    current={false}
                    user_id={this.props.user.user_id}
                    user_role={this.props.user.role}
                />;
                break;
            case 5:
                component = <PaymentHistory user_id={this.props.user.user_id}/>;
                break;
            case 6:
                component = <ParentContact parent_id={this.props.user.parent_id}/>;
                break;
            case 7:
                component = <Notes user_notes={this.props.user.notes}/>;
                break;
            default:
                component = <Schedule/>;
        }
        return (<Grid item xs={12} style={{paddingTop: 15 + "px"}}>{component}</Grid>);
    }

    render() {
        return <Grid container>
            {this.renderComponent()}
        </Grid>
    }

}

ComponentViewer.propTypes = {};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ComponentViewer);
