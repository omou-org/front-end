import { connect } from 'react-redux';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import {Paper, Typography} from "@material-ui/core";
import './Accounts.scss';

import BackButton from "../../BackButton";
import ComponentViewer from "./ComponentViewer.js";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ProfileHeading from "./ProfileHeading.js";
import Avatar from "@material-ui/core/Avatar";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Chip from "@material-ui/core/Chip";
import BioIcon from "@material-ui/icons/PersonOutlined";
import CoursesIcon from "@material-ui/icons/SchoolOutlined";
import ScheduleIcon from "@material-ui/icons/CalendarTodayOutlined";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import CurrentSessionsIcon from "@material-ui/icons/AssignmentOutlined";
import PastSessionsIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import PaymentIcon from "@material-ui/icons/CreditCardOutlined";
import ContactIcon from "@material-ui/icons/ContactPhoneOutlined";
import Hidden from "@material-ui/core/es/Hidden/Hidden";

const userTabs = {
    "instructor": [
        {
            tab_heading: "Courses",
            tab_id: 1,
            icon: <CoursesIcon className="TabIcon" />,
        },
        {
            tab_heading: "Bio",
            tab_id: 2,
            icon: <BioIcon className="TabIcon" />,
        },
        {
            tab_heading: "Notes",
            tab_id: 7,
            icon: <NoteIcon className="TabIcon" />,
        },
    ],
    "student": [
        {
            tab_heading: "Current Sessions",
            tab_id: 3,
            icon: <CurrentSessionsIcon className="TabIcon" />,
        },
        {
            tab_heading: "Past Sessions",
            tab_id: 4,
            icon: <PastSessionsIcon className="TabIcon" />,
        },
        {
            tab_heading: "Parent Contact",
            tab_id: 6,
            icon: <ContactIcon className="TabIcon" />,
        },
        {
            tab_heading: "Notes",
            tab_id: 7,
            icon: <NoteIcon className="TabIcon" />,
        }],

        "parent": [
            {
                tab_heading: "Student Info",
                tab_id: 8,
                icon: <CurrentSessionsIcon className="TabIcon"/>,
            },
            {
                tab_heading: "Notes",
                tab_id: 7,
                icon: <NoteIcon className="TabIcon"/>,
            },
        ],
}

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            tabs: [],
            value: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        let user;
        let accountType = this.props.match.params.accountType, accountID = this.props.match.params.accountID;
        switch (accountType) {
            case "student":
                user = this.props.students[accountID];
                break;
            case "parent":
                user = this.props.parents[accountID];
                break;
            case "instructor":
                user = this.props.instructors[accountID];
                break;
            case "receptionist":
                user = this.props.receptionist[accountID];
                break;
            default:
                user = -1;
        }
        // this.setState({ ...CourseInView });
        if (user != "receptionist") {
            this.setState({
                user: user,
                tabs: userTabs[accountType],
            })
        }
        else {
            this.setState({
                user: user,
            })
        }
    }

    handleChange(e, newTabIndex) {
        e.preventDefault();
        this.setState({ value: newTabIndex });
    }

    stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let colour = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            colour += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return colour;
    }

    render() {
        const styles = {
            "backgroundColor": this.stringToColor(this.state.user.name),
            "color": "white",
            "width": "11vw",
            "height": "11vw",
            "fontSize": "4vw",
            "margin": 20,
        };
        let tabs;
        if (this.state.user.role !== "receptionist") {
            tabs =
                (<div>
                    <Tabs
                    key={this.props.inView}
                    value={this.state.value}
                    onChange={this.handleChange}
                    variant="scrollable"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {this.state.tabs.map((tab) => {
                        return <Tab
                            label={<>{tab.icon} {tab.tab_heading}</>}
                            key={this.props.inView}
                        />
                    })}
                </Tabs>
                <ComponentViewer user={this.state.user} inView={this.state.tabs[this.state.value].tab_id} />
                </div>)
        }
        else {
            tabs=(<div>
                <Grid align="left">
                    Action Log
                </Grid>

                <Paper className={'paper'}>
            <Table className="ActionTable">
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Description</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.keys(this.state.user.action_log).map(rowID => {
                    let row = this.state.user.action_log[rowID];
                    return (
                        <TableRow key={row.date}
                                //   onClick={(e) => {
                                //       e.preventDefault();
                                //       this.goToRoute(`/${row.role}/${row.user_id}`)
                                //   }}
                                  className="row">
                            <TableCell component="th" scope="row">
                                <Grid container layout={'row'} alignItems={'center'}>
                                    <Grid item md={3}>
                                    </Grid>
                                    <Grid item md={9}>
                                        <Typography>
                                            {row.date}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.description}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
            </Paper>
            </div>
            );
        }
        return (<div className="UserProfile">
            <Paper className={'paper'}>
                <BackButton
                    warn={false}
                />
                <hr />
                <Grid container layout="row" className={'padding'}>
                    <Grid item xs={2} md={2} component={Hidden} xsDown>
                        <Avatar style={styles}>{this.state.user.name.match(/\b(\w)/g).join('')}</Avatar>
                    </Grid>
                    <Grid item xs={8} md={8} className="headingPadding">
                        <ProfileHeading user={this.state.user} />
                    </Grid>
                </Grid>
                {tabs}
            </Paper>
        </div>
        )
    }

}

UserProfile.propTypes = {};

function mapStateToProps(state) {
    return {
        students: state.Users.StudentList,
        parents: state.Users.ParentList,
        instructors: state.Users.InstructorList,
        receptionist: state.Users.ReceptionistList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfile);
