import {connect} from 'react-redux';
import React, {Component} from 'react';

class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }



    render() {
        return (<h1>Schedule</h1>)
    }

}

Schedule.propTypes = {};

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
)(Schedule);
