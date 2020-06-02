import React, {useCallback} from "react";
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Typography from "@material-ui/core/Typography";

import {capitalizeString, truncateStrings} from "utils";
import {ReactComponent as IDIcon} from "../../../identifier.svg";
import {stringToColor} from "components/FeatureViews/Accounts/accountUtils";

const avatarStyles = (username) => ({
    "backgroundColor": stringToColor(username),
    "color": "white",
    "fontSize": 20,
    "height": 50,
    "marginBottom": 17,
    "marginLeft": 17,
    "marginRight": 17,
    "marginTop": 30,
    "width": 50,

});

const AccountsCards = ({user, isLoading}) => {
    const history = useHistory();

    const goToAccount = useCallback(() => {
        history.push(`/accounts/${user.account_type.toLowerCase()}/${user.user.id}`);
    }, [history, user]);

    if (isLoading) {
        return (
            <Grid item>
                <Card style={{"height": "130px"}}>
                    <CardContent>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h4">
                            Loading...
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    const fullName = `${user.user.first_name} ${user.user.last_name}`;

    return (
        <Grid item>
            <Card
                className="AccountsCards"
                key={user.id}
                onClick={goToAccount}
                style={{
                    "cursor": "pointer",
                    "padding": "10px",
                    "height":"160px",
                }}>
                <Grid container>
                        <Grid
                            item
                            md={4}
                            xs={4}>
                            <Avatar style={avatarStyles(fullName)}>
                                {fullName.match(/\b(\w)/ug).join("")}
                            </Avatar>
                        </Grid>
                    <Grid
                        item
                        md={8}
                        xs={8}>
                        <CardContent className="cardText">
                            <Typography
                                align="left"
                                style={{"fontWeight": "500"}}>
                                {truncateStrings(`${user.user.first_name} ${user.user.last_name}`, 20)}
                            </Typography>
                            <Grid align="left">
                                <Chip
                                    className={`userLabel ${user.account_type.toLowerCase()}`}
                                    label={capitalizeString(user.account_type)}
                                    style={{"cursor": "pointer"}} />
                            </Grid>
                            <Grid
                                item
                                style={{"marginTop": 10}}
                                xs={12}>
                                <Grid
                                    container
                                    justify="flex-start">
                                    <Grid
                                        item
                                        xs={2}>
                                        <IDIcon
                                            height={14}
                                            width={14} />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={10}>
                                        # {user.user.id}
                                    </Grid>
                                </Grid>
                                {
                                    user.account_type !== "STUDENT" &&
                                    <Grid
                                        container
                                        justify="flex-start">
                                        <Grid
                                            item
                                            xs={2}>
                                            <EmailIcon style={{"fontSize": 14}} />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={10}>
                                                <Typography noWrap={true} style={{"fontSize":10}}>
                                            {user.user.email}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
};

AccountsCards.propTypes = {
    "isLoading": PropTypes.bool,
    "user": PropTypes.object,
};

export default AccountsCards;
