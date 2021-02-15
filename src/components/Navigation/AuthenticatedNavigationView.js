import React, { useCallback, useState, useEffect } from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import AuthenticatedNavBar from './AuthenticatedNavBar';
import { makeStyles } from '@material-ui/core/styles';
import { AuthenticatedComponent } from './NavigationContainer';
import MomentUtils from '@date-io/moment';
import { RootRoutes } from '../Routes/RootRoutes';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import gql from 'graphql-tag';
import OnboardingRoutes from '../Routes/OnboardingRoutes';
import IdleTimerPrompt from '../OmouComponents/IdleTimerPrompt';
import { useSelector, useDispatch } from 'react-redux';
import { ResponsiveButton } from '../../theme/ThemedComponents/Button/ResponsiveButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import axios from 'axios'; 
import * as actions from 'actions/actionTypes';

const useStyles = makeStyles({
    navigationIconStyle: {
        height: '50px',
    },
    navigationLeftList: {
        width: '23%',
    },
});

const CHECK_BUSINESS_EXISTS = gql`
    query CheckBusiness {
        __typename
        business {
            id
        }
    }
`;

export default function AuthenticatedNavigationView({ UserNavigationOptions }) {
    const classes = useStyles();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [googleLoginPromptOpen, setGoogleLoginPromptOpen] = useState(false);
	const dispatch = useDispatch();
    const [gClassResp, setGClassResp] = useState();
    const { google_courses } = useSelector(({ auth }) => auth);
    const [exitButtonMessage, setExitButtonMessage] = useState('No');

    const { accountType, email, google_access_token } = useSelector(({ auth }) => auth) || [];
    // const { data, loading, error } = useQuery(CHECK_BUSINESS_EXISTS, {
    //     skip: accountType !== 'ADMIN',
    // });

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen((open) => !open);
    }, []);

	useEffect(() => {
        if(email !== null && (google_access_token === null || google_access_token === undefined))
        {
            setGoogleLoginPromptOpen(true);
        }
	}, [email]);

	useEffect(() => {
        // if(sessionStorage.getItem('google_access_token') == null){
        //     sessionStorage.setItem(
        //         'google_access_token',
        //         google_access_token
        //     )
        // }
        setExitButtonMessage('Exit');
		if((gClassResp === null || gClassResp === undefined) && google_access_token){
		  (async () => {
			try {
				setGClassResp( await axios.get('https://classroom.googleapis.com/v1/courses', {
				'headers': {
					'Authorization': `Bearer ${google_access_token}`,
				},
				}));
			}
			catch(error){
				console.log(error)
			}
		  })();
		}
		if(google_courses === undefined || google_courses == null){
			dispatch({
			  type: actions.SET_GOOGLE_COURSES,
			  payload: {google_courses: gClassResp?.data.courses}
			})
        }
	}, [google_access_token]);
	
	const handleClose = () => {
        setGoogleLoginPromptOpen(false);
    }
	
	const onSuccess = (response) => {
        // setGoogle_access_token(response.tokenObj.access_token);
        dispatch({
            type: actions.STORE_COURSES,
            payload: {google_access_token: response.tokenObj.access_token}
        })
	};
    // if (loading) return <Loading />;
    // if (error) return <div>There's been an error! {error.message}</div>;

    const isBusinessDataValid = true;

    return (
        <AuthenticatedComponent>
            {isBusinessDataValid ? (
                <div className='Navigation'>
                    <AuthenticatedNavBar toggleDrawer={handleDrawerToggle} />
                    <nav className='OmouDrawer'>
                        <Hidden implementation='css' smUp>
                            <Drawer
                                classes={{ paper: classes.navigationLeftList }}
                                onClose={handleDrawerToggle}
                                open={mobileOpen}
                                variant='temporary'
                            >
                                {UserNavigationOptions}
                            </Drawer>
                        </Hidden>
                        <Hidden implementation='css' mdDown>
                            <Drawer open variant='permanent'>
                                {UserNavigationOptions}
                            </Drawer>
                        </Hidden>
                    </nav>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <main className='OmouMain'>
                            <RootRoutes />
                        </main>
                    </MuiPickersUtilsProvider>
					<Dialog
					open={googleLoginPromptOpen}
					onClose={handleClose}
					aria-labelledby='dialog-title'
					aria-describedby='dialog-description'
				>
					<DialogTitle disableTypography id='dialog-title'>{'Sign in with Google'}</DialogTitle>
					<DialogContent>
						<DialogContentText id='dialog-description'>
							Allow us to access your Google Classroom courses
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<ResponsiveButton onClick={handleClose} color='primary'>
                            {exitButtonMessage}
						</ResponsiveButton>
						<GoogleLogin
						buttonText='Login'
						clientId='1059849289788-0tpge112i2bfe5llak523fdopu8foul7.apps.googleusercontent.com'
						isSignedIn
						onSuccess={onSuccess}
						scope = 'https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters '
						/> 
					</DialogActions>
				</Dialog>
                </div>
            ) : (
                <OnboardingRoutes />
            )}
            <IdleTimerPrompt />
        </AuthenticatedComponent>
    );
}
