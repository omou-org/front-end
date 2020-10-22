import React, { useCallback } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden/Hidden";
import { NavLink } from "react-router-dom";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import "./Accounts.scss";
import { addDashes } from "./accountUtils";
import { capitalizeString } from "utils";
import { ReactComponent as IDIcon } from "components/identifier.svg";
import UserAvatar from "./UserAvatar";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { LabelBadge } from "theme/ThemedComponents/Badge/LabelBadge";

const useStyles = makeStyles({
    "linkUnderline": {
        "textDecoration": "none",
    },

});

const INVITE_STUDENT = gql`
    mutation InviteStudent($email:String!) {
        inviteStudent(email: $email) {
            errorMessage
            status
        }
    }`;

const ProfileCard = ({ user, route, studentInvite = false }) => {
    const [invite] = useMutation(INVITE_STUDENT, {
        "ignoreResults": true,
    });
    const inviteStudent = useCallback((event) => {
        event.stopPropagation();
        invite({
            "variables": {
                "email": user?.email,
            },
        });
    }, [invite, user]);

    const classes = useStyles();
    return (
        <Grid item sm={6} xs={12}>
            {user && (
                <Card className="ProfileCard">
                    <Grid container>
                        <NavLink className={classes.linkUnderline} to={route}>
                            <Grid component={Hidden} item md={4} xsDown>
                                <UserAvatar fontSize={30} margin="20px"
                                    name={user.name} size="7vw" />
                            </Grid>
                        </NavLink>
                        <Grid item md={8} xs={12}>
                            <NavLink className={classes.linkUnderline} to={route}>
                                <CardContent className="text">
                                    <Typography align="left" component="h2"
                                        gutterBottom variant="h6">
                                        {user.name}
                                    </Typography>
                                    <Typography align="left" component="p">
                                        <LabelBadge 
                                            label={capitalizeString(user.accountType)}
                                            variant="outline-gray"/>
                                    </Typography>
                                    <Typography>
                                        <Grid className="card-content" container>
                                            <Grid align="left" item md={3} xs={2}>
                                                <IDIcon height={22} width={22} />
                                            </Grid>
                                            <Grid align="left" item md={9} xs={10}>
                                                #{user.user.id}
                                            </Grid>
                                            <Grid align="left" item md={3} xs={2}>
                                                <PhoneIcon />
                                            </Grid>
                                            <Grid align="left" item md={9} xs={10}>
                                                {addDashes(user.phoneNumber)}
                                            </Grid>
                                            <Grid align="left" item md={3} xs={2}>
                                                <EmailIcon />
                                            </Grid>
                                            <Grid align="left" item md={9} xs={10}>
                                                {user.user.email}
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </CardContent>
                            </NavLink>
                            {studentInvite &&
                                <CardActions>
                                    <Button>
                                        <NavLink to={`/form/student/${user.user.id}`}>
                                            Edit
                                            </NavLink>
                                    </Button>
                                    <Button onClick={inviteStudent}>
                                        Invite
                                        </Button>
                                </CardActions>}
                        </Grid>
                    </Grid>
                </Card>
            )}
        </Grid>
    );
};

ProfileCard.propTypes = {
    "route": PropTypes.string,
    "studentInvite": PropTypes.bool,
    "user": PropTypes.shape({
        "email": PropTypes.string,
        "name": PropTypes.string,
        "phone_number": PropTypes.string,
        "role": PropTypes.oneOf(["instructor", "parent", "receptionist", "student"])
            .isRequired,
        "user_id": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

export default ProfileCard;
