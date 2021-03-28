import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/client';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { PasswordInput } from '../Form/FieldComponents/Fields';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import GoogleLoginButton from '../OmouComponents/GoogleLoginButton.js';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';
import * as actions from 'actions/actionTypes';

import { ResponsiveButton } from '../../theme/ThemedComponents/Button/ResponsiveButton';
import { setToken } from 'actions/authActions.js';
import { ReactComponent as Ellipse1 } from './loginImages/ellipse1.svg';
import { ReactComponent as Ellipse2 } from './loginImages/ellipse2.svg';
import { ReactComponent as Picture1 } from './loginImages/picture1.svg';
import { ReactComponent as Ellipse3 } from './loginImages/ellipse3.svg';
import { ReactComponent as Ellipse4 } from './loginImages/ellipse4.svg';
import { ReactComponent as Picture2 } from './loginImages/picture2.svg';
import { ReactComponent as Picture3 } from './loginImages/picture3.svg';
import { ReactComponent as Picture4 } from './loginImages/picture4.svg';
import './LoginPage.scss';
import { LocalConvenienceStoreOutlined } from '@material-ui/icons';

const LOGIN = gql`
    mutation Login($password: String!, $username: String!) {
        tokenAuth(password: $password, username: $username) {
            token
            payload
        }
    }
`;

const GOOGLE_LOGIN = gql`
    mutation GoogleLogin($accessToken: String!) {
        __typename
        socialAuth(accessToken: $accessToken, provider: "google-oauth2") {
            token
            social {
                created
                id
                extraData
                uid
                provider
                modified
            }
        }
    }
  `

const GET_USER_TYPE = gql`
    query GetUserType($username: String!) {
        userType(userName: $username) {
        userType
        googleAuthEnabled
        }
    }
`;

const LoginPage = () => {
    const history = useHistory();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { token, attemptedLogin } = useSelector(({ auth }) => auth);
    const [userType, setUserType] = useState('');
    const [googleAuthEnabled, setGoogleAuthEnabled] = useState(false);
    const [email, setEmail] = useState(state?.email);
    const [password, setPassword] = useState(null);
    const [shouldSave, setShouldSave] = useState(false);
    const [hasError, setHasError] = useState(false);

    const [getUserType] = useLazyQuery(GET_USER_TYPE, {
        variables: { username: email },
        onCompleted: (data) => {
            console.log(data)
            setUserType(data?.userType?.userType);
            // setGoogleAuthEnabled(data.userType.googleAuthEnabled);
            if (userType === null) {
                setHasError(true);
            }
        },
    });

    const [login] = useMutation(LOGIN, {
        errorPolicy: 'ignore',
        ignoreResults: true,
        onCompleted: async ({ tokenAuth }) => {
            dispatch(await setToken(tokenAuth.token, shouldSave));
        },
        // for whatever reason, this function prevents an unhandled rejection
        onError: () => {
            setHasError(true);
        },
    });

    // const [googleLogin] = useMutation(GOOGLE_LOGIN, {
    //     errorPolicy: 'ignore',
    //     ignoreResults: true,
    //     onCompleted: async ({ socialAuth }) => {
    //         dispatch(await setToken(socialAuth.token, shouldSave));
    //     },
    //     // for whatever reason, this function prevents an unhandled rejection
    //     onError: () => {
    //         setHasError(true);
    //     },
    // });

    // must wait for token to update in redux before redirecting
    // otherwise ProtectedRoute's check will trigger and redirect us back here
    useEffect(() => {
        if (token) {
            if (history.length > 2) {
                history.goBack();
            } else {
                history.push('/');
            }
        }
    }, [token, history]);

    const handleTextInput = useCallback(
        (setter) => ({ target }) => {
            setter(target.value);
            setHasError(false);
        },
        []
    );

    const handleLogin = useCallback(
        async (event) => {
            event.preventDefault();
            const loginResponse = await login({
                variables: {
                    password,
                    username: email,
                },
            });
            if (loginResponse?.data?.tokenAuth) {
                history.push('/');
                console.log("Login response")
            }
        },
        [login, email, password]
    );

    const toggleSavePassword = useCallback(({ target }) => {
        setShouldSave(target.checked);
    }, []);

    const handleCheck = () => {
        if (email !== '') {
            getUserType();
        }
    };
    
    // const onSuccess = async (response) => {
    //     const socialAuthResponse = await googleLogin({
    //         variables: {
    //             accessToken: response.accessToken,
    //         },
    //     })
    //     console.log(socialAuthResponse)
    //     history.push('/');
    //     if (socialAuthResponse?.data?.socialAuth) {
    //         console.log("Success!")
    //     }
    // }

    // const onFailure = (response) => {
        
    // }

    const renderEmailLogin = () => (
        <>
            <Ellipse1 className='picture var1' />
            <Ellipse2 className='picture var2' />
            <Picture1 className='picture var4' />
            <div className='logo var2'>
                <Typography
                    className='title'
                    variant='h1'
                    style={{ color: 'white' }}
                >
                    omou
                </Typography>
            </div>
            <form
                className='Login'
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCheck();
                }}
            >
                <Grid container>
                    <Grid item md={6} />
                    <Grid item md={6}>
                        <Typography className='welcomeText'>
                            Welcome to Summit
                        </Typography>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <EmailOutlinedIcon
                                            style={{ color: 'grey' }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            className='TextField'
                            error={hasError || email === ''}
                            fullWidth
                            helperText={
                                hasError
                                    ? "Sorry, we couldn't find a user for that email."
                                    : ' '
                            }
                            inputProps={{ 'data-cy': 'emailField' }}
                            margin='normal'
                            onChange={handleTextInput(setEmail)}
                            data-cy='emailField-input'
                            placeholder='E-Mail'
                            value={email}
                            variant='outlined'
                        />
                        <Grid className='buttonContainer' container item>
                            <Grid item md={2} />
                            <Grid item md={4}>
                                <ResponsiveButton
                                    component={Link}
                                    data-cy='createAccountButton'
                                    to={{
                                        pathname: '/new/parent',
                                        state: {
                                            email,
                                            password,
                                        },
                                    }}
                                    variant='contained'
                                >
                                    CREATE ACCOUNT
                                </ResponsiveButton>
                            </Grid>
                            <Grid item md={4}>
                                <ResponsiveButton
                                    data-cy='signInButton'
                                    onClick={handleCheck}
                                    variant='outlined'
                                >
                                    SIGN IN
                                </ResponsiveButton>
                            </Grid>
                            <Grid item md={2} />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </>
    );

    const renderUserDifferences = () => {
        switch (userType) {
            case 'Parent':
                return {
                    picture: <Picture2 className='picture var4' />,
                    text: 'Hello Summit Parent',
                };
            case 'Instructor':
                return {
                    picture: <Picture4 className='picture var4' />,
                    text: 'Hello Summit Instructor',
                };
            case 'Admin':
                return {
                    picture: <Picture3 className='picture var4' />,
                    text: 'Hello Summit Admin',
                };
            default:
                return {
                    picture: <Picture1 className='picture var4' />,
                    text: 'Hello User',
                };
        }
    };

    const renderOtherLogins = () => (
        <>
            <Ellipse3 className='picture var3' />
            <Ellipse4 className='picture var4' />
            {renderUserDifferences().picture}
            <div className='logo var2'>
                <Typography
                    className='title'
                    variant='h1'
                    style={{ color: 'white' }}
                >
                    omou
                </Typography>
            </div>
            <form className='Login' onSubmit={handleLogin}>
                <Grid container>
                    <Grid item md={6} />
                    <Grid item md={6}>
                        <Typography className='welcomeText'>
                            {renderUserDifferences().text}
                        </Typography>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <EmailOutlinedIcon
                                            style={{ color: 'grey' }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            className='TextField'
                            error={hasError}
                            fullWidth
                            inputProps={{ 'data-cy': 'emailField' }}
                            margin='normal'
                            onChange={handleTextInput(setEmail)}
                            placeholder='E-Mail'
                            value={email}
                            variant='outlined'
                        />
                        <PasswordInput
                            autoComplete='current-password'
                            error={hasError || password === ''}
                            inputProps={{ 'data-cy': 'passwordField' }}
                            isField={false}
                            label='Password'
                            className='TextField'
                            variant='outlined'
                            onChange={handleTextInput(setPassword)}
                            value={password}
                        />
                        <Grid className='optionsContainer' container item>
                            <Grid item md={2} />
                            <Grid item md={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={shouldSave}
                                            inputProps={{
                                                'data-cy': 'rememberMe',
                                            }}
                                            onChange={toggleSavePassword}
                                        />
                                    }
                                    label='Remember Me'
                                />
                            </Grid>
                            <Grid item md={4} style={{ paddingTop: 10 }}>
                                <Link
                                    className='forgotPassword'
                                    data-cy='forgotPassword'
                                    to={{
                                        pathname: '/forgotpassword',
                                        state: { email },
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Grid>
                            <Grid item md={2} />
                            <Grid item md={4} />
                            <Grid className='buttonSpacing' item md={4}>
                                <ResponsiveButton
                                    data-cy='signInButton'
                                    type='submit'
                                    variant='contained'
                                >
                                    SIGN IN
                                </ResponsiveButton>
                            </Grid>
                            {/* <Grid className='buttonSpacing' item md={4}>
                                <GoogleLogin
                                    render={renderProps => (
                                        <GoogleLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled}/>
                                      )}
                                    buttonText='Login'
                                    clientId='45819877801-3smjria646g9fgb9hrbb14hivbgskiue.apps.googleusercontent.com'
                                    onSuccess={onSuccess}
                                    onFailure={onFailure}
                                    cookiePolicy={'single_host_origin'}
                                    scope='https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters '
                                />
                            </Grid> */}
                            <Grid item md={4} />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </>
    );

    return userType ? renderOtherLogins() : renderEmailLogin();
};

export default LoginPage;
