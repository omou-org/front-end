import { connect } from "react-redux";
import React, { useState } from "react";
import BackButton from "../../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography, Grow } from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from "react-router-dom";



function CourseCards(props) {


    const handleLocaleDateString = (start, end) => {
        let s1 = new Date(start.replace(/-/g, '\/'))
        let s2 = new Date(end.replace(/-/g, '\/'))
        return `${s1.toLocaleDateString()} - ${s2.toLocaleDateString()}`
    }

    return (
        <Grid item xs={12} sm={3} className={"CourseCards"} style={{ "padding": "16px" }}>
            <Card key={props.user.user_id}
                style={{ cursor: "pointer", width: "103%", height: "106%" }}>
                <Grid container style={{ "paddingLeft": "1em" }}>
                    <Grid item sm={12}>
                        <Typography align={"left"} variant={"subtitle2"}> {props.user.course.title} </Typography>
                    </Grid>
                    <Grid item sm={"auto"}>
                        <Chip
                            style={{
                                cursor: "pointer",
                                width: '9rem',
                                height: '20px',
                            }}
                            label={"Full or Open"}
                            color='primary'
                        />
                    </Grid>

                    <Grid item container>
                        <Grid container
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item>
                                <Typography variant={"body1"}>Session Dates: {handleLocaleDateString(props.user.date_start, props.user.date_end)} </Typography>
                            </Grid>
                            <Grid item ></Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item>
                                <Typography variant={"body1"}> Subject: {props.user.course.subject} </Typography>
                            </Grid>

                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={'center'}>
                            <Grid item>
                                <Typography variant={"body1"}> Teacher: {props.user.course.instructor} </Typography>
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
