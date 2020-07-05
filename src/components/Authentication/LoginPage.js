import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useLazyQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PasswordInput from "./PasswordInput";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';

import { makeStyles } from "@material-ui/core/styles";
import { setToken } from "actions/authActions.js";
import useAuthStyles from "./styles.js";
import {ReactComponent as Ellipse1} from "./ellipse/ellipse1.svg";
import {ReactComponent as Ellipse2} from "./ellipse/ellipse2.svg";
import "./LoginPage.scss";

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

const GET_USER_TYPE = gql`
    query GetUserType($username: String!){
        userType(userName: $username)
    }
`

const LoginPage = () => {
    const history = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const token = useSelector(({ auth }) => auth.token);
    const [userType, setUserType] = useState("");
    const [email, setEmail] = useState(state?.email);
    const [password, setPassword] = useState(null);
    const [shouldSave, setShouldSave] = useState(false);
    const [hasError, setHasError] = useState(false);

    const [getUserType, { data, loading }] = useLazyQuery(GET_USER_TYPE, {
        variables: { "username": email },
        onCompleted: data => { setUserType(data.userType) }
    });
    const [login, { loginLoading }] = useMutation(LOGIN, {
        "errorPolicy": "ignore",
        "ignoreResults": true,
        "onCompleted": async ({ tokenAuth }) => {
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

    // useEffect(()=>{
    //     if(!data || loading){
    //         console.log("here")
    //         return(<TextField error={hasError || email === ""} fullWidth
    //         inputProps={{ "data-cy": "emailField" }} label="E-Mail"
    //         margin="normal" onChange={handleTextInput(setEmail)}
    //         value={email} />)
    //     }
    //     else{
    //         console.log("there")
    //         setUserType(data.userType)
    //     }
    // }, [data, loading])

    const classes = {
        ...useStyles(),
        ...useAuthStyles(),
    };

    const handleTextInput = useCallback((setter) => ({ target }) => {
        setter(target.value);
        setHasError(false);
    }, []);

    const handleLogin = useCallback((event) => {
        event.preventDefault();
        login({
            "variables": {
                password,
                "username": email,
            },
        });
    }, [login, email, password]);

    const toggleSavePassword = useCallback(({ target }) => {
        setShouldSave(target.checked);
    }, []);

    const handleCheck = () => {
        getUserType()
    }

    const handlelog = () => {
        console.log(data)
    }

    const renderEmail = () => {
        return (
        <div>

<Ellipse1 className="ellipse1"/>
<Ellipse2 className="ellipse2"/>
            <form className="emailLogin">
                <Grid container>
                    <Grid item md={6}></Grid>
                    <Grid item md={6}>
                    <TextField error={hasError || email === ""} fullWidth
                        inputProps={{ "data-cy": "emailField" }} 
                        margin="normal" 
                        onChange={handleTextInput(setEmail)}
                        value={email} 
                        variant="outlined" 
                        className="TextField"
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlinedIcon style={{color:"grey"}}/>
                              </InputAdornment>
                            ),
                          }}/>
                    <Button>
                        CREATE ACCOUNT
                    </Button>
                    <Button onClick={() => handleCheck()}>
                        SIGN IN
                     </Button>
                     </Grid>
                </Grid>
            </form>
        </div>)
    }
    const renderOther = () => {
        switch (userType) {
            case "Parent":
                return (
                    <Paper className={`${classes.root} ${classes.smallerRoot}`}>
                        <Typography align="center" className={classes.header}
                            color="primary">
                            sign in
                      </Typography>
                        <form onSubmit={handleLogin}>
                            <TextField error={hasError || email === ""} fullWidth
                                inputProps={{ "data-cy": "emailField" }} label="E-Mail"
                                margin="normal" onChange={handleTextInput(setEmail)}
                                value={email} />
                            <PasswordInput autoComplete="current-password"
                                error={hasError || password === ""} fullWidth
                                inputProps={{ "data-cy": "passwordField" }} label="Password"
                                onChange={handleTextInput(setPassword)}
                                value={password} />
                            <Grid alignItems="center" className={classes.options} container
                                justify="space-between">
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox checked={shouldSave}
                                            inputProps={{ "data-cy": "rememberMe" }}
                                            onChange={toggleSavePassword} />}
                                        label="Remember Me" />
                                </Grid>
                                <Grid item>
                                    <Link className={classes.forgot}
                                        data-cy="forgotPassword" to={{
                                            "pathname": "/forgotpassword",
                                            "state": { email },
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
                )
            case "Student":
                return (<div>student</div>)
            case "Admin":
                return (
                    <Paper className={`${classes.root} ${classes.smallerRoot}`}>
                        <Typography align="center" className={classes.header}
                            color="primary">
                            sign in
                </Typography>
                        <form onSubmit={handleLogin}>
                            <TextField error={hasError || email === ""} fullWidth
                                inputProps={{ "data-cy": "emailField" }} label="E-Mail"
                                margin="normal" onChange={handleTextInput(setEmail)}
                                value={email} />
                            <PasswordInput autoComplete="current-password"
                                error={hasError || password === ""} fullWidth
                                inputProps={{ "data-cy": "passwordField" }} label="Password"
                                onChange={handleTextInput(setPassword)}
                                value={password} />
                            <Grid alignItems="center" className={classes.options} container
                                justify="space-between">
                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox checked={shouldSave}
                                            inputProps={{ "data-cy": "rememberMe" }}
                                            onChange={toggleSavePassword} />}
                                        label="Remember Me" />
                                </Grid>
                                <Grid item>
                                    <Link className={classes.forgot}
                                        data-cy="forgotPassword" to={{
                                            "pathname": "/forgotpassword",
                                            "state": { email },
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
                    </Paper>)
        }
    }

    const checkValidEmail = () => {
    }

    const renderLog = () => {
        return (
            userType ? renderOther() : renderEmail()
        );
    }

    // const renderLogin = () => {
    //     switch (userType) {
    //         case "Admin":
    //             return (


    //         case "Parent":
    //             return (
    //                 <div>sdasd</div>
    //             );
    //         default:

    //     }
    // }
    return (
        renderLog()
        // <Paper className={`${classes.root} ${classes.smallerRoot}`}>
        //     <Typography align="center" className={classes.header}
        //         color="primary">
        //         sign in
        // </Typography>
        //     <form onSubmit={handleLogin}>
        //         <TextField error={hasError || email === ""} fullWidth
        //             inputProps={{ "data-cy": "emailField" }} label="E-Mail"
        //             margin="normal" onChange={handleTextInput(setEmail)}
        //             value={email} />
        //         <PasswordInput autoComplete="current-password"
        //             error={hasError || password === ""} fullWidth
        //             inputProps={{ "data-cy": "passwordField" }} label="Password"
        //             onChange={handleTextInput(setPassword)}
        //             value={password} />
        //         <Grid alignItems="center" className={classes.options} container
        //             justify="space-between">
        //             <Grid item>
        //                 <FormControlLabel
        //                     control={<Checkbox checked={shouldSave}
        //                         inputProps={{ "data-cy": "rememberMe" }}
        //                         onChange={toggleSavePassword} />}
        //                     label="Remember Me" />
        //             </Grid>
        //             <Grid item>
        //                 <Link className={classes.forgot}
        //                     data-cy="forgotPassword" to={{
        //                         "pathname": "/forgotpassword",
        //                         "state": { email },
        //                     }}>
        //                     Forgot Password?
        //             </Link>
        //             </Grid>
        //         </Grid>
        //         <Grid alignItems="center" container justify="space-evenly">
        //             <Grid item>
        //                 <Button className={classes.primaryButton}
        //                     color="primary" data-cy="signInButton"
        //                     disabled={!email || !password || loading}
        //                     type="submit" variant="contained">
        //                     sign in
        //             </Button>
        //             </Grid>
        //             <Grid item>
        //                 <Button className={classes.secondaryButton}
        //                     component={Link} to={{
        //                         "pathname": "/newaccount",
        //                         "state": {
        //                             email,
        //                             password,
        //                         },
        //                     }} variant="outlined">
        //                     New Account
        //             </Button>
        //             </Grid>
        //         </Grid>
        //     </form>
        //     {hasError && (
        //         <Typography color="error" data-cy="errorMessage">
        //             Invalid credentials
        //         </Typography>
        //     )}
        // </Paper>
    );

};

export default LoginPage;
