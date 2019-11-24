import * as authActions from "../../actions/authActions.js";
import {REQUEST_STARTED} from "../../actions/apiActions";
import {bindActionCreators} from "redux";
import {useSelector, useDispatch} from "react-redux";
import {Redirect, useHistory} from "react-router-dom";
import React, {useMemo, useState, useCallback} from "react";


// material UI Imports
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "./LoginPage.scss";

const LoginPage = () => {
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const dispatch = useDispatch();

    const actions = useMemo(() => bindActionCreators(authActions, dispatch), [dispatch]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [savePassword, setSavePassword] = useState(false);
    const [emailEmpty, setEmailEmpty] = useState(false);
    const [passwordEmpty, setPasswordEmpty] = useState(false);
    const [hasGoneBack, setHasGoneBack] = useState(false);
    const history = useHistory();

    const handleTextInput = useCallback((setter, validator) => ({target}) => {
        setter(target.value);
        actions.resetAttemptStatus();
        validator(!target.value);
    }, [actions]);

    const login = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        actions.login(email, password, savePassword);
    }, [actions, email, password, savePassword]);

    const toggleSavePassword = useCallback(() => {
        setSavePassword((prevPassword) => !prevPassword);
    }, []);

    const failedLogin = requestStatus.login &&
        requestStatus.login !== REQUEST_STARTED &&
        (requestStatus.login < 200 || requestStatus.login > 300);

    const fetchUserStatus = requestStatus.userFetch;
    if (!requestStatus.login && (!fetchUserStatus || fetchUserStatus === REQUEST_STARTED)) {
        return "Loading...";
    }

    const goBack = () => {
        // to avoid multiple go-backs
        if (!hasGoneBack) {
            if (history.length > 2) {
                history.goBack();
            } else {
                return <Redirect to="/" />;
            }
            setHasGoneBack(true);
        }
    };

    if (fetchUserStatus >= 200 && fetchUserStatus < 300) {
        goBack();
    } else if (requestStatus.login >= 200 && requestStatus.login < 300) {
        if (!fetchUserStatus || fetchUserStatus !== REQUEST_STARTED) {
            actions.fetchUserStatus();
        }
        goBack();
    }

    return (
        <Grid
            alignItems="center"
            container
            direction="column"
            justify="center"
            spacing={0}
            style={{
                "minHeight": "100vh",
            }}>
            <Grid
                item
                xs={3}>
                <Paper className="bg">
                    <Typography
                        align="center"
                        color="primary">
                        <span className="header">sign in</span>
                    </Typography>
                    <form onSubmit={login}>
                        <TextField
                            className="email"
                            error={failedLogin || emailEmpty}
                            label="E-Mail"
                            margin="dense"
                            onChange={handleTextInput(setEmail, setEmailEmpty)}
                            value={email} />
                        <TextField
                            autoComplete="current-password"
                            className="password"
                            error={failedLogin || passwordEmpty}
                            id="standard-password-input"
                            label="Password"
                            margin="normal"
                            onChange={handleTextInput(setPassword, setPasswordEmpty)}
                            type="password"
                            value={password} />
                        <Grid container>
                            <Grid
                                className="remember"
                                item>
                                <label>
                                    <Checkbox
                                        checked={savePassword}
                                        onClick={toggleSavePassword} />
                                    Remember me
                                </label>
                            </Grid>
                            <Grid item>
                                <Button
                                    className="forgot"
                                    color="secondary">
                                    <span className="forgotText">Forgot Password?</span>
                                </Button>
                            </Grid>
                        </Grid>
                        <Button
                            className="button signIn"
                            color="primary"
                            disabled={!email || !password}
                            onClick={login}
                            type="submit"
                            variant="contained">
                            sign in
                        </Button>
                    </form>
                    {
                        failedLogin &&
                        <Typography color="error">
                            Invalid credentials
                        </Typography>
                    }
                </Paper>
            </Grid>
        </Grid>
    );
};

export default LoginPage;
