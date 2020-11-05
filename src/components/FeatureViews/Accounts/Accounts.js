import React, { useCallback, useEffect, useMemo, useState } from "react";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import CardView from "@material-ui/icons/ViewModule";
import EditIcon from "@material-ui/icons/EditOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ListView from "@material-ui/icons/ViewList";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import "./Accounts.scss";
import { addDashes } from "./accountUtils";
import { capitalizeString, USER_TYPES } from "utils";
import IconButton from "@material-ui/core/IconButton";
import LoadingHandler from "components/OmouComponents/LoadingHandler";
import ProfileCard from "./ProfileCard";
import { simpleUser } from "queryFragments";
import UserAvatar from "./UserAvatar";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import theme from "../../../theme/muiTheme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import secondaryTheme from "../../../theme/secondaryTheme";
import NewUser from "@material-ui/icons/PersonAdd";
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd'

const QUERY_USERS = gql`
    query UserQuery {
        students {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
        parents {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
        instructors {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
    }
    ${simpleUser}
`;

const TABS = ["ALL", "INSTRUCTORS", "STUDENTS", "RECEPTIONIST", "PARENTS"]
    .map((label) => <Tab className="tab" key={label} label={label} />);

const useStyles = makeStyles({
    "tableRowStyle": {
        "fontSize": "0.8125rem",
        "padding": "0px",
    },
    MuiTableRow: {
        head: {
            backgroundColor: "white"
        }
    }
});

const stopPropagation = (event) => {
    event.stopPropagation();
};

const Accounts = () => {
    const isAdmin =
        useSelector(({ auth }) => auth.accountType) === USER_TYPES.admin;
    const { loading, error, data } = useQuery(QUERY_USERS);

    const prevState = JSON.parse(sessionStorage.getItem("AccountsState"));
    const [isMobile, setIsMobile] = useState(false);
    const [tabIndex, setTabIndex] = useState(
        prevState ? prevState.tabIndex : 0,
    );
    // true = list view, false = card view
    const [viewToggle, setViewToggle] = useState(
        prevState ? prevState.viewToggle : true,
    );

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
        if (!data) {
            return [];
        }
        let newUsersList = [];
        switch (tabIndex) {
            case 1:
                newUsersList = data.instructors;
                break;
            case 2:
                newUsersList = data.students;
                break;
            case 3:
                // TODO: receptionist
                newUsersList = [];
                break;
            case 4:
                newUsersList = data.parents;
                break;
            default:
                newUsersList = Object.values(data).flat();
        }
        return newUsersList
            .map((user) => ({
                ...user,
                "accountType": user.accountType.toLowerCase(),
                "name": `${user.user.firstName} ${user.user.lastName}`,
            }))
            .sort((first, second) => (
                first.name < second.name ? -1 : first.name > second.name ? 1 : 0
            ));
    }, [data, tabIndex]);

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
    const tableView = useMemo(() => (<ThemeProvider theme={theme}>
        <ThemeProvider theme={secondaryTheme}>
            <Table className="AccountsTable" resizable="false">
                <TableHead className={classes.secondaryTableHead}>
                    <TableRow>
                        <TableCell >
                            Name
                        </TableCell>
                        <TableCell >
                            Email
                        </TableCell>
                        <TableCell >
                            Phone
                        </TableCell>
                        <TableCell >
                            Role
                    </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayUsers.map((row) => (
                        <TableRow className="row" component={Link}
                            key={row.user.id}
                            to={`/accounts/${row.accountType}/${row.user.id}`}>
                            <TableCell className={classes.tableRowStyle}>
                                <Grid alignItems="center" container
                                    layout="row">
                                    <UserAvatar fontSize={14} margin={9}
                                        name={row.name} size={38} />
                                    {row.name}
                                </Grid>
                            </TableCell>
                            <TableCell>
                                <Tooltip title={row.user.email}>
                                    <span>{row.user.email.substr(0, 20)}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{addDashes(row.phoneNumber)}</TableCell>
                            <TableCell>
                                {capitalizeString(row.accountType)}
                            </TableCell>
                            <TableCell onClick={stopPropagation}>
                                <Grid component={Hidden} mdDown>
                                    {(row.accountType === USER_TYPES.student ||
                                        row.accountType === USER_TYPES.parent ||
                                        isAdmin) && (
                                            <IconButton component={Link}
                                                to={`/form/${row.accountType}/${row.user.id}`}>
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                </Grid>
                                <Grid component={Hidden} lgUp>
                                    <Button component={Link}
                                        to={`/form/${row.accountType}/${row.user.id}`}
                                        variant="outlined">
                                        <EditIcon />
                                    </Button>
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ThemeProvider>
    </ThemeProvider>), [classes.tableCellStyle, classes.tableRowStyle, displayUsers, isAdmin]);

    const cardView = useMemo(() => (
        <Grid alignItems="center" className="card-container" container
            direction="row" spacing={2} xs={12}>
            {displayUsers.map((user) => (
                <ProfileCard key={user.user_id}
                    route={`/accounts/${user.accountType}/${user.user.id}`}
                    user={user} />
            ))}
        </Grid>
    ), [displayUsers]);

    return (
        <Grid className="Accounts" item xs={12}>
            <BackgroundPaper elevation={2}>
                <Grid container alignItems="flex-start" spacing={4} >
                    <Grid item>
                        <ResponsiveButton 
                            component={Link}
                            to="/form/student"
                            variant="outlined"
                        >
                            new student
                        </ResponsiveButton>
                    </Grid>
                    <Grid item>
                        <ResponsiveButton 
                            component={Link}
                            to="/form/parent"
                            variant="outlined"
                        >
                          new  parent 
                        </ResponsiveButton>
                    </Grid>
                </Grid>
                <Hidden xsDown>
                    <hr style={{ marginTop: "15px" }} />
                </Hidden>
                <Typography align="left" className="heading" variant="h3">
                    Accounts
                </Typography>
                <Grid container direction="row">
                    <Grid component={Hidden} item lgUp md={8} xs={10}>
                        <Tabs className="tabs" ndicatorColor="primary"
                            onChange={handleTabChange} scrollButtons="on"
                            textColor="primary" value={tabIndex}
                            variant="scrollable">
                            {TABS}
                        </Tabs>
                    </Grid>
                    <Grid component={Hidden} item md={8} mdDown xs={10}>
                        <Tabs className="tabs" indicatorColor="primary"
                            onChange={handleTabChange} scrollButtons="off"
                            textColor="primary" value={tabIndex}
                            variant="scrollable">
                            {TABS}
                        </Tabs>
                    </Grid>
                    <Hidden smDown>
                        <Grid item md={1} />
                        <Grid container item md={3}>
                            <Grid className="toggleView" item md={6}>
                                <ResponsiveButton
                                    onClick={setView(true)}
                                    variant='outlined'
                                    startIcon={<ListView />}
                                    >                                   
                                        List View
                                </ResponsiveButton>
                            
                            </Grid>
                            <Grid className="toggleView" item md={6}>
                                <ResponsiveButton
                                    onClick={setView(false)}
                                    variant='outlined'
                                    startIcon={<CardView />}
                                    >       
                                        Grid View
                                </ResponsiveButton>
                                
                            </Grid>
                        </Grid>
                    </Hidden>
                </Grid>
                <Grid alignItems="center" className="accounts-list-wrapper"
                    container direction="row" justify="center" spacing={1}>
                    <LoadingHandler error={error} loading={loading}>
                        {isMobile || !viewToggle ? cardView : tableView}
                    </LoadingHandler>
                </Grid>
            </BackgroundPaper>
        </Grid>
    );
};

export default Accounts;
