import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Courses extends Component {
    render() {
        return (
            <div className=''>
                <h1>Courses</h1>
            </div>
        );
    }
}

Courses.propTypes = {};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Courses);
