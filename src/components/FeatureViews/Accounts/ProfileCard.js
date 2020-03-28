import React from "react";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import {Link} from "react-router-dom";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import "./Accounts.scss";
import {addDashes} from "./accountUtils";
import {capitalizeString} from "utils";
import {ReactComponent as IDIcon} from "components/identifier.svg";
import UserAvatar from "./UserAvatar";

const useStyles = makeStyles({
    linkUnderline: {
        textDecoration: "none"
    }
});

const ProfileCard = ({user, route}) => {
    const classes = useStyles();
    return (
    <Grid
        item
        sm={6}
        xs={12}>
        {
            user &&
            <Link to={route} className={classes.linkUnderline}>
                <Card className="ProfileCard">
                    <Grid container>
                        <Grid
                            component={Hidden}
                            item
                            md={4}
                            xsDown>
                            <UserAvatar
                                fontSize={30}
                                margin="20px"
                                name={user.name}
                                size="7vw" />
                        </Grid>
                        <Grid
                            item
                            md={8}
                            xs={12}>
                            <CardContent className="text">
                                <Typography
                                    align="left"
                                    component="h2"
                                    gutterBottom
                                    variant="h6">
                                    {user.name}
                                </Typography>
                                <Typography
                                    align="left"
                                    component="p">
                                    <Chip
                                        className={`userLabel ${user.role}`}
                                        label={capitalizeString(user.role)} />
                                </Typography>
                                <Typography>
                                    <Grid
                                        className="card-content"
                                        container>
                                        <Grid
                                            align="left"
                                            item
                                            md={3}
                                            xs={2}>
                                            <IDIcon
                                                height={22}
                                                width={22} />
                                        </Grid>
                                        <Grid
                                            align="left"
                                            item
                                            md={9}
                                            xs={10}>
                                            #{user.user_id}
                                        </Grid>
                                        <Grid
                                            align="left"
                                            item
                                            md={3}
                                            xs={2}>
                                            <PhoneIcon />
                                        </Grid>
                                        <Grid
                                            align="left"
                                            item
                                            md={9}
                                            xs={10}>
                                            {addDashes(user.phone_number)}
                                        </Grid>
                                        <Grid
                                            align="left"
                                            item
                                            md={3}
                                            xs={2}>
                                            <EmailIcon />
                                        </Grid>
                                        <Grid
                                            align="left"
                                            item
                                            md={9}
                                            xs={10}>
                                            {user.email}
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Link>
        }
    </Grid>
)};

ProfileCard.propTypes = {
    "route": PropTypes.string,
    "user": PropTypes.shape({
        "email": PropTypes.string,
        "name": PropTypes.string,
        "phone_number": PropTypes.string,
        "role": PropTypes.oneOf([
            "instructor",
            "parent",
            "receptionist",
            "student",
        ]).isRequired,
        "user_id": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }).isRequired,
};

export default ProfileCard;
