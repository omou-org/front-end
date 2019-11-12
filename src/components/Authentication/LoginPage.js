import * as authActions from "../../actions/authActions.js";
import {REQUEST_STARTED} from "../../actions/apiActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";


// material UI Imports
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "./LoginPage.scss";

const LoginPage = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [savePassword, setSavePassword] = useState(false);
    const [emailEmpty, setEmailEmpty] = useState(false);
    const [passwordEmpty, setPasswordEmpty] = useState(false);

    const handleTextInput = (setter, validator, {target}) => {
        setter(target.value);
        props.authActions.resetAttemptStatus();
        validator(!target.value);
    };

    const login = () => {
        props.authActions.login(email, password, savePassword);
    };

    const failedLogin = props.requestStatus.login &&
        props.requestStatus.login !== REQUEST_STARTED &&
        (props.requestStatus.login < 200 || props.requestStatus.login > 200);

    if (props.auth.token) {
        return <Redirect to="/" />;
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
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        login();
                    }}>
                        <TextField
                            className="email"
                            error={failedLogin || emailEmpty}
                            label="E-Mail"
                            margin="dense"
                            onChange={(event) => {
                                handleTextInput(setEmail, setEmailEmpty, event);
                            }}
                            value={email} />
                        <TextField
                            autoComplete="current-password"
                            className="password"
                            error={failedLogin || passwordEmpty}
                            id="standard-password-input"
                            label="Password"
                            margin="normal"
                            onChange={(event) => {
                                handleTextInput(setPassword, setPasswordEmpty, event);
                            }}
                            type="password"
                            value={password} />
                        <Grid container>
                            <Grid
                                className="remember"
                                item>
                                <label>
                                    <Checkbox
                                        checked={savePassword}
                                        onClick={() => {
                                            setSavePassword(!savePassword);
                                        }} />
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

LoginPage.propTypes = {
    "auth": PropTypes.shape({
        "token": PropTypes.string,
    }),
    "authActions": PropTypes.shape({
        "login": PropTypes.func,
        "resetAttemptStatus": PropTypes.func,
    }),
};

const mapStateToProps = ({auth, RequestStatus}) => ({
    auth,
    "requestStatus": RequestStatus,
});

const mapDispatchToProps = (dispatch) => ({
    "authActions": bindActionCreators(authActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);
