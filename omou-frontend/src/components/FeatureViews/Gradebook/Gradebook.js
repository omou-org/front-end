import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stuffActions from '../../../actions/stuffActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

class Gradebook extends Component {
    render(){
        return (<div className="">
            <h1>Gradebook</h1>
        </div>)
    }
}

Gradebook.propTypes = {
    stuffActions: PropTypes.object,
    stuffs: PropTypes.array
};

function mapStateToProps(state) {
    return {
        stuffs: state.stuff
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
)(Gradebook);