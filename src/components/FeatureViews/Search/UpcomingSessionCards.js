import { connect } from "react-redux";
import React, { useState } from "react";
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography, Grow } from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from "react-router-dom";



function ProfileCard(props) {
    const [value, setValue] = useState(0);
    const [userList, setUserList] = useState([])
    const [viewToggle, setViewToggle] = useState(true);

    const goToRoute = (route) => {
        props.history.push(props.match.url + route);
    }
    const stringToColor = (string) => {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let colour = "#";

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            colour += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return colour;
    }



    return (
        <Grid item xs={12} sm={3} className={"ProfileCard"}>
            <Card key={props.user.user_id}
                style={{ cursor: "pointer" }}
                onClick={(event) => {
                    event.preventDefault();
                    goToRoute(`/${props.user.role}/${props.user.user_id}`);
                }}>
                <Grid container>
                    <Grid item sm={12}>
                        <Typography align={"center"} variant={"h5"}> Noveber 12, 2019 | 7:00 - 9:00 </Typography>
                    </Grid>
                    <Grid item sm={5}>
                        <Chip
                            style={{
                                cursor: "pointer", width: '100px',
                                height: '30px'
                            }}
                            label={"Type of course"}
                        />
                    </Grid>
                    <Grid container style={{ "paddingLeft": "2em" }}>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Typography variant={"h6"}> Course Name: </Typography>
                            </Grid>
                            <Grid item sm={"auto"}>Calc 101</Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}

                        >
                            <Grid item>
                                <Typography variant={"h6"}> Subject: </Typography>
                            </Grid>
                            <Grid item sm={"auto"}>AP Calculus</Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Typography variant={"h6"}> Teacher: </Typography>
                            </Grid>
                            <Grid item sm={"auto"}>Daniel Huang</Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}


ProfileCard.propTypes = {};

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
)(ProfileCard));
