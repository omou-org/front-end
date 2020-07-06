import React, {useCallback, useState} from "react";
import gql from "graphql-tag";
import {makeStyles} from "@material-ui/core/styles";
import useAuthStyles from "./styles";
import {useMutation} from "@apollo/react-hooks";
import {useSelector} from "react-redux";

import {Link, useLocation, useHistory, Redirect} from "react-router-dom";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    "info": {
        "color": theme.colors.darkGray,
        "margin-top": "34px",
    },
}));

const REQUEST_RESET = gql`
    mutation RequestReset($email: String!) {
        requestPasswordReset(email: $email) {
            status
        }
    }`;

const ForgotPassword = () => {
    const {state} = useLocation();
    const history = useHistory();
    const [email, setEmail] = useState(state?.email || "");
    const {token} = useSelector(({auth}) => auth);
    const [requested, setRequested] = useState(false);
    const [requestReset] = useMutation(REQUEST_RESET, {
        "ignoreResults": true,
    });

    const handleEmailInput = useCallback(({target}) => {
        setEmail(target.value);
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        requestReset({"variables": {email}});
        setRequested(true);
    }, [email, requestReset]);

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

    return (
        <Paper className={classes.root}>
            <Typography align="left" className={classes.header} color="primary">
                {requested ? "reset email sent!" : "forgot your password?"}
            </Typography>
            <Typography align="left" className={classes.info}>
                {requested ?
                    "Follow the instructions on the email to reset your password." :
                    "Enter the email for your account and we will send you an email link to reset your password:"}
            </Typography>
            {requested ?
                <Button className={classes.primaryButton} color="primary"
                    component={Link} data-cy="return" to={{
                        "pathname": "/login",
                        "state": {email},
                    }} variant="contained">
                    Back to login
                </Button> :
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth inputProps={{"data-cy": "emailField"}}
                        label="E-Mail" margin="normal"
                        onChange={handleEmailInput} value={email} />
                    <Button className={classes.primaryButton} color="primary"
                        data-cy="reset" disabled={!email}
                        type="submit" variant="contained">
                        Send Reset Email
                    </Button>
                </form>}
        </Paper>
    );
};

export default ForgotPassword;
