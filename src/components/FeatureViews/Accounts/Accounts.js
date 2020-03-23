import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

import Button from "@material-ui/core/Button";
import CardView from "@material-ui/icons/ViewModule";
import EditIcon from "@material-ui/icons/EditOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ListView from "@material-ui/icons/ViewList";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles} from "@material-ui/core/styles";

import "./Accounts.scss";
import * as hooks from "actions/hooks";
import {addDashes} from "./accountUtils";
import BackButton from "components/BackButton";
import {capitalizeString} from "utils";
import IconButton from "@material-ui/core/IconButton";
import Loading from "../../Loading";
import ProfileCard from "./ProfileCard";
import UserAvatar from "./UserAvatar";

const componentStyles = (theme) => ({
    "root": {
        "backgroundColor": theme.palette.background.paper,
        "flexGrow": 1,
    },
});

const useStyles = makeStyles({
    tableMain: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        width: "100%",
        display: "table",
        borderSpacing: 0,
        borderCollapse: "collapse"
    },
    tableRow: {
        height: 57,
    }
})

const stopPropagation = (event) => {
    event.stopPropagation();
};

const Accounts = () => {
    const usersList = useSelector(({Users}) => Users);
    const isAdmin = useSelector(({auth}) => auth.isAdmin);

    const prevState = JSON.parse(sessionStorage.getItem("AccountsState"));
    const [isMobile, setIsMobile] = useState(false);
    const [tabIndex, setTabIndex] = useState(
        prevState ? prevState.tabIndex : 0
    );
    // true = list view, false = card view
    const [viewToggle, setViewToggle] = useState(
        prevState ? prevState.viewToggle : true
    );

    const statuses = [
        hooks.useStudent(), hooks.useParent(),
        hooks.useInstructor(),
    ];

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 760);
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [handleResize]);

    const displayUsers = useMemo(() => {
        let newUsersList = [];
        switch (tabIndex) {
            case 1:
                newUsersList = Object.values(usersList.InstructorList);
                break;
            case 2:
                newUsersList = Object.values(usersList.StudentList);
                break;
            case 3:
                newUsersList = Object.values(usersList.ReceptionistList);
                break;
            case 4:
                newUsersList = Object.values(usersList.ParentList);
                break;
            default:
                newUsersList = Object.values(usersList)
                    .map((list) => Object.values(list))
                    .flat();
        }
        return newUsersList.sort((first, second) =>
            first.name < second.name ? -1 : first.name > second.name ? 1 : 0);
    }, [tabIndex, usersList]);

    useEffect(() => {
        sessionStorage.setItem("AccountsState", JSON.stringify({
            tabIndex,
            viewToggle,
        }));
    }, [tabIndex, viewToggle]);

    const handleTabChange = useCallback((_, newIndex) => {
        setTabIndex(newIndex);
    }, []);

    const setView = useCallback((view) => () => {
        setViewToggle(view);
    }, []);

    const classes = useStyles();
    const tableView = useMemo(() => (
        <Table
            className="AccountsTable"
            resizable={false}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                {displayUsers.map((row) => (
                    <TableRow
                        className="row"
                        component={Link}
                        key={row.user_id}
                        to={`/accounts/${row.role}/${row.user_id}`}>
                        <TableCell>
                            <Grid
                                alignItems="center"
                                container
                                layout="row">
                                <UserAvatar
                                    fontSize={14}
                                    margin={9}
                                    name={row.name}
                                    size={38} />
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
                        <TableCell>
                            {addDashes(row.phone_number)}
                        </TableCell>
                        <TableCell>
                            {capitalizeString(row.role)}
                        </TableCell>
                        <TableCell onClick={stopPropagation}>
                            <Grid
                                component={Hidden}
                                mdDown>
                                {
                                    (row.role === "student" ||
                                        row.role === "parent" ||
                                        isAdmin) &&
                                        <IconButton
                                            component={Link}
                                            to={`/registration/form/${row.role}/${row.user_id}/edit`}>
                                            <EditIcon />
                                        </IconButton>
                                }
                            </Grid>
                            <Grid
                                component={Hidden}
                                lgUp>
                                <Button
                                    component={Link}
                                    to={`/registration/form/${row.role}/${row.user_id}/edit`}
                                    variant="outlined">
                                    <EditIcon />
                                </Button>
                            </Grid>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ), [displayUsers, isAdmin]);

    const cardView = useMemo(() => (
        <Grid
            alignItems="center"
            className="card-container"
            container
            direction="row"
            spacing={16}
            xs={12}>
            {
                displayUsers.map((user) => (
                    <ProfileCard
                        key={user.user_id}
                        route={`/accounts/${user.role}/${user.user_id}`}
                        user={user} />))
            }
        </Grid>
    ), [displayUsers]);

    const loading = hooks.isLoading(...statuses);

    return (
        <Grid
            className="Accounts"
            item
            xs={12}>
            <Paper elevation={2} className="paper">
                <BackButton />
                <Hidden xsDown>
                    <hr />
                </Hidden>
                <Typography
                    align="left"
                    className="heading"
                    variant="h3">
                    Accounts
                </Typography>
                <Grid
                    container
                    direction="row">
                    <Grid
                        component={Hidden}
                        item
                        lgUp
                        md={8}
                        xs={10}>
                        <Tabs
                            className="tabs"
                            indicatorColor="primary"
                            onChange={handleTabChange}
                            scrollButtons="on"
                            textColor="primary"
                            value={tabIndex}
                            variant="scrollable">
                            <Tab
                                className="tab"
                                label="ALL" />
                            <Tab
                                className="tab"
                                label="INSTRUCTORS" />
                            <Tab
                                className="tab"
                                label="STUDENTS" />
                            <Tab
                                className="tab"
                                label="RECEPTIONIST" />
                            <Tab
                                className="tab"
                                label="PARENTS" />
                        </Tabs>
                    </Grid>
                    <Grid
                        component={Hidden}
                        item
                        md={8}
                        mdDown
                        xs={10}>
                        <Tabs
                            className="tabs"
                            indicatorColor="primary"
                            onChange={handleTabChange}
                            scrollButtons="off"
                            textColor="primary"
                            value={tabIndex}
                            variant="scrollable">
                            <Tab
                                className="tab"
                                label="ALL" />
                            <Tab
                                className="tab"
                                label="INSTRUCTORS" />
                            <Tab
                                className="tab"
                                label="STUDENTS" />
                            <Tab
                                className="tab"
                                label="RECEPTIONIST" />
                            <Tab
                                className="tab"
                                label="PARENTS" />
                        </Tabs>
                    </Grid>
                    <Hidden smDown>
                        <Grid
                            className="toggleView"
                            item
                            md={3}>
                            <Button
                                className={`btn list ${viewToggle && "active"}`}
                                onClick={setView(true)}>
                                <ListView className={`icon ${viewToggle && "active"}`} />
                                List View
                            </Button>
                            <Button
                                className={`btn card ${!viewToggle && "active"}`}
                                onClick={setView(false)} >
                                <CardView className={`icon ${!viewToggle && "active"}`} />
                                Card View
                            </Button>
                        </Grid>
                    </Hidden>
                </Grid>
                <Grid
                    alignItems="center"
                    className="accounts-list-wrapper"
                    container
                    direction="row"
                    justify="center"
                    spacing={8}>
                    {
                        loading
                            ? <Loading />
                            : isMobile || !viewToggle ? cardView : tableView
                    }
                </Grid>
            </Paper>
        </Grid>
    );
};
export default withStyles(componentStyles)(Accounts);
