import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as userActions from "../../../actions/userActions";
import React, {Component} from "react";
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
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
import {NavLink, withRouter} from "react-router-dom";
import EditIcon from "@material-ui/icons/EditOutlined";
import {addDashes, stringToColor} from "./accountUtils";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import {withStyles} from '@material-ui/core/styles';

import "./Accounts.scss";
import Avatar from "@material-ui/core/Avatar";
import ProfileCard from "./ProfileCard";
import {GET} from "../../../actions/actionTypes";
import {REQUEST_ALL} from "../../../actions/apiActions";
import Loading from "../../Loading";
import {isLoading} from "../../../actions/hooks"
import {Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

const tabStyle = {
    minWidth: 130
};

class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "tabIndex": 0,
            "usersList": [],
            "viewToggle": true, // true = list, false = card view
            "mobileView": false,
        };
    }

    componentWillMount() {
        const prevState = JSON.parse(sessionStorage.getItem("AccountsState"));
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
                usersList = Object.values(usersList).sort(function (a, b) {
                    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                });
                return { usersList: usersList, }
            });
        }
    }

    componentDidMount() {
        if (Object.keys(this.state.usersList)[0] !== Object.keys(this.props.parents)[0]) {
            this.props.userActions.fetchParents();
            this.props.userActions.fetchInstructors();
            this.props.userActions.fetchStudents();
        }
    }

    resize() {
        const currentHideNav = window.innerWidth <= 760;
        if (currentHideNav !== this.state.mobileView) {
            this.setState(({ mobileView }) => ({
                "mobileView": !mobileView,
            }));
        }
    }

    goToRoute(route) {
        this.props.history.push(route);
    }

    getUsers = () => {
        let newUsersList = {};
        const usersList = {};
        Object.assign(usersList, this.props.parents);
        Object.assign(usersList, this.props.students);
        Object.assign(usersList, this.props.instructors);
        Object.assign(usersList, this.props.receptionist);
        switch (this.state.tabIndex) {
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
        newUsersList = Object.values(newUsersList).sort(function (a, b) {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        });
        return newUsersList;
    };

    handleChange = (event, tabIndex) => {
        event.preventDefault();
        this.setState({
            tabIndex,
        }, () => {
            sessionStorage.setItem("AccountsState", JSON.stringify(this.state));
        });
    };

    handleCardClick = (event) => {
        this.setState(
            { "viewToggle": false },
            () => {
                sessionStorage.setItem("AccountsState", JSON.stringify(this.state));
            }
        );
    };

    render() {
        const userList = this.getUsers();
        const styles = (username) => ({
            avatar: {
                "backgroundColor": stringToColor(username),
                "color": "white",
                "marginRight": 9,
                "width": 38,
                "height": 38,
                "fontSize": 14,
            },
            first_tab: {
                borderRadius: "10px 0 0 10px !important",
                color: "black",
            },
            last_tab: {
                borderRadius: "10px 0 0 10px",
            },
        });

        const tableView = () => (
            <Table resizable={false} className="AccountsTable">
                <TableHead>
                    <TableRow>
                        <TableCell >Name</TableCell>
                        <TableCell >Email</TableCell>
                        <TableCell >Phone</TableCell>
                        <TableCell >Role</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(userList).map((row) => (
                        <TableRow
                            className="row"
                            key={row.user_id}
                            onClick={(event) => {
                                event.preventDefault();
                                this.goToRoute(`/accounts/${row.role}/${row.user_id}`);
                            }}>
                            <TableCell>
                                <Grid
                                    alignItems="center"
                                    container
                                    layout="row">
                                    <Avatar
                                        style={styles(row.name).avatar}>{row.name.toUpperCase().match(/\b(\w)/g).join("")}
                                    </Avatar>
                                    {row.name}

                                </Grid>
                            </TableCell>
                            <TableCell>
                                <Tooltip title={row.email}>
                                    <span>
                                        {row.email.substr(0, 20)}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{addDashes(row.phone_number)}
                            </TableCell>
                            <TableCell>
                                {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
                            </TableCell>
                            <TableCell
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}>
                                <Grid
                                    component={Hidden}
                                    mdDown>
                                    {
                                        (row.role === "student" || row.role === "parent" || this.props.isAdmin) &&
                                        <IconButton
                                            // className="editButton"
                                            component={NavLink}
                                            to={`/registration/form/${row.role}/${row.user_id}/edit`}>
                                            <EditIcon />
                                        </IconButton>
                                    }
                                </Grid>
                                <Grid
                                    component={Hidden}
                                    lgUp>
                                    <Button
                                        className="editButton"
                                        component={NavLink}
                                        to={`/registration/form/${row.role}/${row.user_id}/edit`}>
                                        <EditIcon />
                                    </Button>
                                </Grid>
                            </TableCell>
                            {/* <TableCell>{row.email}</TableCell>
                            <TableCell>{row.phone_number}</TableCell>
                            <TableCell>{row.role.charAt(0).toUpperCase() + row.role.slice(1)}</TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );

        const cardView = () => (
                <Grid
                    alignItems="center"
                    container
                    direction="row"
                    spacing={16}
                    style={{ "marginTop": 20 }}
                    xs={12}>
                    {Object.values(userList).map((user) => (
                        <ProfileCard
                            key={user.user_id}
                            route={`/accounts/${user.role}/${user.user_id}`}
                            user={user} />))}
                </Grid>
        );
        this.resize();

        const loading = isLoading(this.props.requestStatus.instructor[GET][REQUEST_ALL],
            this.props.requestStatus.student[GET][REQUEST_ALL],
            this.props.requestStatus.parent[GET][REQUEST_ALL]);

        return (
            <Grid
                className="Accounts"
                item
                xs={12}>
                <Paper className="paper">
                    <BackButton />
                    <Hidden xsDown>
                        <hr />
                    </Hidden>
                    <Typography
                        align="left"
                        className="heading"
                        variant="h3">Accounts
                    </Typography>
                    <Grid
                        // alignItems="center"
                        container
                        direction="row">
                        <Grid
                            item
                            md={8}
                            xs={10}
                            component={Hidden} lgUp
                        >
                            <Tabs
                                className="tabs"
                                indicatorColor="primary"
                                onChange={this.handleChange}
                                textColor="primary"
                                value={this.state.tabIndex}
                                scrollButtons="on"
                                variant="scrollable">
                                <Tab style={tabStyle} label="ALL" classes={styles("").first_tab} />
                                <Tab style={tabStyle} label="INSTRUCTORS" />
                                <Tab style={tabStyle} label="STUDENTS" />
                                <Tab style={tabStyle} label="RECEPTIONIST" />
                                <Tab style={tabStyle} label="PARENTS" />
                            </Tabs>

                        </Grid>
                        <Grid item md={8}
                            xs={10}
                            component={Hidden} mdDown
                        >
                            <Tabs
                                className="tabs"
                                indicatorColor="primary"
                                onChange={this.handleChange}
                                textColor="primary"
                                scrollButtons="off"
                                value={this.state.tabIndex}
                                variant="scrollable">
                                <Tab style={tabStyle} label="ALL" classes={styles("").first_tab} />
                                <Tab style={tabStyle} label="INSTRUCTORS" />
                                <Tab style={tabStyle} label="STUDENTS" />
                                <Tab style={tabStyle} label="RECEPTIONIST" />
                                <Tab style={tabStyle} label="PARENTS" />
                            </Tabs>
                        </Grid>
                        {
                            !this.state.mobileView &&
                            <Hidden smDown>
                                <Grid
                                    className="toggleView"
                                    item
                                    md={3}>
                                    <Button className={`btn list ${this.state.viewToggle ? "active" : ""}`}
                                        onClick={(event) => {
                                            this.setState(
                                                { "viewToggle": true },
                                                () => {
                                                    sessionStorage.setItem("AccountsState", JSON.stringify(this.state));
                                                }
                                            );
                                        }}>
                                        <ListView className={`icon ${this.state.viewToggle ? "active" : ""}`} />
                                        List View
                                    </Button>
                                    <Button className={`btn card ${this.state.viewToggle ? "" : "active"}`}
                                        onClick={this.handleCardClick} >
                                        <CardView className={`icon ${this.state.viewToggle ? "" : "active"}`} />
                                        Card View
                                    </Button>

                                </Grid>
                            </Hidden>
                        }
                    </Grid>
                    <Grid
                        alignItems="center"
                        justify="center"
                        className="accounts-list-wrapper"
                        container
                        direction="row"
                        spacing={8}>
                        {
                            loading ? <Loading/> :
                            this.state.mobileView
                                ? cardView()
                                : this.state.viewToggle
                                    ? tableView()
                                    : cardView()
                        }
                    </Grid>
                </Paper>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    "instructors": state.Users.InstructorList,
    "parents": state.Users.ParentList,
    "receptionist": state.Users.ReceptionistList,
    "students": state.Users.StudentList,
    "isAdmin": state.auth.isAdmin,
    "requestStatus": state.RequestStatus,
    "searchStatus": state.Search.searchQueryStatus.searching,
});

const mapDispatchToProps = (dispatch) => ({
    "userActions": bindActionCreators(userActions, dispatch),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Accounts)));
