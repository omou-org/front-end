import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stuffActions from '../actions/stuffActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

class reduxExample extends Component {
    componentWillMount() { // HERE WE ARE TRIGGERING THE ACTION
        console.log(this.props)
    }

    renderData(){
        return <div>{this.props.stuffs}</div>
    }

    render(){
        return (<div className="">
            {/*hi*/}
            {this.props.stuffs.length > 0 ?
                this.renderData()
                :
                <div className="">
                    No Data
                </div>
            }
        </div>)
    }
}

reduxExample.propTypes = {
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
)(reduxExample);