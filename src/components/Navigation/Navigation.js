import React, {useCallback, useState, useEffect} from "react";
import {useSelector} from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import "./Navigation.scss";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import OmouTheme from "../../theme/muiTheme";
import {RootRoutes} from "../Routes/RootRoutes";

import AuthenticatedNav from "../Navigation/AuthenticatedNav";
import {NavList} from "./NavigationAccessList";
import Loading from "../OmouComponents/Loading";
import MomentUtils from "@date-io/moment";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {GoogleLogin, GoogleLogout} from "react-google-login";


const useStyles = makeStyles({
    "navigationIconStyle": {
        "height": "50px",
    },
    "navigationLeftList": {
        "width": "23%",
    },
});

const Navigation = () => {
    const classes = useStyles();
    const { token, email } = useSelector(({ auth }) => auth);

    const ACCOUNT_TYPE = useSelector(({auth}) => auth.accountType);
    const NavigationList = NavList[ACCOUNT_TYPE];

    const [mobileOpen, setMobileOpen] = useState(false);

    const [googleLoginPromptOpen, setGoogleLoginPromptOpen] = useState(false);

    const [status, setStatus] = useState();

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen((open) => !open);
    }, []);

    const handleClose = () => {
        setGoogleLoginPromptOpen(false);
    };

    const responseGoogle = (response) => {
        console.log(response);
    }

    const onSuccess = (response) => {
        setStatus(response);
        console.log("Success");
    };

    useEffect(() => {
        if(email !== null){
            setGoogleLoginPromptOpen(true);
        }
    }, [email]);

	if ((!NavigationList || !ACCOUNT_TYPE) && token) {
        return <Loading/>
    }

    const drawer = (
        <div className="DrawerList">
            <List className="list">
				{NavigationList && NavigationList.map((NavItem) => (
                    <ListItem
                        button
                        className={`listItem ${classes.navigationIconStyle}`}
                        component={NavLinkNoDup}
                        isActive={(match, location) =>
                            match?.isExact || (NavItem.name === "Dashboard" &&
                            location.pathname === "/")
                        }
                        key={NavItem.name}
                        to={NavItem.link}>
                        <ListItemIcon className="icon">
                            {NavItem.icon}
                        </ListItemIcon>
                        <ListItemText className="text" primary={NavItem.name}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );


    return (
        <ThemeProvider theme={OmouTheme}>
            <div className="Navigation">
                {token ?
                    <AuthenticatedNav
                        toggleDrawer={handleDrawerToggle} /> :
                    <div/>}
                {token && (
                    <nav className="OmouDrawer">
                        <Hidden implementation="css" smUp>
                            <Drawer
                                classes={{ "paper": classes.navigationLeftList }}
                                onClose={handleDrawerToggle}
                                open={mobileOpen}
                                variant="temporary">
                                {drawer}
                            </Drawer>
                        </Hidden>
                        <Hidden implementation="css" mdDown>
                            <Drawer open variant="permanent">
                                {drawer}
                            </Drawer>
                        </Hidden>
                    </nav>
                )}
                {token ?
                    <main className="OmouMain">
                        <RootRoutes/>
                    </main>
                    : <MuiPickersUtilsProvider utils={MomentUtils}>
                        <RootRoutes/>
                    </MuiPickersUtilsProvider>}
            </div>

            <div>
                <Dialog
                    open={googleLoginPromptOpen}
                    onClose={handleClose}
                    aria-labelledby="dialog-title"
                    aria-describedby="dialog-description"
                >
                    <DialogTitle id="dialog-title">{"Sign in with Google"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="dialog-description">
                        Allow us to access your Google Classroom courses
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            No
                        </Button>
                        
                        <Button onClick={handleClose} color="primary" autoFocus>
                            <GoogleLogin
                            buttonText="Login"
                            clientId="1059849289788-0tpge112i2bfe5llak523fdopu8foul7.apps.googleusercontent.com"
                            isSignedIn
                            onFailure={responseGoogle}
                            onSuccess={onSuccess}
                            scope = "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters"
                            /> 
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );
};

export default Navigation;
