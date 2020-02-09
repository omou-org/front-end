import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import { withRouter } from "react-router-dom";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import {truncateStrings} from "../../../truncateStrings"

import { makeStyles } from '@material-ui/styles';

import { ReactComponent as IDIcon } from "../../../identifier.svg";


import Avatar from "@material-ui/core/Avatar";

function AccountsCards(props) {


    const goToRoute = (route) => {
        props.history.push(route);
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
        "width": "3.5vw",
        "height": "3.5vw",
        "fontSize": 20,
        "marginTop": 30,
        "marginBottom": 17,
        "marginRight": 17,
        "marginLeft": 17

    });

    // console.log(props.user);

    const fullName = `${props.user.user.first_name} ${props.user.user.last_name}`;


    return (
            <Card key={props.user.id}
                style={{ cursor: "pointer" }}
                  className={"AccountsCards"}
                  style={{ padding: "10px" }}
                onClick={(event) => {
                    event.preventDefault();
                     goToRoute(`/accounts/${props.user.account_type.toLowerCase()}/${props.user.user.id}`);
                }}>
                <Grid container>
                    <Hidden mdDown>
                        <Grid item xs={4} md={3}>
                            <Avatar
                                style={AvatarStyles(fullName)}>{fullName.match(/\b(\w)/g).join("")}
                            </Avatar>
                        </Grid>
                    </Hidden>
                    <Grid item xs={8} md={9}>

                        <CardContent className={"cardText"}>
                            <Typography align={'left'} style={{ fontWeight: "500" }}>
                                {truncateStrings(`${props.user.user.first_name} ${props.user.user.last_name}`, 20)}
                            </Typography>

                            <Grid align={'left'}>
                                <Chip
                                    style={{
                                        cursor: "pointer"
                                    }}
                                    className={`userLabel ${(props.user.account_type).toLowerCase()}`}
                                    label={props.user.account_type.charAt(0).toUpperCase() + (props.user.account_type).toLowerCase().slice(1)}
                                />
                            </Grid>

                            <Grid item xs={12} style={{ marginTop: 10 }}>
                                <Grid container
                                    justify={'flex-start'}
                                >
                                    <Grid item xs={2}>
                                        <IDIcon
                                            width={14}
                                            height={14} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        # {props.user.user.id}
                                    </Grid>
                                </Grid>
                              {props.user.account_type!=="STUDENT"&&  <Grid container
                                    justify={'flex-start'}
                                >
                                    <Grid item xs={2}>
                                        <EmailIcon style={{ fontSize: 14 }} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        {props.user.user.email}
                                    </Grid>
                                </Grid>}
                            </Grid>


                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
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
