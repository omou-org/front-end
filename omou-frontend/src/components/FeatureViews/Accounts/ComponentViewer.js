import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Schedule from "./TabComponents/Schedule.js";
import Courses from './TabComponents/Courses';
import Bio from './TabComponents/Bio';
import CurrentSessions from './TabComponents/CurrentSessions';
import PaymentHistory from './TabComponents/PaymentHistory';
import ParentContact from './TabComponents/ParentContact';
import Notes from './TabComponents/Notes';
import PastSessions from './TabComponents/PastSessions';

class ComponentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_id: 0,
        };
    }

    componentWillMount() {

    }


    render() {
        let component;
        switch (this.props.inView) {
            case 0:
                component = <Schedule />;
                break;
            case 1:
                component = <Courses />;
                break;
            case 2:
                component = <Bio />;
                break;
            case 3:
                component = <CurrentSessions />;
                break;
            case 4:
                component = <PastSessions/>;
                break;
            case 5:
                component = <PaymentHistory />;
                break;
            case 6:
                component = <ParentContact parent_id={this.props.user.parent_id}/>;
                break;
            case 7:
                component = <Notes />;
                break;
            default:
                component = <Schedule />;
        }
        return (component);
    }

}

ComponentViewer.propTypes = {};

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
)(ComponentViewer);
