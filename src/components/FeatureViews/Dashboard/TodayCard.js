import React from 'react';
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";


const TodayCard = ({session}) => {

    const instructors = useSelector(({Users}) => Users.InstructorList);
    const courses = useSelector(({Course}) => Course.NewCourseList);

    const course = session.title
    const instructor = instructors[session.instructor].name
    const startTime = courses[session.course].schedule.start_time
    const roster = courses[session.course].roster
    const countStudents = roster.length


    return (
        <Card className="today-card">
            <CardContent
                className="today-details">
                <Tooltip title={course}>
                    <Typography variant='h6' className='today-course-title' noWrap={true}>
                        {course}
                    </Typography>
                </Tooltip>
                <Typography>
                    <span className="material-icons">alarm</span>{startTime}
                </Typography>
                <Typography>
                    <span className="material-icons">face</span>{instructor}
                </Typography>
                <Typography>
                    <span className="material-icons">group</span> {countStudents} students
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