import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {stringToColor} from "../Accounts/accountUtils";
import {roleColor, initials, calculateSessionLength, getTime, statusColor, amountDue} from "./AdminUtils";
import {useSelector} from "react-redux";

const styles = (username) => ({
    "backgroundColor": stringToColor(username),
    "color": "white",
    "margin": 9,
    "width": 47,
    "height": 47,
    "fontSize": 45,
    "alignSelf": "center",
    "fontFamily": "Roboto",
    "position": "absolute",
    "top": "-60px",
    "right": "22%",
    "padding": "50px"
});

const roleStyle = (role) => ({
    "backgroundColor": roleColor[role],
    "borderRadius": "50px",
    "color": "white",
    "height": 30,
    "margin": 10,
    "padding": 5,   
    "fontSize": 12,
    "alignSelf": "center",
    "textAlign": "center"
})

const cardStyle = {
    "height": 250,  
    "width": 220,
    "padding": "10px"
}

const statusStyle = (status) => ({
    "backgroundColor": statusColor[status],
    "color": "black",
    "height": "30px",
    "width": "30px",
    "lineHeight": 1,
    "margin": "auto",
    "padding": 10,
    "borderRadius": "50%",
    "display": "inline-block"
})

const UnpaidSessionCard = ({unpaidStudent}) => {

    const students = useSelector(({Users}) => Users.StudentList);
    const courses = useSelector(({Course}) => Course.NewCourseList);
    const student = students[unpaidStudent.student];
    const course = courses[unpaidStudent.course];
    const startTime = getTime(course.schedule.start_time);
    const endTime = getTime(course.schedule.end_time);
    const amtDue = amountDue(course.hourly_tuition, unpaidStudent.sessions_left, calculateSessionLength(startTime, endTime))

    return(
        <Card style= {{overflow: "visible"}}> 
            <CardActionArea style = {cardStyle}>
                <CardMedia>
                    <Grid container style={{justifyContent:"center"}}>
                        <Avatar 
                        style={styles(student.name)}
                        >
                            {initials(student.first_name, student.last_name)}
                        </Avatar>
                    </Grid>
                </CardMedia>
                <CardContent style ={{padding: "40px 20px 20px 20px"}}>
                    <Typography style ={{fontSize: "16px", fontWeight: 500, lineHeight: "24px", textAlign: "center"}}>
                        {student.name}
                    </Typography>
                    <Typography style={roleStyle("student")} >
                        Student
                    </Typography>
                    <Typography style={{fontFamily: "Roboto", textAlign: "left", fontSize: "11px", lineHeight: "24px"}}>
                        Payment Status: 
                        <span style={statusStyle(unpaidStudent.sessions_left)}>{unpaidStudent.sessions_left}</span>
                        <br/>
                        Amount Due: ${amtDue}
                        <br/>
                        Course: {course.title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default UnpaidSessionCard;