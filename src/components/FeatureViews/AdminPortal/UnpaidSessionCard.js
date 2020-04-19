import React from "react";
import PropTypes from "prop-types";
import {NavLink} from 'react-router-dom';

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

import * as adminUtils from "./AdminUtils";
import {initials} from "utils";
import {stringToColor} from "../Accounts/accountUtils";
import {useSelector} from "react-redux";

const UnpaidSessionCard = ({unpaidStudent}) => {
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
        <Card className="unpaid-sessions-card">
            <CardActionArea
            component = {NavLink}
            to={`/accounts/students/${studentID}/${courseID}`}
            >
                <Grid
                    className="unpaid-avatar-container"
                    >   
                    <Avatar
                        className="unpaid-avatar"
                        style={{
                            "backgroundColor": stringToColor(student.name),
                        }}>
                        {initials(
                            student.first_name, student.last_name
                        )}
                    </Avatar>
                </Grid>
                <CardContent className="unpaid-details">
                    <Typography className="unpaid-student-name">
                        {student.name}
                    </Typography>
                    <Typography className="unpaid-role-label">
                        Student
                    </Typography>
                    <Typography className="unpaid-status-info">
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
