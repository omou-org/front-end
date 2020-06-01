import React, {useCallback, useState} from "react";
import {Link, Redirect, useHistory, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import useAuthStyles from "./styles.js";

import {isFail, isLoading, isSuccessful} from "actions/hooks";
import {login, resetAttemptStatus} from "actions/authActions.js";

const useStyles = makeStyles((theme) => ({
    "forgot": {
        "color": theme.colors.darkGray,
        "text-decoration": "none",
    },
    "smallerRoot": {
        [theme.breakpoints.up("sm")]: {
            "width": "412px",
        },
    },
}));

// eslint-disable-next-line max-statements
const LoginPage = () => {
    const fetchUserStatus = useSelector(
        ({RequestStatus}) => RequestStatus.userFetch,
    );
    const {state} = useLocation();
    const loginStatus = useSelector(({RequestStatus}) => RequestStatus.login);
    const dispatch = useDispatch();
    const history = useHistory();

    const [email, setEmail] = useState(state?.email);
    const [password, setPassword] = useState(null);
    const [savePassword, setSavePassword] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(true);

    const classes = {
        ...useStyles(),
        ...useAuthStyles(),
    };

    const handleTextInput = useCallback((setter) => ({target}) => {
        setter(target.value);
        dispatch(resetAttemptStatus());
    }, [dispatch]);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        login(email, password, savePassword)(dispatch);
    }, [dispatch, email, password, savePassword]);

    const toggleSavePassword = useCallback(({target}) => {
        setSavePassword(target.checked);
    }, []);

    const failedLogin = isFail(loginStatus);
    if (isLoading(loginStatus) && isLoading(fetchUserStatus)) {
        return <Loading />;
    }

    if ((isSuccessful(fetchUserStatus) || isSuccessful(loginStatus)) &&
        shouldRedirect) {
        if (history.length > 2) {
            history.goBack();
        } else {
            return <Redirect to="/" />;
        }
        setShouldRedirect(false);
    }

    return (
        <Paper className={`${classes.root} ${classes.smallerRoot}`}>
            <Typography align="center" className={classes.header}
                color="primary">
                sign in
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField error={failedLogin || email === ""} fullWidth
                    inputProps={{"data-cy": "emailField"}} label="E-Mail"
                    margin="normal" onChange={handleTextInput(setEmail)}
                    value={email} />
                <TextField autoComplete="current-password"
                    error={failedLogin || password === ""} fullWidth
                    inputProps={{"data-cy": "passwordField"}} label="Password"
                    onChange={handleTextInput(setPassword)} type="password"
                    value={password} />
                <Grid alignItems="center" className={classes.options} container
                    justify="space-between">
                    <Grid item>
                        <FormControlLabel
                            control={<Checkbox checked={savePassword}
                                onChange={toggleSavePassword} />}
                            label="Remember Me" />
                    </Grid>
                    <Grid item>
                        <Link className={classes.forgot} to={{
                            "pathname": "/forgotpassword",
                            "state": {email},
                        }}>
                            Forgot Password?
                        </Link>
                    </Grid>
                </Grid>
                <Button className={classes.primaryButton} color="primary"
                    data-cy="signInButton" disabled={!email || !password}
                    type="submit" variant="contained">
                    sign in
                </Button>
            </form>
            {failedLogin && (
                <Typography color="error" data-cy="errorMessage">
                    Invalid credentials
                </Typography>
            )}
        </Paper>
    );
};

export default LoginPage;
