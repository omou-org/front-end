import {connect, useSelector} from "react-redux";
import React from "react";
import Grid from "@material-ui/core/Grid";
import {Card, Tooltip, Typography} from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import {useHistory, withRouter} from "react-router-dom";
import "../Search.scss";
import CardContent from "@material-ui/core/CardContent";


function CourseCards({course, isLoading}) {
    const history = useHistory();
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

        let courseID = course.course_id ? course.course.id : course.id;

        history.push(`/registration/course/${courseID}/${course.subject}`)
    };

    if(Object.keys(instructors).length === 0 || !course || isLoading){
        return <Grid item xs={3}>
            <Card style={{ height: "148px" }}>
                <CardContent>
                    <Typography variant="h4" color="textSecondary" gutterBottom>
                        Loading...
                    </Typography>
                </CardContent>
            </Card>
        </Grid>

    }

    return (
        <Grid item xs={12} sm={3} style={{ "padding": "10px" }}
            onClick={goToCoursePage()}>
            <Card key={course.course_id}
                className={"CourseCards"}
                style={{ cursor: "pointer", height: "148px" }}>
                <Grid container>
                    <Grid item sm={12}>
                        <Typography align={"left"} variant={"subtitle2"}> {course.subject} </Typography>
                    </Grid>
                    <Grid item sm={"auto"}>
                        {
                            course.max_capacity - course.enrollment_list.length > 0 ?
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
                                   Dates: {handleLocaleDateString(course.start_date, course.end_date)}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container
                            className="courseRow"
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item>
                                <Tooltip title={course.subject}>
                                    <Typography className="courseText">
                                        Name: {course.subject.substr(0,20)}
                                        {course.subject.length > 20 ? "..." : ""}
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
                                    Teacher: {instructors[course.instructor].name}
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
