import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ListView from "@material-ui/icons/ViewList";
import CardView from "@material-ui/icons/ViewModule";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import { NavLink } from "react-router-dom";

import './Accounts.scss';

class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            usersList: [],
            viewToggle: true, // true = list, false = card view
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        this.setState(()=>{
            let usersList = {};
            Object.assign(usersList,this.props.parents);
            Object.assign(usersList,this.props.students);
            Object.assign(usersList,this.props.instructors);
           return {usersList: usersList,}
        });
    }

    handleChange(e, newTabIndex) {
        e.preventDefault();
        let newUsersList = [];
        let usersList = {};
        Object.assign(usersList,this.props.parents);
        Object.assign(usersList,this.props.students);
        Object.assign(usersList,this.props.instructors);
        switch(newTabIndex){
            case 0:
                newUsersList = usersList;
                break;
            case 1:
                newUsersList = this.props.instructors;
                break;
            case 2:
                newUsersList = this.props.students;
                break;
            case 3:
                newUsersList = this.props.parents;
                break;
            default:
                newUsersList = usersList;
        }
        this.setState({ value: newTabIndex, usersList: newUsersList });
    }

    render() {
        let tableView = () => {
            return <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="TableRow">
                    {this.state.usersList.map(rowID => {
                        let row = this.state.usersList[rowID];
                        return (
                        <TableRow key={row.name} component={NavLink} to={"/accounts/" + row.type + "/" + row.user_id} className="row">
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.phone_number}</TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>;
        };

        let cardView = () => {
            return this.state.usersList.map((user) => {
                return <Card>
                    <CardContent className={"text"}>
                        <Typography gutterBottom variant={"h6"} component={"h2"}>
                            {user.name}
                        </Typography>
                        <Typography component="p">
                            {user.role}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size={"small"}
                            color={"secondary"}>
                            Call
                        </Button>
                    </CardActions>
                </Card>
            })
        };

        return (<Grid item xs={'12'} className="Accounts">
            <Paper className={'paper'}>
                    <BackButton />
                <Typography variant="h2">Directory</Typography>
                <Grid container direction={'row'} alignItems={'center'}>

                    <Grid item xs={'9'}>
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label="ALL MEMBERS" />
                            <Tab label="TEACHERS" />
                            <Tab label="STUDENTS" />
                            <Tab label="PARENTS" />
                            <Tab label="ADMIN" />
                        </Tabs>
                    </Grid>
                    <Grid item xs={'2'} className="toggleView">
                        <ListView onClick={(e) => { e.preventDefault(); this.setState({ viewToggle: true }); }} />
                        <CardView onClick={(e) => { e.preventDefault(); this.setState({ viewToggle: false }); }} />
                    </Grid>
                </Grid>
                <Grid container direction={'row'} alignItems={'center'} spacing={3}>
                    {
                        this.state.viewToggle ?
                            tableView() :
                            cardView()
                    }
                </Grid>
            </Paper>
        </Grid>)
    }
}

Accounts.propTypes = {};

function mapStateToProps(state) {
    return {
        instructors: state.Users.InstructorList,
        parents: state.Users.ParentList,
        students: state.Users.StudentList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Accounts);
