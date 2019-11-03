import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from "react-router-dom";


import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import "./TabComponents.scss";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/EditOutlined";
import ProfileCard from "../ProfileCard";
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
                    <Grid item md={10} xs={12} >
                        <ProfileCard user={this.state.parent} route={`/accounts/parent/${this.state.parent.user_id}`} key={this.state.parent.user_id}/>
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
