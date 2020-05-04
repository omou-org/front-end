import React from 'react';
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import moment from 'moment';
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    icons: {
        [theme.breakpoints.down('lg')]: {
            transform:"scale(.8)",
        }
    },
}));

const TodayCard = ({session}) => {
    const classes = useStyles();
    const instructors = useSelector(({Users}) => Users.InstructorList);
    const courses = useSelector(({Course}) => Course.NewCourseList);

    const course = session.title
    const instructor = instructors[session.instructor].name
    const startTime = (courses[session.course].schedule.start_time).slice(1)
    const roster = courses[session.course].roster
    const countStudents = roster.length

    const formattedStartTime = moment(startTime, "HH:mm").format("h:mm a");
 
    return (
        <Card className="today-card">
            <CardContent
                className="today-details">
                <Tooltip title={course}>
                    <Typography variant='subtitle2' gutterBottom className='today-course-title' noWrap={true}>
                        {course}
                    </Typography>
                </Tooltip>
                <Divider/>
                <br/>
                <Typography variant="body2" className="today-card-details">
                    <span className={`material-icons ${classes.icons}`}>alarm</span> {formattedStartTime}
                </Typography>
                <Typography variant="body2" className="today-card-details">
                    <span className={`material-icons ${classes.icons}`}>face</span> {instructor}
                </Typography>
                <Typography variant="body2" className="today-card-details">
                    <span className={`material-icons ${classes.icons}`}>group</span> {countStudents} students
                </Typography>
            </CardContent>
        </Card>
    )
}

TodayCard.propTypes = {
    "session": PropTypes.shape({
        "course": PropTypes.number.isRequired,
        "instructor":PropTypes.number.isRequired,
    }).isRequired,
};

export default TodayCard;