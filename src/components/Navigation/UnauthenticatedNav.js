// React Imports
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/authActions";
import {useLocation} from "react-router-dom";
import React, {useCallback, useState} from "react";
import NavLinkNoDup from "../Routes/NavLinkNoDup";

// Material UI Imports
import AppBar from "@material-ui/core/AppBar";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

// Local Component Imports

const AuthenticatedNav = () => {
    // for (let i = 0; i < sessionStorage.length; i++){
    //     console.log(sessionStorage.key(i));
    // }
    const dispatch = useDispatch();
    const authToken = useSelector(({auth}) => auth).token;

    const [mobileOpen, setMobileOpen] = useState(false);
    const {pathname} = useLocation();

    const handleDrawerToggle = useCallback((event) => {
        event.preventDefault();
        setMobileOpen((open) => !open);
    }, []);

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    return (
        <AppBar
            className="OmouBar"
            color="default"
            position="sticky">
            <Toolbar>
                <Typography
                    className="title"
                    component={NavLinkNoDup}
                    to="/">
                    omou
                </Typography>

            </Toolbar>
        </AppBar>
    );
};

export default AuthenticatedNav;
