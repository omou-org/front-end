import { connect } from "react-redux";
import React, { useState } from "react";
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography, Grow } from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from "react-router-dom";



function CourseCards(props) {
    const [value, setValue] = useState(0);
    const [userList, setUserList] = useState([])
    const [viewToggle, setViewToggle] = useState(true);

    const goToRoute = (route) => {
        props.history.push(props.match.url + route);
    }


    return (
        <Grid item xs={12} sm={3} className={"CourseCards"} style={{ "padding": "20px" }}>
            <Card key={props.user.user_id}
                style={{ cursor: "pointer", width: "100%" }}
                onClick={(event) => {
                    event.preventDefault();
                    goToRoute(`/${props.user.role}/${props.user.user_id}`);
                }}>
                <Grid container style={{ "paddingLeft": "1em" }}>
                    <Grid item sm={12}>
                        <Typography align={"left"} variant={"h5"}> Calculus 101 </Typography>
                    </Grid>
                    <Grid item sm={"auto"}>
                        <Chip
                            style={{
                                cursor: "pointer", width: '100px',
                                height: '30px',
                            }}
                            label={"Full or Open"}
                            color='primary'
                        />
                    </Grid>
                    <Grid container>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                            justify={"flex-start"}
                        >
                            <Grid item>
                                <Typography variant={"h6"}> Session Dates:  </Typography>
                            </Grid>
                            <Grid item> 10/1/2019 - 12/20/2019</Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Typography variant={"h6"}> Subject: </Typography>
                            </Grid>
                            <Grid item sm={4}>AP Calculus</Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Typography variant={"h6"}> Teacher: </Typography>
                            </Grid>
                            <Grid item sm={4}>Daniel Huang</Grid>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseCards));
