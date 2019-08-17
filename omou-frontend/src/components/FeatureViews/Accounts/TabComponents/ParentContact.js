import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import "./TabComponents.scss";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/EditOutlined";
import RemoveIcon from "@material-ui/icons/DeleteForeverOutlined";
import AlertIcon from "@material-ui/icons/AddAlertOutlined";

class ParentContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parent:{},
        };
    }

    componentWillMount() {
        this.setState({
            parent: this.props.parents[this.props.parent_id]
        })
    }

    render() {
        //this.state.parent.name
        return (
            <Grid item md={12}>
            <Grid container spacing={16}>
                <Grid item xs={3}>
                        <Paper className={"note"}>
                            <div className={"actions"}>
                            {this.state.parent.name}
                                <EditIcon/>
                                <AlertIcon/>
                                <RemoveIcon/>
                            </div>
                            <Typography className={"body"} align={'left'}>
                                {this.state.parent.name}
                            </Typography>
                        </Paper>
                    </Grid>
            </Grid>
        </Grid>
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