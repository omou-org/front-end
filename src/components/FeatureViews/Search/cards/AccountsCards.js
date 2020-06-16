import React from "react";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden/Hidden";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import {capitalizeString, truncateStrings} from "utils";
import {ReactComponent as IDIcon} from "../../../identifier.svg";
import {stringToColor} from "components/FeatureViews/Accounts/accountUtils";

const avatarStyles = (username) => ({
    "backgroundColor": stringToColor(username),
    "color": "white",
    "fontSize": 20,
    "height": "3.5vw",
    "marginBottom": 17,
    "marginLeft": 17,
    "marginRight": 17,
    "marginTop": 30,
    "width": "3.5vw",

});

const USER_DETAILS = gql`
    fragment UserDetails on UserType {
    email
    lastName
    firstName
    }`;

const QUERIES = {
    "ADMIN": gql`
        query AdminFetch($userID: ID!) {
            admin(userId: $userID) {
                user {
                    ...UserDetails
                }
            }
        }
        ${USER_DETAILS}`,
    "INSTRUCTOR": gql`
        query InstructorFetch($userID: ID!) {
            instructor(userId: $userID) {
                user {
                    ...UserDetails
                }
            }
        }
        ${USER_DETAILS}`,
    "PARENT": gql`
        query ParentFetch($userID: ID!) {
            parent(userId: $userID) {
                user {
                    ...UserDetails
                }
            }
        }
        ${USER_DETAILS}`,
    "STUDENT": gql`
        query StudentFetch($userID: ID!) {
            student(userId: $userID) {
                user {
                    ...UserDetails
                }
            }
        }
        ${USER_DETAILS}`,
};

const AccountsCards = ({accountType, userID, isLoading}) => {
    // needs a defined query, else it breaks
    const {data, loading} = useQuery(QUERIES[accountType] || QUERIES.STUDENT, {
        "variables": {userID},
    });

    if (isLoading || loading) {
        return (
            <Card style={{"height": "130px"}}>
                <CardContent>
                    <Typography color="textSecondary"
                        gutterBottom
                        variant="h4">
                        Loading...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    const [{user}] = Object.values(data);
    const fullName = `${user.firstName} ${user.lastName}`;

    return (
        <Link to={`/accounts/${accountType.toLowerCase()}/${userID}`}
            style={{"textDecoration": "none"}}>
            <Card className="AccountsCards" key={userID}
                style={{
                    "padding": "10px",
                }}>
                <Grid container>
                    <Hidden mdDown>
                        <Grid item md={3}>
                            <Avatar style={avatarStyles(fullName)}>
                                {fullName.match(/\b(\w)/ug).join("")}
                            </Avatar>
                        </Grid>
                    </Hidden>
                    <Grid item md={9} xs={8}>
                        <CardContent className="cardText">
                            <Typography align="left"
                                style={{"fontWeight": "500"}}>
                                {truncateStrings(fullName, 20)}
                            </Typography>
                            <Grid align="left">
                                <Chip className={`userLabel ${accountType.toLowerCase()}`}
                                    label={capitalizeString(accountType)} />
                            </Grid>
                            <Grid item style={{"marginTop": 10}} xs={12}>
                                <Grid container justify="flex-start">
                                    <Grid item xs={2}>
                                        <IDIcon height={14} width={14} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        # {userID}
                                    </Grid>
                                </Grid>
                                {user.email &&
                                    <Grid container justify="flex-start">
                                        <Grid item xs={2}>
                                            <EmailIcon
                                                style={{"fontSize": 14}} />
                                        </Grid>
                                        <Grid item xs={10}>
                                            {user.email}
                                        </Grid>
                                    </Grid>}
                            </Grid>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Link>
    );
};

AccountsCards.propTypes = {
    "accountType": PropTypes
        .oneOf(["STUDENT", "PARENT", "INSTRUCTOR", "ADMIN"]),
    "isLoading": PropTypes.bool,
    "userID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default AccountsCards;
