import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

const rowHeadings = [
    {id:'Grade', number:false, disablePadding: true,},
    {id:'Course', numberic:false, disablePadding: true},
    {id:'Dates', numberic:false, disablePadding: true},
    {id:'Day(s)', numberic:false, disablePadding: true},
    {id:'Time', numberic:false, disablePadding: true},
    {id:'Tuition', numberic:false, disablePadding: true},
    {id:'Space Left', numberic:false, disablePadding: true},
    {id:'Register', numberic:false, disablePadding: true}
];

class MobileRegistration extends Component {
    componentDidMount(){

    }

    render(){
        return (
            <div className="">
                <h1>Mobile Registration</h1>
            </div>
        )
    }
}

MobileRegistration.propTypes = {
    stuffActions: PropTypes.object,
    MobileRegistrationForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        // courses: state.MobileRegistration["course_list"]
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MobileRegistration);