import React from 'react';
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";


const TodayCard = ({session}) => {

    const instructors = useSelector(({Users}) => Users.InstructorList);
    const courses = useSelector(({Course}) => Course.NewCourseList);

    console.log(courses);

    const course = session.title
    const instructor = instructors[session.instructor].name
    const startTime = courses[session.course].schedule.start_time
    const roster = course[session.course].roster
    const countStudents = 0;
    if (roster)
        {countStudents=roster.length};

    console.log(roster);

    return (
        <Card className="today-card">
            <CardContent
                className="today-details">
                <Typography variant='h6' className='today-course-title'>
                    {course}
                </Typography>
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