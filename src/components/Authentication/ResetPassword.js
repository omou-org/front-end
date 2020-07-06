import React, {useCallback, useState} from "react";
import gql from "graphql-tag";
import {makeStyles} from "@material-ui/core/styles";
import useAuthStyles from "./styles";
import {useQuery, useMutation} from "@apollo/react-hooks";
import {useSelector} from "react-redux";
import {useSearchParams} from "actions/hooks";

import {Link, Redirect, useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {PasswordInput} from "../Form/Fields";
import Typography from "@material-ui/core/Typography";

import Loading from "components/OmouComponents/Loading";

const useStyles = makeStyles((theme) => ({
    "email": {},
    "info": {
        "color": theme.colors.black,
        "margin-bottom": "10px",
        "margin-top": "34px",
    },
    "requirements": {
        "color": theme.colors.darkGray,
        "margin-bottom": "30px",
        "margin-top": "20px",
    },
}));

const GET_EMAIL = gql`
    query GetEmail($token:String) {
        emailFromToken(token: $token)
    }`;

const RESET_PASSWORD = gql`
    mutation ResetPassword($password: String!, $token: String!) {
        resetPassword(newPassword: $password, token: $token) {
            status
        }
    }`;

// eslint-disable-next-line max-statements
const ResetPassword = () => {
    const params = useSearchParams();
    const resetToken = params.get("token");
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const emailStatus = useQuery(GET_EMAIL, {"variables": {"token": resetToken}});
    const email = emailStatus.data?.emailFromToken;
    const [resetPassword, resetStatus] = useMutation(RESET_PASSWORD);
    const {token} = useSelector(({auth}) => auth);

    const handlePasswordInput = useCallback(({target}) => {
        setPassword(target.value);
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        resetPassword({
            "variables": {
                password,
                "token": resetToken,
            },
        });
    }, [password, resetPassword, resetToken]);

    const classes = {
        ...useAuthStyles(),
        ...useStyles(),
    };

    if (token) {
        if (history.length > 2) {
            history.goBack();
        } else {
            return <Redirect to="/" />;
        }
    }

    if (emailStatus.loading) {
        return <Loading />;
    }

    if (emailStatus?.error) {
        return (
            <Paper className={classes.root}>
                <Typography align="left" className={classes.header} color="primary">
                    reset password
                </Typography>
                <Typography align="left" className={classes.info}>
                    Invalid token.
                </Typography>
            </Paper>
        );
    }

    const success = resetStatus.data?.resetPassword.status === "success";

    return (
        <Paper className={classes.root}>
            <Typography align="left" className={classes.header} color="primary">
                {success ? "reset successful!" : "reset password"}
            </Typography>
            <Typography align="left" className={classes.info}>
                {success ?
                    "You can now log in with your new password." :
                    <>Reset password for <span className={email}>{email}</span></>}
            </Typography>
            {success ?
                <Button className={classes.primaryButton} color="primary"
                    component={Link} data-cy="return" to={{
                        "pathname": "/login",
                        "state": {email},
                    }} variant="contained">
                    Back to login
                </Button> :
                <form onSubmit={handleSubmit}>
                    <PasswordInput fullWidth
                        inputProps={{"data-cy": "passwordField"}}
                        isField={false} label="new password" margin="normal"
                        onChange={handlePasswordInput} value={password} />
                    <Grid alignItems="center" container justify="space-evenly">
                        <Grid item>
                            <Button className={classes.primaryButton}
                                color="primary" data-cy="reset"
                                disabled={!password || resetStatus.loading}
                                type="submit" variant="contained">
                                Reset Password
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button className={classes.secondaryButton}
                                component={Link} data-cy="return" to={{
                                    "pathname": "/login",
                                    "state": {email},
                                }} variant="outlined">
                                Back to login
                            </Button>
                        </Grid>
                    </Grid>
                </form>}
        </Paper>
    );
};

export default ResetPassword;
