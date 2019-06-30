import React, {useEffect} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import Checkbox from "@material-ui/core/Checkbox";
import "./LoginPage.css";

function LoginPage(props) {
    useEffect(() => {
        props.setLogin(true);
        return () => {
            props.setLogin(false);
        };
    });

    function handleSubmit() {
        console.log("Submitted!");
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
                        align="left"
                        color="primary">
                        <span className="header">sign in</span>
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="E-Mail"
                            className="email"
                            margin="dense"
                        />
                        <TextField
                            id="standard-password-input"
                            label="Password"
                            className="password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                        />
                        <Grid container>
                            <Grid item className="remember">
                                <label>
                                    <Checkbox />
                                    Remember me
                                </label>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" className="forgot">
                                    <span className="forgotText">Forgot Password?</span>
                                </Button>
                            </Grid>
                        </Grid>
                        <Button variant="contained" color="primary" className="button signIn" onClick={handleSubmit}>
                            <span className="signInText">sign in</span>
                        </Button>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default LoginPage;
