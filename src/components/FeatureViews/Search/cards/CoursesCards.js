import { connect } from "react-redux";
import React, { useState } from "react";
import BackButton from "../../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography, Grow } from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from "react-router-dom";
import "../Search.scss";


function CourseCards(props) {

    const handleLocaleDateString = (start, end) => {
        let s1 = new Date(start.replace(/-/g, '\/'))
        let s2 = new Date(end.replace(/-/g, '\/'))
        return `${s1.toLocaleDateString()} - ${s2.toLocaleDateString()}`
    }

    return (
        <Grid item xs={12} sm={3} style={{ "padding": "10px" }}>
            <Card key={props.user.user_id}
                className={"CourseCards"}
                style={{ cursor: "pointer", height: "148px" }}>
                <Grid container>
                    <Grid item sm={12}>
                        <Typography align={"left"} variant={"subtitle2"}> {props.user.course.title} </Typography>
                    </Grid>
                    <Grid item sm={"auto"}>
                        <Chip
                            style={{
                                cursor: "pointer",
                                width: '9rem',
                                height: '15px',
                                color: "white",
                            }}
                            label={"Full or Open"}
                            color='primary'
                        />
                    </Grid>

                    <Grid item container>
                        <Grid container
                            className="courseRow"
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item align="left">
                                <Typography className="courseText">Session Dates: {handleLocaleDateString(props.user.date_start, props.user.date_end)} </Typography>
                            </Grid>
                        </Grid>
                        <Grid container
                            className="courseRow"
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item>
                                <Typography className="courseText"> Subject: {props.user.course.subject} </Typography>
                            </Grid>

                        </Grid>
                        <Grid container
                            className="courseRow"
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item>
                                <Typography className="courseText"> Teacher: {props.user.course.instructor} </Typography>
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
