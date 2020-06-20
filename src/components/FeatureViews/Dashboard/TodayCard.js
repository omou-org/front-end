import React from 'react';
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import moment from 'moment';
import { makeStyles } from "@material-ui/styles";
import {NavLink} from 'react-router-dom';
import {fullName} from "utils";

const useStyles = makeStyles((theme) => ({
    icons: {
        [theme.breakpoints.down('lg')]: {
            transform:"scale(.8)",
        }
    },
}));

const TodayCard = ({session}) => {
    const classes = useStyles();
    const countStudents = session.course.enrollmentSet.length
    const instructorFullName = fullName(session.course.instructor.user.firstName, session.course.instructor.user.lastName)
    const startTime = session.course.startTime
    const formattedStartTime = moment(startTime, "HH:mm").format("h:mm a");

    return (
        <Card className="today-card">
            <CardActionArea
                component = {NavLink}
                to={`/scheduler/view-session/${session.course.id}/${session.id}/${session.course.instructor.user.id}`}                
            >
                <CardContent
                    className="today-details">
                    <Tooltip title={session.course.title}>
                        <Typography variant='subtitle2' gutterBottom className='today-course-title' noWrap={true}>
                            {session.course.title}
                        </Typography>
                    </Tooltip>
                    <Divider/>
                    <br/>
                    <Typography variant="body2" className="today-card-details">
                        <span className={`material-icons ${classes.icons}`}>alarm</span> {formattedStartTime}
                    </Typography>
                    <Typography variant="body2" className="today-card-details">
                        <span className={`material-icons ${classes.icons}`}>face</span> {instructorFullName}
                    </Typography>
                    <Typography variant="body2" className="today-card-details">
                        <span className={`material-icons ${classes.icons}`}>group</span> {countStudents} students
                    </Typography>
                </CardContent>
            </CardActionArea>
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