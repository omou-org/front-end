import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Redirect, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

import Badge from "@material-ui/core/Badge";
import BioIcon from "@material-ui/icons/PersonOutlined";
import ContactIcon from "@material-ui/icons/ContactPhoneOutlined";
import CoursesIcon from "@material-ui/icons/SchoolOutlined";
import CurrentSessionsIcon from "@material-ui/icons/AssignmentOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Paper from "@material-ui/core/Paper";
import PastSessionsIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import PaymentIcon from "@material-ui/icons/CreditCardOutlined";
import ScheduleIcon from "@material-ui/icons/CalendarTodayOutlined";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import "./Accounts.scss";
import * as hooks from "actions/hooks";
import BackButton from "components/BackButton";
import ComponentViewer from "./ComponentViewer.js";
import Loading from "components/Loading";
import ProfileHeading from "./ProfileHeading.js";
import {useAccountNotes} from "actions/userActions";
import UserAvatar from "./UserAvatar";

const userTabs = {
    "instructor": [
        {
            "icon": <ScheduleIcon className="TabIcon" />,
            "tab_heading": "Schedule",
            "tab_id": 0,
        },
        {
            "icon": <CoursesIcon className="TabIcon" />,
            "tab_heading": "Courses",
            "tab_id": 1,
        },
        {
            "icon": <BioIcon className="TabIcon" />,
            "tab_heading": "Bio",
            "tab_id": 2,
        },
        {
            "icon": <notificationIcon className="TabIcon" />,
            "tab_heading": "Notes",
            "tab_id": 7,
        },
    ],
    "parent": [
        {
            "icon": <CurrentSessionsIcon className="TabIcon" />,
            "tab_heading": "Student Info",
            "tab_id": 8,
        },
        {
            "icon": <PaymentIcon className="TabIcon" />,
            "tab_heading": "Payment History",
            "tab_id": 5,
        },
        {
            "icon": <NoteIcon className="TabIcon" />,
            "tab_heading": "Notes",
            "tab_id": 7,
        },
    ],
    "student": [
        {
            "icon": <CurrentSessionsIcon className="TabIcon" />,
            "tab_heading": "Current Course(s)",
            "tab_id": 3,
        },
        {
            "icon": <PastSessionsIcon className="TabIcon" />,
            "tab_heading": "Past Course(s)",
            "tab_id": 4,
        },
        {
            "icon": <ContactIcon className="TabIcon" />,
            "tab_heading": "Parent Contact",
            "tab_id": 6,
        },
        {
            "icon": <NoteIcon className="TabIcon" />,
            "tab_heading": "Notes",
            "tab_id": 7,
        },
    ],
};

const useUser = (id, type) => {
    switch (type) {
        case "student":
            return hooks.useStudent(id);
        case "parent":
            return hooks.useParent(id);
        case "instructor":
            return hooks.useInstructor(id);
        case "receptionist":
            // TODO: add receptionist fetching
            return 200;
        default:
            // can't find the user (invalid user type)
            return 404;
    }
};

const UserProfile = () => {
    const userList = useSelector(({Users}) => Users);
    const {accountType, accountID} = useParams();

    const [tabIndex, setTabIndex] = useState(0);
    const [displayTabs, setDisplayTabs] = useState(userTabs[accountType]);

    const fetchStatus = useUser(accountID, accountType);
    useAccountNotes(accountID, accountType);

    const user = useMemo(() => {
        switch (accountType) {
            case "student":
                return userList.StudentList[accountID];
            case "parent":
                return userList.ParentList[accountID];
            case "instructor":
                return userList.InstructorList[accountID];
            case "receptionist":
                return userList.ReceptionistList[accountID];
            default:
                return null;
        }
    }, [userList, accountID, accountType]);

    const handleTabChange = useCallback((_, newTabIndex) => {
        setTabIndex(newTabIndex);
    }, []);

    const tabs = useMemo(() => {
        if (!user) {
            return null;
        }
        if (user.role === "receptionist") {
            return (
                <>
                    <Typography
                        align="left"
                        variant="h6">
                        Action Log
                    </Typography>
                    <Paper elevation={2} className="paper">
                        <Table className="ActionTable">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(user.action_log)
                                    .map(([key, {date, time, description}]) => (
                                        <TableRow key={key}>
                                            <TableCell>{date}</TableCell>
                                            <TableCell>{time}</TableCell>
                                            <TableCell>{description}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </>
            );
        }

        return (
            <>
                <Tabs
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    textColor="primary"
                    value={tabIndex}>
                    {displayTabs.map((tab) => (
                        <Tab
                            key={tab.tab_id}
                            label={<>{tab.icon} {tab.tab_heading}</>} />
                    ))}
                </Tabs>
                <ComponentViewer
                    inView={displayTabs[tabIndex].tab_id}
                    user={user} />
            </>
        );
    }, [displayTabs, handleTabChange, tabIndex, user]);

    // reset to first tab when profile changes
    useEffect(() => {
        setTabIndex(0);
    }, [accountType, accountID]);

    // reset tab list when profile type changes
    useEffect(() => {
        setDisplayTabs(userTabs[accountType]);
    }, [accountType]);

    useEffect(() => {
        if (user) {
            const numImportantNotes = Object.values(user.notes || {})
                .reduce((total, {important}) =>
                    important ? total + 1 : total, 0);
            if (user.role !== "receptionist") {
                setDisplayTabs((prevTabs) => {
                    const newTabs = [...prevTabs];
                    const notesIndex = newTabs.findIndex((tab) => tab.tab_id === 7);
                    newTabs[notesIndex] = {
                        ...newTabs[notesIndex],
                        "icon": (
                            <Badge badgeContent={numImportantNotes} color="primary">
                                <NoteIcon className="TabIcon" />
                            </Badge>
                        ),
                    };
                    return newTabs;
                });
            }
        }
    }, [user]);

    if (!user || Object.keys(user).length <= 1) {
        if (hooks.isLoading(fetchStatus)) {
            return <Loading />;
        } else if (hooks.isFail(fetchStatus)) {
            return <Redirect to="/PageNotFound" />;
        }
    }

    return (
        <div className="UserProfile">
            <Paper className="UserProfile paper">
                <BackButton warn={false} />
                <hr />
                <Grid
                    className="padding"
                    container
                    layout="row">
                    <Grid
                        item
                        md={2}>
                        <Hidden smDown>
                            <UserAvatar
                                fontSize="3.5vw"
                                margin={20}
                                name={user.name}
                                size="9vw" />
                        </Hidden>
                    </Grid>
                    <Grid
                        className="headingPadding"
                        item
                        md={10}
                        xs={12} >
                        <ProfileHeading user={user} />
                    </Grid>
                </Grid>
                {tabs}
            </Paper>
        </div>
    );
};

UserProfile.propTypes = {};

export default UserProfile;
