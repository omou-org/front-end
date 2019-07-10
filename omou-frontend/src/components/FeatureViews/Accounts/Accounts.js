import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

class Accounts extends Component {
    render() {
        return (<div className="">
            <h1>Accounts</h1>
        </div>)
    }
}

Accounts.propTypes = {};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Accounts);
