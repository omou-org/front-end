import { connect } from "react-redux";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography, Grow } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from "react-router-dom";
import "../Search.scss";

function UpcomingSessionCards(props) {
    return (
        <Grid item xs={12} sm={3} style={{ padding: "20px" }}>
            <Card key={props.user.user_id}
                className={"UpcomingSessionCards"}
                style={{ cursor: "pointer" }}
            >
                <Grid container>
                    <Grid item sm={12}>
                        <Typography align={"center"} variant={"subtitle2"}> November 12, 2019 | 7:00 - 9:00 </Typography>
                    </Grid>
                    <Grid item sm={5}>
                        <Chip
                            style={{
                                cursor: "pointer", width: '100px',
                                height: '20px'
                            }}
                            label={"Type of course"}
                        />
                    </Grid>
                    <Grid container>
                        <Grid container
                            direction={"row"}
                            alignItems={'center'}
                            className="sessionRow"
                        >
                            <Grid item>
                                <Typography className="sessionText"> Course Name: </Typography>
                            </Grid>
                            <Grid item sm={3} className="sessionText">Calc 101</Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                            className="sessionRow"
                        >
                            <Grid item>
                                <Typography className="sessionText"> Subject: </Typography>
                            </Grid>
                            <Grid item sm={5} className="sessionText">AP Calculus</Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                            className="sessionRow"
                        >
                            <Grid item>
                                <Typography className="sessionText"> Teacher: </Typography>
                            </Grid>
                            <Grid item sm={5} className="sessionText">Daniel Huang</Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}


UpcomingSessionCards.propTypes = {};

function mapStateToProps(state) {
    return {
        instructors: state.Users.InstructorList,
        parents: state.Users.ParentList,
        students: state.Users.StudentList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UpcomingSessionCards));
