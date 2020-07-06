import React, {useCallback, useEffect, useState} from "react";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {useLazyQuery} from "@apollo/react-hooks";
import {useMutation} from "@apollo/react-hooks";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {PasswordInput} from "../Form/Fields";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";

import {makeStyles} from "@material-ui/core/styles";
import {setToken} from "actions/authActions.js";
import useAuthStyles from "./styles.js";
import {ReactComponent as Ellipse1} from "./loginImages/ellipse1.svg";
import {ReactComponent as Ellipse2} from "./loginImages/ellipse2.svg";
import {ReactComponent as Picture1} from "./loginImages/picture1.svg";
import {ReactComponent as Ellipse3} from "./loginImages/ellipse3.svg";
import {ReactComponent as Ellipse4} from "./loginImages/ellipse4.svg";
import {ReactComponent as Picture2} from "./loginImages/picture2.svg";
import {ReactComponent as Picture3} from "./loginImages/picture3.svg";
import {ReactComponent as Picture4} from "./loginImages/picture4.svg";
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
`;

const LoginPage = () => {
    const history = useHistory();
    const {state} = useLocation();
    const dispatch = useDispatch();
    const token = useSelector(({auth}) => auth.token);
    const [userType, setUserType] = useState("");
    const [email, setEmail] = useState(state?.email);
    const [realEmail, setRealEmail] = useState("");
    const [password, setPassword] = useState(null);
    const [shouldSave, setShouldSave] = useState(false);
    const [hasError, setHasError] = useState(false);

    const [getUserType, {data, loading}] = useLazyQuery(GET_USER_TYPE, {
        "variables": {"username": realEmail},
        "onCompleted": (data) => {
            setUserType(data.userType);
        },
    });

    const [login, {loginLoading}] = useMutation(LOGIN, {
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

    const handleLogin = useCallback((event) => {
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

    const handleCheck = () => {
        setRealEmail(email);
        getUserType();
    };

    const renderEmailLogin = () => (
        <div>
            <Ellipse1 className="ellipse1" />
            <Ellipse2 className="ellipse2" />
            <Picture1 className="picture1" />
            <div className="logo">
                <Typography className="title">
                    omou
                </Typography>
            </div>
            <form className="Login">
                <Grid container>
                    <Grid item md={6} />
                    <Grid item md={6}>
                        <Typography className="welcomeText">
                            Welcome to Summit
                        </Typography>
                        <TextField InputProps={{
                            "startAdornment": (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon style={{"color": "grey"}} />
                                </InputAdornment>
                            ),
                        }} className="TextField"
                            error={hasError || email === ""}
                            fullWidth
                            fullWidth="true"
                            inputProps={{"data-cy": "emailField"}}
                            margin="normal"
                            onChange={handleTextInput(setEmail)}
                            placeholder="E-Mail"
                            value={email}
                            variant="outlined" />
                        <Grid className="buttonContainer" container item>
                            <Grid item md={2} />
                            <Grid item md={4}>
                                <Button className="createAccountButton" component={Link} to="/new">
                                    CREATE ACCOUNT
                                </Button>
                            </Grid>
                            <Grid item md={4}>
                                <Button className="signInButton" onClick={() => handleCheck()}>
                                    SIGN IN
                                </Button>
                            </Grid>
                            <Grid item md={2} />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </div>);

    const renderOtherLogins = () => {
        switch (userType) {
            case "Parent":
                return (
                    <div>
                        <Ellipse3 className="ellipse3" />
                        <Ellipse4 className="ellipse4" />
                        <Picture2 className="picture1" />
                        <div className="logo2">
                            <Typography className="title">
                                omou
                            </Typography>
                        </div>
                        <form className="Login" onSubmit={handleLogin}>
                            <Grid container>
                                <Grid item md={6} />
                                <Grid item md={6}>
                                    <Typography className="welcomeText">
                                        Hello Summit Parent
                                    </Typography>
                                    <TextField InputProps={{
                                        "startAdornment": (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon style={{"color": "grey"}} />
                                            </InputAdornment>
                                        ),
                                    }} className="TextField"
                                    error={hasError || email === ""}
                                    fullWidth
                                    fullWidth="true"
                                    inputProps={{"data-cy": "emailField"}}
                                    margin="normal"
                                    onChange={handleTextInput(setEmail)}
                                    placeholder="E-Mail"
                                    value={email}
                                    variant="outlined" />
                                    <PasswordInput autoComplete="current-password" className="TextField"
                                        error={hasError || password === ""}
                                        inputProps={{"data-cy": "passwordField"}}
                                        isField={false} label="Password"
                                        onChange={handleTextInput(setPassword)}
                                        value={password} />
                                    <Grid className="optionsContainer" container item>
                                        <Grid item md={2} />
                                        <Grid item md={4}>
                                            <FormControlLabel
                                                control={<Checkbox checked={shouldSave}
                                                    inputProps={{"data-cy": "rememberMe"}}
                                                    onChange={toggleSavePassword} />}
                                                label="Remember Me" />
                                        </Grid>
                                        <Grid item md={4} style={{"paddingTop": 10}}>
                                            <Link className="forgotPassword"
                                                data-cy="forgotPassword" to={{
                                                    "pathname": "/forgotpassword",
                                                    "state": {email},
                                                }}>
                                                Forgot Password?
                                            </Link>
                                        </Grid>
                                        <Grid item md={2} />
                                        <Grid item md={4} />
                                        <Grid className="buttonSpacing" item md={4}>
                                            <Button className="signInButton"
                                                data-cy="signInButton"
                                                type="submit" variant="contained">
                                                SIGN IN
                                            </Button>
                                        </Grid>
                                        <Grid item md={4} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                );
            case "Student":
                return <div>student</div>;
            case "Instructor":
                return (
                    <div>
                        <Ellipse3 className="ellipse3" />
                        <Ellipse4 className="ellipse4" />
                        <Picture4 className="picture1" />
                        <div className="logo2">
                            <Typography className="title">
                                omou
                            </Typography>
                        </div>
                        <form className="Login" onSubmit={handleLogin}>
                            <Grid container>
                                <Grid item md={6} />
                                <Grid item md={6}>
                                    <Typography className="welcomeText">
                                        Hello Summit Instructor
                                    </Typography>
                                    <TextField InputProps={{
                                        "startAdornment": (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon style={{"color": "grey"}} />
                                            </InputAdornment>
                                        ),
                                    }} className="TextField"
                                    error={hasError || email === ""}
                                    fullWidth
                                    fullWidth="true"
                                    inputProps={{"data-cy": "emailField"}}
                                    margin="normal"
                                    onChange={handleTextInput(setEmail)}
                                    placeholder="E-Mail"
                                    value={email}
                                    variant="outlined" />
                                    <PasswordInput autoComplete="current-password" className="TextField"
                                        error={hasError || password === ""}
                                        inputProps={{"data-cy": "passwordField"}}
                                        isField={false} label="Password"
                                        onChange={handleTextInput(setPassword)}
                                        value={password} />
                                    <Grid className="optionsContainer" container item>
                                        <Grid item md={2} />
                                        <Grid item md={4}>
                                            <FormControlLabel
                                                control={<Checkbox checked={shouldSave}
                                                    inputProps={{"data-cy": "rememberMe"}}
                                                    onChange={toggleSavePassword} />}
                                                label="Remember Me" />
                                        </Grid>
                                        <Grid item md={4} style={{"paddingTop": 10}}>
                                            <Link className="forgotPassword"
                                                data-cy="forgotPassword" to={{
                                                    "pathname": "/forgotpassword",
                                                    "state": {email},
                                                }}>
                                                Forgot Password?
                                            </Link>
                                        </Grid>
                                        <Grid item md={2} />
                                        <Grid item md={4} />
                                        <Grid className="buttonSpacing" item md={4}>
                                            <Button className="signInButton"
                                                data-cy="signInButton"
                                                type="submit" variant="contained">
                                                SIGN IN
                                            </Button>
                                        </Grid>
                                        <Grid item md={4} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                );

            case "Admin":
                return (<div>
                    <Ellipse3 className="ellipse3" />
                    <Ellipse4 className="ellipse4" />
                    <Picture3 className="picture1" />
                    <div className="logo2">
                        <Typography className="title">
                            omou
                        </Typography>
                    </div>
                    <form className="Login" onSubmit={handleLogin}>
                        <Grid container>
                            <Grid item md={6} />
                            <Grid item md={6}>
                                <Typography className="welcomeText">
                                    Hello Summit Admin
                                </Typography>
                                <TextField InputProps={{
                                    "startAdornment": (
                                        <InputAdornment position="start">
                                            <EmailOutlinedIcon style={{"color": "grey"}} />
                                        </InputAdornment>
                                    ),
                                }} className="TextField"
                                error={hasError || email === ""}
                                fullWidth
                                fullWidth="true"
                                inputProps={{"data-cy": "emailField"}}
                                margin="normal"
                                onChange={handleTextInput(setEmail)}
                                placeholder="E-Mail"
                                value={email}
                                variant="outlined" />
                                <PasswordInput autoComplete="current-password" className="TextField"
                                    error={hasError || password === ""}
                                    inputProps={{"data-cy": "passwordField"}}
                                    isField={false} label="Password"
                                    onChange={handleTextInput(setPassword)}
                                    value={password} />
                                <Grid className="optionsContainer" container item>
                                    <Grid item md={2} />
                                    <Grid item md={4}>
                                        <FormControlLabel
                                            control={<Checkbox checked={shouldSave}
                                                inputProps={{"data-cy": "rememberMe"}}
                                                onChange={toggleSavePassword} />}
                                            label="Remember Me" />
                                    </Grid>
                                    <Grid item md={4} style={{"paddingTop": 10}}>
                                        <Link className="forgotPassword"
                                            data-cy="forgotPassword" to={{
                                                "pathname": "/forgotpassword",
                                                "state": {email},
                                            }}>
                                            Forgot Password?
                                        </Link>
                                    </Grid>
                                    <Grid item md={2} />
                                    <Grid item md={4} />
                                    <Grid className="buttonSpacing" item md={4}>
                                        <Button className="signInButton"
                                            data-cy="signInButton"
                                            type="submit" variant="contained">
                                            SIGN IN
                                        </Button>
                                    </Grid>
                                    <Grid item md={4} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </div>);
            default:
                return <div>default case here</div>;
        }
    };

    const renderLogin = () => (
        userType ? renderOtherLogins() : renderEmailLogin()
    );

    return (
        renderLogin()
    );
};

export default LoginPage;
