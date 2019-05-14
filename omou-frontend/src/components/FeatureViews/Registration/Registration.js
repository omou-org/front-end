import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import FullRegistration from "./FullRegistration";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import MobileRegistration from "./MobileRegistration";

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

class Registration extends Component {
    componentDidMount(){

    }

    render(){
        return (
            <div className="">
                <Hidden smDown>
                    <FullRegistration courses={this.props.courses}/>
                </Hidden>
                <Hidden mdUp>
                    <MobileRegistration courses={this.props.courses}/>
                </Hidden>
            </div>
        )
    }
}

Registration.propTypes = {
    stuffActions: PropTypes.object,
    RegistrationForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        courses: state.Registration["course_list"]
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
)(Registration);