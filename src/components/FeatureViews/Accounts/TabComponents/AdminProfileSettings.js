import React, {useEffect, useState} from 'react';
import {StyledTableRow} from './NotificationSettings';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { omouBlue } from '../../../../theme/muiTheme';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import Loading from '../../../OmouComponents/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { ResponsiveButton } from '../../../../theme/ThemedComponents/Button/ResponsiveButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';
import * as actions from 'actions/actionTypes';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        marginTop: '10px;',
    },
    settingCol: {
        width: '80%',
    },
});

const ADMIN_GC_ENABLED = gql`
    query AdminGCEnabled($userID: ID!) {
        admin(userId: $userID) {
        googleAuthEnabled
        }
    }
`;

const SET_ADMIN_GC_ENABLED = gql`
    mutation SetAdminGCEnabled($adminType: AdminTypeEnum!, $userID: ID!, $googleAuthEnabled: Boolean!) {
        createAdmin(user: {id: $userID}, adminType: $adminType, googleAuthEnabled: $googleAuthEnabled) {
            admin {
                googleAuthEnabled
            }
        }
    }
`;  

export default function AdminProfileSettings({ user }){
    const { userInfo } = user;
    const classes = useStyles();
    const [googleLoginPromptOpen, setGoogleLoginPromptOpen] = useState(false);
    const [gClassSetting, setGClassSetting] = useState(false);
    const [gClassResp, setGClassResp] = useState();
    const [exitButtonMessage, setExitButtonMessage] = useState('No');
    var triggerState = false;
    var isResponseDefined = false;
    const dispatch = useDispatch();
    const adminGCEnabledResponse = useQuery(
        ADMIN_GC_ENABLED,
        {
            variables: { userID: userInfo.user.id },
        }
    );

    const [
        setAdminGCEnabled,
        setAdminGCEnabledResults,
    ] = useMutation(SET_ADMIN_GC_ENABLED, {
        update: (cache, { data }) => {
            cache.writeQuery({
                data: {
                    admin:
                        data.createAdmin.admin.googleAuthEnabled,
                },
                query: ADMIN_GC_ENABLED,
                variables: { userID: userInfo.user.id},
            });
        },
    });

    const { accountType, email, google_access_token, google_courses } =
        useSelector(({ auth }) => auth) || [];
        

    useEffect(() => {
        if(adminGCEnabledResponse.loading === false){
            setGClassSetting(adminGCEnabledResponse.data.admin.googleAuthEnabled);
        }
    },[adminGCEnabledResponse.loading]);

    function refreshTokenSetup(res) {

        return new Promise((resolve, reject) => { console.log('Refresh Token runs');
            let refreshTiming = 10000;

            const refreshToken = async () => {
                const newAuthRes = await res.reloadAuthResponse();
                console.log('newAuthRes: ', newAuthRes);
                sessionStorage.setItem(
                    'google_access_token',
                    newAuthRes.access_token
                );
                resolve()
                // setTimeout(refreshToken, refreshTiming);
            };
            refreshToken();
            // setTimeout(refreshToken, refreshTiming);
        })
    }

    async function getCourses() {
        console.log(
            'Courses Token: ',
            sessionStorage.getItem('google_access_token')
        );
        if (
            (google_courses === null || google_courses === undefined) && sessionStorage.getItem('google_access_token')
        ) {
            console.log("BEFORE ASYNC");
            try {
                console.log("SESSION");
                console.log(`Bearer ${sessionStorage.getItem(
                    'google_access_token'
                )}`);
                const response = await axios.get(
                        'https://classroom.googleapis.com/v1/courses',
                        {
                            headers: {
                                Authorization: `Bearer ${sessionStorage.getItem(
                                    'google_access_token'
                                )}`,
                            },
                        }
                    );
                console.log('gClassResp at dispatch: ', response);
                console.log("Break!")
                if (google_courses === undefined || google_courses === null){
                    dispatch({
                        type: actions.SET_GOOGLE_COURSES,
                        payload: { google_courses: response?.data.courses },
                    });
                    isResponseDefined=true;
                }
                if (isResponseDefined) {
                    setExitButtonMessage('Exit');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    function handleClose() {
        setGoogleLoginPromptOpen(false);
    }

    const onFailure = (response) => {
        console.log('Login Failed: ', response);
    };

    const onSuccess = (response) => {
        console.log('onSuccess runs');
        console.log('response: ', response);
        console.log('Response.Access: ', response.accessToken);
        refreshTokenSetup(response).then(()=>{getCourses();});
    };

    const handleGClassSettingChange = () => {
        setGoogleLoginPromptOpen(!googleLoginPromptOpen);
        console.log("Before, ", gClassSetting);
        setGClassSetting(!gClassSetting);
        console.log("After, ", !gClassSetting);
        setAdminGCEnabled({variables: {userID: userInfo.user.id, adminType: userInfo.adminType, googleAuthEnabled: !gClassSetting}});
    }

    if (adminGCEnabledResponse.loading)
        return <Loading />;

    return (<><Grid
                container
                style={{
                    backgroundColor: '#F5F5F5',
                    padding: '1%',
                    marginTop: '2%',
                }}
            >
                <Typography style={{ color: omouBlue, fontWeight: 600 }}>
                    Google Classroom Integration
                </Typography>
            </Grid>
            <TableContainer>
                <Table className={classes.table} aria-label='simple table'>
                    <TableBody>
                    <StyledTableRow>
                            <TableCell
                                component='th'
                                scope='row'
                                className={classes.settingCol}
                            >
                                <Typography
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    }}
                                    display='block'
                                >
                                    Google Classroom Integration
                                </Typography>
                                <span>
                                    Enable admins to check the students Google Classroom enrollment invite and status. <br/> 
                                    Enable admins to invite students to a Google Classroom. <br/> 
                                    Enable admins to unenroll a student from a Google Classroom <br/>
                                </span>
                            </TableCell>
                            <TableCell
                                align='center'
                                style={{ width: '28%' }}
                            >
                                <Checkbox
                                    checked={gClassSetting}
                                    onChange={handleGClassSettingChange}
                                    color='primary'
                                    inputProps={{
                                        'aria-label': 'primary checkbox',
                                    }}
                                />
                            </TableCell>
                            <TableCell />
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                        open={googleLoginPromptOpen}
                        onClose={handleClose}
                        aria-labelledby='dialog-title'
                        aria-describedby='dialog-description'
                    >
                        <DialogTitle disableTypography id='dialog-title'>
                            {'Sign in with Google'}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id='dialog-description'>
                                Allow us to access your Google Classroom courses
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <ResponsiveButton
                                onClick={handleClose}
                                color='primary'
                            >
                                {exitButtonMessage}
                            </ResponsiveButton>
                            <GoogleLogin
                                buttonText='Login'
                                clientId='45819877801-3smjria646g9fgb9hrbb14hivbgskiue.apps.googleusercontent.com'
                                isSignedIn= 'True'
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={'single_host_origin'}
                                prompt='consent'
                                scope='https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters '
                            />
                        </DialogActions>
            </Dialog>
            </>)
};
