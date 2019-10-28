import { connect } from 'react-redux';
import React, { Component } from 'react';
import {withRouter} from "react-router-dom";


import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import "./TabComponents.scss";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/EditOutlined";
import {addDashes} from "../accountUtils";


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

    goToRoute(route) {
        this.props.history.push(route);
        
    }

    render() {
        //this.state.parent.name
        return (
            <Grid item md={12}>
                <Grid container spacing={16}>
                    <Grid item md={6} xs={12} >
                        <Paper className={"ParentContact"}
                        onClick={() => {
                            this.props.history.push(`/accounts/parent/${this.state.parent.user_id}`);
                        }}
                        key={this.state.parent.user_id}
                        style={{
                            "cursor": "pointer",
                        }}>
                            <div className="parent-header" align="left">
                                <Typography className="header-text">
                                    {this.state.parent.name}
                                </Typography>
                            </div>
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
                                        {addDashes(this.state.parent.phone_number)}
                                    </Grid>
                                    <Grid item xs={5} align="left" className="bold">
                                        Email
                                    </Grid>
                                    <Grid item xs={5} align="left">
                                        {this.state.parent.email}
                                    </Grid>
                                </Grid>
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

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ParentContact));