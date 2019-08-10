import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class ParentContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }



    render() {
        let parent = (this.props.parents.find(({ user_id }) => user_id == this.props.parent_id))
        return (<div>
            <h1>{parent.name}</h1>
            <h1>{parent.phone_number}</h1></div>
        );
    }

}

ParentContact.propTypes = {};

function mapStateToProps(state) {
    return {
        parents: state.Users.ParentList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ParentContact);