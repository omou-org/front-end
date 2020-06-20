import React from "react";
import PropTypes from "prop-types";
import {NavLink} from 'react-router-dom';

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Loading from "components/Loading";

import * as adminUtils from "./AdminUtils";
import {initials} from "utils";
import {stringToColor} from "../Accounts/accountUtils";
import {useSelector} from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { fullName } from "utils";


const useStyles = makeStyles((theme) => ({
    card: {
        [theme.breakpoints.down('md')]: {
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "0px",
            fontSize: "10px",
        }
    },

    avatarContainer: {
        [theme.breakpoints.down('md')]: {
            padding: "5px",
            transform: "scale(.8)",
        }
    },
    details: {
        [theme.breakpoints.down('md')]: {
            padding: "5px",
        }
    },
    name: {
        [theme.breakpoints.down('md')]: {
            fontSize: '12px',
        }
    },
    label: {
        [theme.breakpoints.down('md')]: {
            transform: 'scale(0.8)',
        }
    },
    info: {
        [theme.breakpoints.down('md')]: {
            transform: "scale(.8)",
            top: "-20px",
            position: "relative",
        }
    },
}))

const UnpaidSessionCard = ({unpaidStudent}) => {
    const classes = useStyles();
    
    const studentName = fullName(unpaidStudent.student.user.firstName, unpaidStudent.student.user.lastName)
    const studentFirstName = unpaidStudent.student.user.firstName;
    const studentLastName = unpaidStudent.student.user.lastName;
    const studentID = unpaidStudent.student.user.id;
    const courseID = unpaidStudent.course.id;
    const courseTitle = unpaidStudent.course.title;
    const startTime = unpaidStudent.course.startTime;
    const endTime = unpaidStudent.course.endTime;
    const hourlyTuition = unpaidStudent.course.hourlyTuition;
    const sessionsLeft = unpaidStudent.sessionsLeft;
	const amtDue = adminUtils.amountDue(
		hourlyTuition,
		sessionsLeft,
		adminUtils.calculateSessionLength(startTime, endTime)
	);
    
    return (
        <Grid item md={6} lg={3} className={classes.grid}>
            <Card className={`unpaid-sessions-card ${classes.card}`}>
                <CardActionArea
                component = {NavLink}
                to={`/accounts/students/${studentID}/${courseID}`}
                >
                    <Grid
                        className={`unpaid-avatar-container ${classes.avatarContainer}`}
                        >   
                        <Avatar
                            className={`unpaid-avatar ${classes.avatar}`}
                            style={{
                                "backgroundColor": stringToColor(studentName),
                            }}>
                            {initials(
                                studentFirstName, studentLastName
                            )}
                        </Avatar>
                    </Grid>
                    <CardContent className={`unpaid-details ${classes.details}`}>
                        <Typography className={`unpaid-student-name ${classes.name}`}>
                            {studentName}
                        </Typography>
                        <Typography className={`unpaid-role-label ${classes.label}`}>
                            Student
                        </Typography>
                        <Typography className={`unpaid-status-info ${classes.info}`}>
                            Payment Status: <span
                                className="unpaid-status"
                                style={{
                                    "backgroundColor": adminUtils.statusColor[
                                        sessionsLeft
                                    ],
                                }}>
                                {sessionsLeft}
                            </span>
                            <br />
                            Amount Due: ${amtDue}
                            <br />
                            <Tooltip title={courseTitle}>
                                <Typography className="unpaid-status-info" noWrap={true}>
                                    {courseTitle}
                                </Typography>
                            </Tooltip>
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};


UnpaidSessionCard.propTypes = {
	unpaidStudent: PropTypes.shape({
		course: PropTypes.number.isRequired,
		sessions_left: PropTypes.number.isRequired,
		student: PropTypes.number.isRequired,
	}).isRequired,
};

export default UnpaidSessionCard;
