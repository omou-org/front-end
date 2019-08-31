import {connect} from 'react-redux';
import React, {Component} from 'react';

import Schedule from "./TabComponents/Schedule.js";
import InstructorCourses from './TabComponents/InstructorCourses';
import Bio from './TabComponents/Bio';
import CourseViewer from './TabComponents/CourseViewer';
import PaymentHistory from './TabComponents/PaymentHistory';
import ParentContact from './TabComponents/ParentContact';
import StudentInfo from './TabComponents/StudentInfo';
import PayCourses from './TabComponents/PayCourses';
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
                component = <Schedule key={this.props.inView}/>;
                break;
            case 1:
                component = <InstructorCourses user_id={this.props.user.user_id} key={this.props.inView}/>;
                break;
            case 2:
                component = <Bio
                key={this.props.inView}
                background={this.props.user.background}
                />;
                break;
            case 3:
                component = <CourseViewer
                    current={true}
                    user_id={this.props.user.user_id}
                    user_role={this.props.user.role}
                    key={this.props.inView}
                />;
                break;
            case 4:
                component = <CourseViewer
                    current={false}
                    user_id={this.props.user.user_id}
                    user_role={this.props.user.role}
                    key={this.props.inView}
                />;
                break;
            case 5:
                component = <PaymentHistory user_id={this.props.user.user_id} key={this.props.inView}/>;
                break;
            case 6:
                component = <ParentContact parent_id={this.props.user.parent_id} key={this.props.inView}/>;
                break;
            case 7:
                component = <Notes user_notes={this.props.user.notes} key={this.props.inView}/>;
                break;
            case 8:
                component = <StudentInfo user={this.props.user} key={this.props.inView}/>;
                break;
            case 9:
                component = <PayCourses user={this.props.user} key={this.props.inView}/>;
                break;
            default:
                component = <Schedule key={this.props.inView}/>;
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
