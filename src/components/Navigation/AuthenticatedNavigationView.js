import React, { useCallback, useState } from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import AuthenticatedNavBar from './AuthenticatedNavBar';
import { makeStyles } from '@material-ui/core/styles';
import { AuthenticatedComponent } from './NavigationContainer';
import MomentUtils from '@date-io/moment';
import { RootRoutes } from '../Routes/RootRoutes';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loading from '../OmouComponents/Loading';
import OnboardingRoutes from '../Routes/OnboardingRoutes';
import IdleTimerPrompt from '../OmouComponents/IdleTimerPrompt';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {GoogleLogin, GoogleLogout} from "react-google-login";
import axios from "axios"; 
import * as actions from "actions/actionTypes";

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

    const { accountType, email } = useSelector(({ auth }) => auth) || [];
    const { data, loading, error } = useQuery(CHECK_BUSINESS_EXISTS, {
        skip: accountType !== 'ADMIN',
    });

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen((open) => !open);
    }, []);

    if (loading) return <Loading />;
	if (error) return <div>There's been an error! {error.message}</div>;
	
	const handleClose = () => {
        setGoogleLoginPromptOpen(false);
    }

	const responseGoogle = (response) => {
	}
	
	const onSuccess = (response) => {
        dispatch({
            type: actions.SET_GOOGLE_TOKEN, 
            payload: {google_access_token: response.tokenObj.access_token}
        })
        setGoogleLoginPromptOpen(false);
    };

    useEffect(() => {
        if(email !== null){
            setGoogleLoginPromptOpen(true);
        }
    }, [email]);

	return (<AuthenticatedComponent>
		{
			isBusinessDataValid ? <div className="Navigation">
				<AuthenticatedNavBar toggleDrawer={handleDrawerToggle}/>
				<nav className="OmouDrawer">
					<Hidden implementation="css" smUp>
						<Drawer
							classes={{paper: classes.navigationLeftList}}
							onClose={handleDrawerToggle}
							open={mobileOpen}
							variant="temporary"
						>
							{UserNavigationOptions}
						</Drawer>
					</Hidden>
					<Hidden implementation="css" mdDown>
						<Drawer open variant="permanent">
							{UserNavigationOptions}
						</Drawer>
					</Hidden>
				</nav>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<main className="OmouMain">
						<RootRoutes/>
					</main>
				</MuiPickersUtilsProvider>
				<div>
				<Dialog
					open={googleLoginPromptOpen}
					onClose={handleClose}
					aria-labelledby="dialog-title"
					aria-describedby="dialog-description"
				>
					<DialogTitle disableTypography id="dialog-title">{"Sign in with Google"}</DialogTitle>
					<DialogContent>
						<DialogContentText id="dialog-description">
							Allow us to access your Google Classroom courses
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							No
						</Button>
						
						<GoogleLogin
						buttonText="Login"
						clientId="1059849289788-0tpge112i2bfe5llak523fdopu8foul7.apps.googleusercontent.com"
						isSignedIn
						onFailure={responseGoogle}
						onSuccess={onSuccess}
						scope = "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters "
						/> 
					</DialogActions>
				</Dialog>
			</div>
			</div> : <OnboardingRoutes/>
		}
		<IdleTimerPrompt/>
	</AuthenticatedComponent>)
}
