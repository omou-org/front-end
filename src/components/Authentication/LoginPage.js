import React, {useCallback, useEffect, useState} from "react";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PasswordInput from "./PasswordInput";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import {makeStyles} from "@material-ui/core/styles";
import {setToken} from "actions/authActions.js";
import useAuthStyles from "./styles.js";

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

const LOGIN = gql`
    mutation Login($password: String!, $username: String!) {
        tokenAuth(password: $password, username: $username) {
            token
            payload
        }
    }
`;

const LoginPage = () => {
    const history = useHistory();
    const {state} = useLocation();
    const dispatch = useDispatch();
    const token = useSelector(({auth}) => auth.token);

    const [email, setEmail] = useState(state?.email);
    const [password, setPassword] = useState(null);
    const [shouldSave, setShouldSave] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [login, {loading}] = useMutation(LOGIN, {
        "errorPolicy": "ignore",
        "ignoreResults": true,
        "onCompleted": async ({tokenAuth}) => {
            dispatch(await setToken(tokenAuth.token, shouldSave));
        },
        // for whatever reason, this function prevents an unhandled rejection
        "onError": () => {
            setHasError(true);
        },
    });

    // must wait for token to update in redux before redirecting
    // otherwise ProtectedRoute's check will trigger and redirect us back here
    useEffect(() => {
        if (token) {
            if (history.length > 2) {
                history.goBack();
            } else {
                history.push("/");
            }
        }
    }, [token, history]);

    const classes = {
        ...useStyles(),
        ...useAuthStyles(),
    };

    const handleTextInput = useCallback((setter) => ({target}) => {
        setter(target.value);
        setHasError(false);
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        login({
            "variables": {
                password,
                "username": email,
            },
        });
    }, [login, email, password]);

    const toggleSavePassword = useCallback(({target}) => {
        setShouldSave(target.checked);
    }, []);

    return (
        <Paper className={`${classes.root} ${classes.smallerRoot}`}>
            <Typography align="center" className={classes.header}
                color="primary">
                sign in
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField error={hasError || email === ""} fullWidth
                    inputProps={{"data-cy": "emailField"}} label="E-Mail"
                    margin="normal" onChange={handleTextInput(setEmail)}
                    value={email} />
                <PasswordInput autoComplete="current-password"
                    error={hasError || password === ""} fullWidth
                    inputProps={{"data-cy": "passwordField"}} label="Password"
                    onChange={handleTextInput(setPassword)}
                    value={password} />
                <Grid alignItems="center" className={classes.options} container
                    justify="space-between">
                    <Grid item>
                        <FormControlLabel
                            control={<Checkbox checked={shouldSave}
                                inputProps={{"data-cy": "rememberMe"}}
                                onChange={toggleSavePassword} />}
                            label="Remember Me" />
                    </Grid>
                    <Grid item>
                        <Link className={classes.forgot}
                            data-cy="forgotPassword" to={{
                                "pathname": "/forgotpassword",
                                "state": {email},
                            }}>
                            Forgot Password?
                        </Link>
                    </Grid>
                </Grid>
                <Grid alignItems="center" container justify="space-evenly">
                    <Grid item>
                        <Button className={classes.primaryButton}
                            color="primary" data-cy="signInButton"
                            disabled={!email || !password || loading}
                            type="submit" variant="contained">
                            sign in
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button className={classes.secondaryButton}
                            component={Link} to={{
                                "pathname": "/newaccount",
                                "state": {
                                    email,
                                    password,
                                },
                            }} variant="outlined">
                            New Account
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {hasError && (
                <Typography color="error" data-cy="errorMessage">
                    Invalid credentials
                </Typography>
            )}
        </Paper>
    );
};

export default LoginPage;
