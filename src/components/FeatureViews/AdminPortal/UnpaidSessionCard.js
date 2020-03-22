import React from "react";
import PropTypes from "prop-types";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import * as adminUtils from "./AdminUtils";
import {stringToColor} from "../Accounts/accountUtils";
import {useSelector} from "react-redux";

const UnpaidSessionCard = ({unpaidStudent}) => {
    const students = useSelector(({Users}) => Users.StudentList);
    const courses = useSelector(({Course}) => Course.NewCourseList);

    const student = students[unpaidStudent.student];
    const course = courses[unpaidStudent.course];
    const startTime = adminUtils.getTime(course.schedule.start_time);
    const endTime = adminUtils.getTime(course.schedule.end_time);
    const amtDue = adminUtils.amountDue(
        course.hourly_tuition,
        unpaidStudent.sessions_left,
        adminUtils.calculateSessionLength(startTime, endTime)
    );

    return (
        <Card className="unpaid-sessions-card">
            <CardMedia>
                <Grid
                    className="unpaid-avatar-container"
                    container>
                    <Avatar
                        className="unpaid-avatar"
                        style={{
                            "backgroundColor": stringToColor(student.name),
                        }}>
                        {adminUtils.initials(
                            student.first_name, student.last_name
                        )}
                    </Avatar>
                </Grid>
            </CardMedia>
            <CardContent className="unpaid-details">
                <Typography className="unpaid-student-name">
                    {student.name}
                </Typography>
                <Typography className="unpaid-role-label">
                    Student
                </Typography>
                <Typography>
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
                    ${amtDue}
                    <br />
                    {course.title}
                </Typography>
            </CardContent>
        </Card>
    );
};

UnpaidSessionCard.propTypes = {
    "unpaidStudent": PropTypes.shape({
        "course": PropTypes.number.isRequired,
        "sessions_left": PropTypes.number.isRequired,
        "student": PropTypes.number.isRequired,
    }).isRequired,
};

export default UnpaidSessionCard;
