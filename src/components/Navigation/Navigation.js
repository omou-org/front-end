import React, {useCallback, useState} from "react";
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
    const { token } = useSelector(({ auth }) => auth);

    const ACCOUNT_TYPE = useSelector(({auth}) => auth.accountType);
    const NavigationList = NavList[ACCOUNT_TYPE];

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen((open) => !open);
    }, []);

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
        </ThemeProvider>
    );
};

export default Navigation;
