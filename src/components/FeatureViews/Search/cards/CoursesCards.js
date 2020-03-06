import {connect, useSelector} from "react-redux";
import React from "react";
import Grid from "@material-ui/core/Grid";
import {Card, Tooltip, Typography} from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import {withRouter} from "react-router-dom";
import "../Search.scss";
import CardContent from "@material-ui/core/CardContent";


function CourseCards(props) {
    const instructors = useSelector(({ "Users": { InstructorList } }) => InstructorList);

    const handleLocaleDateString = (start, end) => {
        if(start && end){
            let s1 = new Date(start.replace(/-/g, '/'));
            let s2 = new Date(end.replace(/-/g, '/'));
            return `${s1.toLocaleDateString()} - ${s2.toLocaleDateString()}`
        }
    };

    const goToCoursePage = ()=> (e)=>{
        e.preventDefault();

        let courseID = props.course.course_id ? props.course.course.id : props.course.id;

        props.history.push(`/registration/course/${courseID}/${props.course.subject}`)
    };

    if(Object.keys(instructors).length === 0){
        return <Card>
            <CardContent>
                <Typography variant="h4" color="textSecondary" gutterBottom>
                    Loading...
                </Typography>
            </CardContent>
        </Card>
    }

    return (
        <Grid item xs={12} sm={3} style={{ "padding": "10px" }}
            onClick={goToCoursePage()}>
            <Card key={props.course.course_id}
                className={"CourseCards"}
                style={{ cursor: "pointer", height: "148px" }}>
                <Grid container>
                    <Grid item sm={12}>
                        <Typography align={"left"} variant={"subtitle2"}> {props.course.subject} </Typography>
                    </Grid>
                    <Grid item sm={"auto"}>
                        {
                            props.course.max_capacity - props.course.enrollment_list.length > 0 ?
                                <Chip
                                    style={{
                                        cursor: "pointer",
                                        width: '9rem',
                                        height: '15px',
                                        color: "white",
                                    }}
                                    label={"Open"}
                                    color='primary'
                                />
                                :
                                <Chip
                                    style={{
                                        cursor: "pointer",
                                        width: '9rem',
                                        height: '15px',
                                        color: "white",
                                    }}
                                    label={"Full"}
                                    color='secondary'
                                />
                        }

                    </Grid>

                    <Grid item container>
                        <Grid container
                            className="courseRow"
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item align="left">
                                <Typography className="courseText">
                                   Dates: {handleLocaleDateString(props.course.start_date, props.course.end_date)}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container
                            className="courseRow"
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item>
                                <Tooltip title={props.course.subject}>
                                    <Typography className="courseText">
                                        Name: {props.course.subject.substr(0,20)}
                                        {props.course.subject.length > 20 ? "..." : ""}
                                    </Typography>
                                </Tooltip>
                            </Grid>

                        </Grid>
                        <Grid container
                            className="courseRow"
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item>
                                <Typography className="courseText">
                                    Teacher: {instructors[props.course.instructor].name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

CourseCards.propTypes = {};

function mapStateToProps(state) {
    return {
        instructors: state.Users.InstructorList,
        parents: state.Users.ParentList,
        students: state.Users.StudentList,
        courses: state.Search.courses
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseCards));
