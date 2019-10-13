import { connect } from "react-redux";
import React, { Component } from "react";
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Paper, Typography } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ListView from "@material-ui/icons/ViewList";
import CardView from "@material-ui/icons/ViewModule";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import EditIcon from "@material-ui/icons/EditOutlined";
import { NavLink } from "react-router-dom";
import {stringToColor, addDashes} from "./accountUtils";

import "./Accounts.scss";
import Avatar from "@material-ui/core/Avatar";
import ProfileCard from "./ProfileCard";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/es/Hidden/Hidden";

class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            usersList: [],
            viewToggle: true, // true = list, false = card view
            mobileView: false,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        let prevState = JSON.parse(sessionStorage.getItem('AccountsState'));
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        if (prevState) {
            this.setState(prevState);

        } else {
            this.setState(() => {
                let usersList = {};
                Object.assign(usersList, this.props.parents);
                Object.assign(usersList, this.props.students);
                Object.assign(usersList, this.props.instructors);
                Object.assign(usersList, this.props.receptionist);
                return { usersList: usersList, }
            });
        }
    }
    resize() {
        const currentHideNav = (window.innerWidth <= 800);
        if (currentHideNav !== this.state.mobileView) {
            this.setState({ mobileView: !this.state.mobileView });
        }
    }

    goToRoute(route) {
        this.props.history.push(this.props.match.url + route);
    }

    handleChange(e, newTabIndex) {
        e.preventDefault();
        let newUsersList = []; 
        let usersList = {};
        Object.assign(usersList, this.props.parents);
        Object.assign(usersList, this.props.students);
        Object.assign(usersList, this.props.instructors);
        Object.assign(usersList, this.props.receptionist);
        switch (newTabIndex) {
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
                newUsersList = this.props.receptionist;
                break;
            case 4:
                newUsersList = this.props.parents;
                break;
            default:
                newUsersList = usersList;
        }
        this.setState({ value: newTabIndex, usersList: newUsersList },
            () => {
                sessionStorage.setItem('AccountsState', JSON.stringify(this.state));
            }
        );
    }

    addDashes(string) {
        if (string.length == 10 && string.match(/^[0-9]+$/) != null) {
            return (
                `(${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 15)})`);
        }
        else {
            return ("error");
        }
    }

    render() {
        console.log(this.state.mobileView)
        let styles = (username) => ({
            backgroundColor: stringToColor(username),
            color: "white",
            margin: 9,
            width: 38,
            height: 38,
            fontSize: 14,
        });
        let tableView = () => (
            <Table className="AccountsTable">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(this.state.usersList).map((row) => (
                        <TableRow key={row.user_id}
                            onClick={(event) => {
                                event.preventDefault();
                                this.goToRoute(`/${row.role}/${row.user_id}`);
                            }}
                            className="row">
                            <TableCell component="th" scope="row">
                                <Grid container layout={"row"} alignItems={"center"}>
                                    <Grid item md={12} lg={4}>
                                        <Avatar
                                            style={styles(row.name)}>{row.name.match(/\b(\w)/g).join("")}</Avatar>
                                    </Grid>
                                    <Grid item md={4} lg={8}>
                                        <Typography>
                                            {row.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{this.addDashes(row.phone_number)}</TableCell>
                            <TableCell>{row.role.charAt(0).toUpperCase() + row.role.slice(1)}</TableCell>
                            <TableCell onClick={(event) => {
                                event.stopPropagation();
                            }}>
                                <Grid component={Hidden} mdDown align="right">
                                    <Button
                                        className="editButton"
                                        component={NavLink}
                                        to={`/registration/form/${row.role}/${row.user_id}/edit`}>
                                        <EditIcon />
                                        Edit Profile
                                    </Button>
                                </Grid>
                                <Grid component={Hidden} lgUp align="right">
                                    <Button
                                        className="editButton"
                                        component={NavLink}
                                        to={`/registration/form/${row.role}/${row.user_id}/edit`}>
                                        <EditIcon />
                                    </Button>
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );

        const cardView = () => {
            return <Grow in={true}>
                <Grid container xs={12} md={10} spacing={8} alignItems={'center'} direction={'row'} style={{ marginTop: 20 }}>
                    {Object.values(this.state.usersList).map((user) => (
                        <ProfileCard user={user} key={user.user_id} />))}
                </Grid>
            </Grow>
        };

        return (<Grid item xs={12} className="Accounts">
            <Paper className={"paper"}>
                <BackButton />
                <hr />
                <Typography variant="h2" align={"left"} className={"heading"}>Accounts</Typography>
                <Grid container direction={"row"} alignItems={"center"}>
                    <Grid item xs={11}>
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            variant="scrollable"
                            textColor="primary"
                            className={"tabs"}
                        >
                            <Tab label="ALL" />
                            <Tab label="INSTRUCTORS" />
                            <Tab label="STUDENTS" />
                            <Tab label="RECEPTIONIST" />
                            <Tab label="PARENTS" />
                        </Tabs>
                    </Grid>
                    {
                        this.state.mobileView ?
                            '' :
                            <Grid item xs={1} md={1} className="toggleView">
                                <ListView className={`list icon ${this.state.viewToggle ? 'active' : ''}`} onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({ viewToggle: true },
                                        () => { sessionStorage.setItem('AccountsState', JSON.stringify(this.state)); });
                                }} />
                                <CardView className={`card icon ${this.state.viewToggle ? '' : 'active'}`} onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({ viewToggle: false },
                                        () => { sessionStorage.setItem('AccountsState', JSON.stringify(this.state)); });
                                }} />
                            </Grid>
                    }
                </Grid>
                <Grid container
                    direction={"row"}
                    alignItems={"center"}
                    spacing={8}
                    className={'accounts-list-wrapper'}
                >
                    {
                        this.state.mobileView ?
                            cardView() :
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
        receptionist: state.Users.ReceptionistList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Accounts));
