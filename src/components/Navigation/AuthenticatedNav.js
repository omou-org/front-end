// React Imports
import React, {useCallback, useState} from "react";
import {Redirect, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/authActions";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
import PropTypes from "prop-types";

// Material UI Imports
import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import LogoutIcon from "@material-ui/icons/ExitToAppOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

// Local Component Imports
import Search from "../../components/FeatureViews/Search/Search";

const AuthenticatedNav = ({toggleDrawer}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const authToken = useSelector(({auth}) => auth.token);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobileSearching, setMobileSearching] = useState(false);

    const handleDrawerToggle = useCallback(() => {
        toggleDrawer(!mobileOpen);
        setMobileOpen((open) => !open);

    }, []);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        history.push("/login");
    }, [dispatch, history]);

    const handleSearch = (searchState) => {
        setMobileSearching(searchState);
    };

    if (!authToken) {
        return (
            <Redirect
                push
                to="/login" />
        );
    }

    return (
        <AppBar
            className="OmouBar"
            color="default"
            position="sticky">
            <Toolbar>
                {
                    !isMobileSearching &&
                    <>
                        <Hidden lgUp>
                            <IconButton
                                aria-label="Open Drawer"
                                color="inherit"
                                onClick={handleDrawerToggle}>
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <Typography
                            className="title"
                            component={NavLinkNoDup}
                            to="/">
                                omou
                        </Typography>
                        <div style={{
                            "flex": 1,
                        }} />
                    </>
                }
                <Search onMobile={handleSearch} />
                {
                    !isMobileSearching && <LogoutIcon
                        className="logout-icon"
                        onClick={handleLogout} />
                }
            </Toolbar>
        </AppBar>
    );
};

AuthenticatedNav.propTypes = {
    "toggleDrawer": PropTypes.func.isRequired,
};

export default AuthenticatedNav;
