import React from 'react';
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";


const TodayCard = ({session}) => {

    const instructors = useSelector(({Users}) => Users.InstructorList);

    const course = session.title
    const instructor = session.instructor

    return (
        <Card className="today-card">
            <CardContent
                className="today-details">
                <Typography>
                    {course}
                </Typography>
                <Typography>
                    <span class="material-icons">alarm</span>Happening Now
                </Typography>
                <Typography>
                    <span class="material-icons">face</span>{instructor}
                </Typography>
                <Typography>
                    <span class="material-icons">group</span> 20 students
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