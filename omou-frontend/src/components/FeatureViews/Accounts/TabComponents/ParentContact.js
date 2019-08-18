import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import "./TabComponents.scss";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/EditOutlined";

class ParentContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parent: {},
        };
    }

    componentWillMount() {
        this.setState({
            parent: this.props.parents[this.props.parent_id]
        })
    }

    addDashes(f){
        return("("+f.slice(0,3)+"-"+f.slice(3,6)+"-"+f.slice(6,15)+")");
    }

    render() {
        //this.state.parent.name
        return (
            <Grid item md={12}>
                <Grid container spacing={16}>
                    <Grid item xs={4} >
                        <Paper className={"ParentContact"}>
                            <div className="parent-header" align="left">
                                <Typography className="header-text">
                                    {this.state.parent.name}
                                </Typography>
                            </div>
                            <div className={"actions"} align="right">
                                <EditIcon />
                            </div>
                            <Typography className={"body"} align={'left'}>
                                <Grid container spacing={16} className="bodyText">
                                    <Grid item xs={5} align="left" className="bold">
                                        Relation
                                    </Grid>
                                    <Grid item xs={5} align="left">
                                        {this.state.parent.relationship}
                                    </Grid>
                                    <Grid item xs={5} align="left" className="bold">
                                        Phone
                                    </Grid>
                                    <Grid item xs={5} align="left">
                                        {this.addDashes(this.state.parent.phone_number)}
                                    </Grid>
                                    <Grid item xs={5} align="left" className="bold">
                                        Email
                                    </Grid>
                                    <Grid item xs={5} align="left">
                                        {this.state.parent.email}
                                    </Grid>

                                </Grid>
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