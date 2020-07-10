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
import InputAdornment from "@material-ui/core/InputAdornment";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";

import { makeStyles } from "@material-ui/core/styles";
import { setToken } from "actions/authActions.js";
import useAuthStyles from "./styles.js";
import { ReactComponent as Ellipse1 } from "./loginImages/ellipse1.svg";
import { ReactComponent as Ellipse2 } from "./loginImages/ellipse2.svg";
import { ReactComponent as Picture1 } from "./loginImages/picture1.svg";
import { ReactComponent as Ellipse3 } from "./loginImages/ellipse3.svg";
import { ReactComponent as Ellipse4 } from "./loginImages/ellipse4.svg";
import { ReactComponent as Picture2 } from "./loginImages/picture2.svg";
import { ReactComponent as Picture3 } from "./loginImages/picture3.svg";
import { ReactComponent as Picture4 } from "./loginImages/picture4.svg";
import ParentLogin from "./UserLogins/ParentLogin.js";
import "./LoginPage.scss";

const useStyles = makeStyles((theme) => ({
    forgot: {
        color: theme.colors.darkGray,
        "text-decoration": "none",
    },
    smallerRoot: {
        [theme.breakpoints.up("sm")]: {
            width: "412px",
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
  query GetUserType($username: String!) {
    userType(userName: $username)
  }
`;

const LoginPage = () => {
    const history = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const token = useSelector(({ auth }) => auth.token);
    const [userType, setUserType] = useState("");
    const [email, setEmail] = useState(state?.email);
    const [realEmail, setRealEmail] = useState("");
    const [password, setPassword] = useState(null);
    const [shouldSave, setShouldSave] = useState(false);
    const [hasError, setHasError] = useState(false);

    const [getUserType, { data, loading }] = useLazyQuery(GET_USER_TYPE, {
        variables: { username: realEmail },
        onCompleted: (data) => {
            setUserType(data.userType);
            if (userType === ""|| email === "") {
                setHasError(true);
            }
        },
    });

    const [login, { loginLoading }] = useMutation(LOGIN, {
        errorPolicy: "ignore",
        ignoreResults: true,
        onCompleted: async ({ tokenAuth }) => {
            dispatch(await setToken(tokenAuth.token, shouldSave));
        },
        // for whatever reason, this function prevents an unhandled rejection
        onError: () => {
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

    const handleTextInput = useCallback(
        (setter) => ({ target }) => {
            setter(target.value);
            setHasError(false);
        },
        []
    );

    const handleLogin = useCallback(
        (event) => {
            event.preventDefault();
            login({
                variables: {
                    password,
                    username: email,
                },
            });
        },
        [login, email, password]
    );

    const toggleSavePassword = useCallback(({ target }) => {
        setShouldSave(target.checked);
    }, []);

    const handleCheck = () => {
        setRealEmail(email);
        getUserType();
    };

    const renderEmailLogin = () => {
        return (
            <>
                <Ellipse1 className="ellipse var1" />
                <Ellipse2 className="ellipse var2" />
                <Picture1 className="picture1" />
                <div className="logo var1">
                    <Typography className="title var1">omou</Typography>
                </div>
                <form className="Login">
                    <Grid container>
                        <Grid item md={6}></Grid>
                        <Grid item md={6}>
                            <Typography className="welcomeText">Welcome to Summit</Typography>
                            <TextField
                                error={hasError || email === ""}
                                fullWidth
                                inputProps={{ "data-cy": "emailField" }}
                                margin="normal"
                                onChange={handleTextInput(setEmail)}
                                value={email}
                                placeholder="E-Mail"
                                variant="outlined"
                                className="TextField"
                                helperText={
                                    hasError
                                        ? "Sorry, we couldn't find a user for that email."
                                        : " "
                                }
                                fullWidth="true"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlinedIcon style={{ color: "grey" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container item className="buttonContainer">
                                <Grid item md={2} />
                                <Grid item md={4}>
                                    <Button
                                        className="createAccountButton"
                                        component={Link}
                                        to={{
                                            pathname: "/new/parent",
                                            state: {
                                                email,
                                                password,
                                            },
                                        }}
                                        variant="outlined"
                                    >
                                        CREATE ACCOUNT
                  </Button>
                                </Grid>
                                <Grid item md={4}>
                                    <Button
                                        className="signInButton"
                                        onClick={() => handleCheck()}
                                    >
                                        SIGN IN
                  </Button>
                                </Grid>
                                <Grid item md={2} />
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </>
        );
    };

    const renderOtherLogins = () => {
        switch (userType) {
            case "Parent":
                return (
                    <ParentLogin 
                    handleTextInput={handleTextInput} 
                    handleLogin={handleLogin}
                    toggleSavePassword={toggleSavePassword}
                    hasError={hasError}
                    email={email}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    password={password}
                    shouldSave={shouldSave}
                    />
                );
            case "Student":
                return <div>student</div>;
            case "Instructor":
                return (
                    <div>
                        <Ellipse3 className="ellipse var3" />
                        <Ellipse4 className="ellipse var4" />
                        <Picture4 className="picture1" />
                        <div className="logo">
                            <Typography className="title var2">omou</Typography>
                        </div>
                        <form className="Login" onSubmit={handleLogin}>
                            <Grid container>
                                <Grid item md={6}></Grid>
                                <Grid item md={6}>
                                    <Typography className="welcomeText">
                                        Hello Summit Instructor
                  </Typography>
                                    <TextField
                                        error={hasError || email === ""}
                                        fullWidth
                                        inputProps={{ "data-cy": "emailField" }}
                                        margin="normal"
                                        onChange={handleTextInput(setEmail)}
                                        value={email}
                                        placeholder="E-Mail"
                                        variant="outlined"
                                        className="TextField"
                                        fullWidth="true"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlinedIcon style={{ color: "grey" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <PasswordInput
                                        autoComplete="current-password"
                                        error={hasError || password === ""}
                                        className="TextField"
                                        inputProps={{ "data-cy": "passwordField" }}
                                        label="Password"
                                        onChange={handleTextInput(setPassword)}
                                        value={password}
                                    />
                                    <Grid container item className="optionsContainer">
                                        <Grid item md={2} />
                                        <Grid item md={4}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={shouldSave}
                                                        inputProps={{ "data-cy": "rememberMe" }}
                                                        onChange={toggleSavePassword}
                                                    />
                                                }
                                                label="Remember Me"
                                            />
                                        </Grid>
                                        <Grid item md={4} style={{ paddingTop: 10 }}>
                                            <Link
                                                className="forgotPassword"
                                                data-cy="forgotPassword"
                                                to={{
                                                    pathname: "/forgotpassword",
                                                    state: { email },
                                                }}
                                            >
                                                Forgot Password?
                      </Link>
                                        </Grid>
                                        <Grid item md={2} />
                                        <Grid item md={4} />
                                        <Grid item md={4} className="buttonSpacing">
                                            <Button
                                                className="signInButton"
                                                data-cy="signInButton"
                                                type="submit"
                                                variant="contained"
                                            >
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
                return (
                    <ParentLogin 
                    handleTextInput={handleTextInput} 
                    handleLogin={handleLogin}
                    toggleSavePassword={toggleSavePassword}
                    hasError={hasError}
                    email={email}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    password={password}
                    shouldSave={shouldSave}
                    />
                );
            default:
                return <div>default case here</div>;
        }
    };


    return userType ? renderOtherLogins() : renderEmailLogin();
};

export default LoginPage;
