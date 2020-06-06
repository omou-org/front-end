import React, {useCallback, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import useAuthStyles from "./styles";
import {useSelector} from "react-redux";

import {Link, useHistory, Redirect} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PasswordInput from "./PasswordInput";
import Typography from "@material-ui/core/Typography";


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

const ResetPassword = () => {
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const email = "nelson@summit.com";
    const {token} = useSelector(({auth}) => auth);

    const handlePasswordInput = useCallback(({target}) => {
        setPassword(target.value);
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        // TODO: reset password
        setSubmitted(true);
    }, []);

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
                {submitted ? "reset successful!" : "reset password"}
            </Typography>
            <Typography align="left" className={classes.info}>
                {submitted ?
                    "You can now log in with your new password." :
                    <>Reset password for <span className={email}>{email}</span></>}
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
                    <PasswordInput fullWidth
                        inputProps={{"data-cy": "passwordField"}}
                        label="new password" margin="normal"
                        onChange={handlePasswordInput} value={password} />
                    <Typography align="left" className={classes.requirements}
                        variant="body2">
                        Password requirements...
                    </Typography>
                    <Grid alignItems="center" container justify="space-evenly">
                        <Grid item>
                            <Button className={classes.primaryButton}
                                color="primary" data-cy="reset"
                                disabled={!password}
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
