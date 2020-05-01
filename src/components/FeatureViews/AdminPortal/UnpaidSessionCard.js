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

import * as adminUtils from "./AdminUtils";
import {initials} from "utils";
import {stringToColor} from "../Accounts/accountUtils";
import {useSelector} from "react-redux";
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles((theme) => ({
    card: {
        [theme.breakpoints.down('md')]: {
            width: "20vw",
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
    }

}))

const UnpaidSessionCard = ({unpaidStudent}) => {
    const classes = useStyles();
    const students = useSelector(({Users}) => Users.StudentList);
    const courses = useSelector(({Course}) => Course.NewCourseList);

	const student = students[unpaidStudent.student];
	const course = courses[unpaidStudent.course];
	const startTime = course.schedule.start_time;
	const endTime = course.schedule.end_time;
	const amtDue = adminUtils.amountDue(
		course.hourly_tuition,
		unpaidStudent.sessions_left,
		adminUtils.calculateSessionLength(startTime, endTime)
	);

    const studentID = student.user_id;
    const courseID = course.course_id;

    return (
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
                            "backgroundColor": stringToColor(student.name),
                        }}>
                        {initials(
                            student.first_name, student.last_name
                        )}
                    </Avatar>
                </Grid>
                <CardContent className={`unpaid-details ${classes.details}`}>
                    <Typography className={`unpaid-student-name ${classes.name}`}>
                        {student.name}
                    </Typography>
                    <Typography className={`unpaid-role-label ${classes.label}`}>
                        Student
                    </Typography>
                    <Typography className={`unpaid-status-info ${classes.info}`}>
                        Payment Status: <span
                            className="unpaid-status"
                            style={{
                                "backgroundColor": adminUtils.statusColor[
                                    unpaidStudent.sessions_left
                                ],
                            }}>
                            {unpaidStudent.sessions_left}
                        </span>
                        <br />
                        Amount Due: ${amtDue}
                        <br />
                        <Tooltip title={course.title}>
                            <Typography className="unpaid-status-info" noWrap={true}>
                                {course.title}
                            </Typography>
                        </Tooltip>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
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
