import React, {useCallback, useState} from "react";
import useAuthStyles from "./styles";

import {Link, useLocation} from "react-router-dom";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    "info": {
        "color": theme.colors.darkGray,
        "margin-top": "34px",
    },
}));

const ForgotPassword = () => {
    const {state} = useLocation();
    const [email, setEmail] = useState(state?.email);
    const [submitted, setSubmitted] = useState(false);

    const handleEmailInput = useCallback(({target}) => {
        setEmail(target.value);
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        // TODO: send email
        setSubmitted(true);
    }, []);

    const classes = {
        ...useAuthStyles(),
        ...useStyles(),
    };

    return (
        <Paper className={classes.root}>
            <Typography align="left" className={classes.header} color="primary">
                {submitted ? "reset email sent!" : "forgot your password?"}
            </Typography>
            <Typography align="left" className={classes.info}>
                {submitted ?
                    "Follow the instructions on the email to reset your password." :
                    "Enter the email for your account and we will send you an email link to reset your password:"}
            </Typography>
            {submitted ?
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
