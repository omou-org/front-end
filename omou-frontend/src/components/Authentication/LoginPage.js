import React, {useEffect, useState} from "react";
import * as authActions from "../../actions/authActions.js";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router";
import PropTypes from "prop-types";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import "./LoginPage.scss";

function LoginPage(props) {
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

    useEffect(() => {
        props.setLogin(true);
        return () => {
            props.setLogin(false);
        };
    });

    if (props.auth.token) {
        props.history.push("/accounts");
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{
                minHeight: "100vh",
            }}>
            <Grid item xs={3}>
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
                            error={props.auth.failedLogin || emailEmpty}
                            label="E-Mail"
                            className="email"
                            margin="dense"
                            value={email}
                            onChange={(event) => {
                                handleTextInput(setEmail, setEmailEmpty, event);
                            }}
                        />
                        <TextField
                            id="standard-password-input"
                            label="Password"
                            className="password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            value={password}
                            error={props.auth.failedLogin || passwordEmpty}
                            onChange={(event) => {
                                handleTextInput(setPassword, setPasswordEmpty, event);
                            }}
                        />
                        <Grid container>
                            <Grid item className="remember">
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
                                <Button color="secondary" className="forgot">
                                    <span className="forgotText">Forgot Password?</span>
                                </Button>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="button signIn"
                            disabled={!email || !password}
                            onClick={login}>
                            sign in
                        </Button>
                    </form>
                    {
                        props.auth.failedLogin &&
                        <Typography color="error">
                            Invalid credentials
                        </Typography>
                    }
                </Paper>
            </Grid>
        </Grid>
    );
}

LoginPage.propTypes = {
    "auth": PropTypes.shape({
        "failedLogin": PropTypes.bool,
        "token": PropTypes.string,
    }),
    "authActions": PropTypes.shape({
        "login": PropTypes.func,
        "resetAttemptStatus": PropTypes.func,
    }),
    "history": PropTypes.shape({
        "push": PropTypes.func,
    }),
    "setLogin": PropTypes.func,
};

const mapStateToProps = ({auth}) => ({auth});

const mapDispatchToProps = (dispatch) => ({
    "authActions": bindActionCreators(authActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(LoginPage));
