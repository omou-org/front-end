import React, {useCallback, useState} from "react";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import AuthenticatedNavBar from "./AuthenticatedNavBar";
import {makeStyles} from "@material-ui/core/styles";
import {AuthenticatedComponent} from "./NavigationContainer";
import MomentUtils from "@date-io/moment";
import {RootRoutes} from "../Routes/RootRoutes";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Loading from "../OmouComponents/Loading";
import OnboardingRoutes from "../Routes/OnboardingRoutes";
import {useIdleTimer} from 'react-idle-timer';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import {ResponsiveButton} from "../../theme/ThemedComponents/Button/ResponsiveButton";
import {closeRegistrationCart} from "../OmouComponents/RegistrationUtils";
import {logout} from "../../actions/authActions";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";

const {useEffect} = require("react");

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
`

export default function AuthenticatedNavigationView({UserNavigationOptions}) {
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [openIdlePrompt, setIdlePrompt] = useState(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const {data, loading, error} = useQuery(CHECK_BUSINESS_EXISTS);

	const handleDrawerToggle = useCallback(() => {
		setMobileOpen((open) => !open);
	}, []);

	const handleOnIdle = event => {
		setIdlePrompt(true);
	}

	const handleLogout = useCallback(() => {
		closeRegistrationCart();
		dispatch(logout());
		history.push("/login");
	}, [dispatch, history]);

	useEffect(() => {
		if (openIdlePrompt) {
			setInterval(() => {
				setIdlePrompt(false);
				handleLogout();
			}, 1000 * 60 * 2)
		}
	}, [openIdlePrompt])

	useIdleTimer({
		timeout: 1000 * 60 * 18,
		onIdle: handleOnIdle,
		debounce: 500
	});

	if (loading) return <Loading/>
	if (error) return <div>There's been an error! {error.message}</div>

	const isBusinessDataValid = true;
	// data.business;

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
			</div> : <OnboardingRoutes/>
		}
		<Dialog open={openIdlePrompt}>
			<DialogTitle disableTypography>
				<Typography variant="h4">
					Are you still there?
				</Typography>
			</DialogTitle>
			<DialogContent>
				Looks like you've been idle for a while. To make sure no one will use your account behind your back, you
				will be logged out automatically within 2 minutes.
			</DialogContent>
			<DialogActions>
				<ResponsiveButton
					onClick={() => setIdlePrompt(false)}
					color="primary"
					variant="contained"
				>
					Yes
				</ResponsiveButton>
			</DialogActions>
		</Dialog>
	</AuthenticatedComponent>)
}