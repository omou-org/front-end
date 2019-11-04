import { connect } from "react-redux";
import React, { useState } from "react";
import BackButton from "../../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ListView from "@material-ui/icons/ViewList";
import CardView from "@material-ui/icons/ViewModule";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from "react-router-dom";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Hidden from "@material-ui/core/es/Hidden/Hidden";

import { makeStyles } from '@material-ui/styles';

import { ReactComponent as IDIcon } from "../../../identifier.svg";


import Avatar from "@material-ui/core/Avatar";




function AccountsCards(props) {


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

    const AvatarStyles = (username) => ({
        "backgroundColor": stringToColor(username),
        "color": "white",
        "width": "3vw",
        "height": "3vw",
        "fontSize": 20,
        "marginTop": 47,
        "marginBottom": 17,
        "marginRight": 17,
        "marginLeft": 17

    });


    const fullName = `${props.user.first_name} ${props.user.last_name}`

    return (
        <Grid item xs={12} sm={3} className={"ProfileCard"} style={{ padding: "20px" }}>
            <Card key={props.user.id}
                style={{ cursor: "pointer" }}
                onClick={(event) => {
                    event.preventDefault();
                    goToRoute(`/${props.user.role}/${props.user.user_id}`);
                }}>
                <Grid container>
                    <Hidden mdDown>
                        <Grid item xs={4} md={3}>
                            <Avatar
                                style={AvatarStyles(fullName)}>{fullName.match(/\b(\w)/g).join("")}
                            </Avatar>
                        </Grid>
                    </Hidden>
                    <Grid container item xs={8} md={9}>

                        <CardContent className={"text"}>
                            <Typography gutterBottom variant={"h6"} component={"h2"} align={'left'}>
                                {props.user.first_name} {props.user.last_name}
                            </Typography>

                            <Grid align={'left'}>
                                <Chip
                                    style={{
                                        cursor: "pointer", width: '100px',
                                        height: '30px'
                                    }}
                                    className={`userLabel ${props.user.role}`}
                                    label={props.user.role.charAt(0).toUpperCase() + props.user.role.slice(1)}
                                />
                            </Grid>

                            <Grid item xs={12} style={{ marginTop: 10 }}>
                                <Grid container
                                    justify={'flex-start'}
                                >
                                    <Grid>
                                        <IDIcon
                                            width={22}
                                            height={22} />
                                    </Grid>
                                    <Grid>
                                        # {props.user.id}
                                    </Grid>
                                </Grid>
                                <Grid container
                                    justify={'flex-start'}
                                    width={"100%"}
                                >
                                    <Grid item >
                                        <EmailIcon />
                                    </Grid>
                                    <Grid item>
                                        {props.user.email}
                                    </Grid>
                                </Grid>
                            </Grid>


                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}


AccountsCards.propTypes = {};

function mapStateToProps(state) {
    return {
        instructors: state.Users.InstructorList,
        parents: state.Users.ParentList,
        students: state.Users.StudentList,
        accounts: state.Search.accounts
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountsCards));
