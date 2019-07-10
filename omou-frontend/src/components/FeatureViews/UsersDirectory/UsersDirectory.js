import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

class UsersDirectory extends Component {
    render(){
        return (<div className="">
            <h1>UsersDirectory</h1>
        </div>)
    }
}

UsersDirectory.propTypes = {};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersDirectory);
