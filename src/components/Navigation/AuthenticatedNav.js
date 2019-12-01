// React Imports
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/authActions";
import {useLocation} from "react-router-dom";
import React, {useCallback, useState} from "react";
import NavLinkNoDup from "../Routes/NavLinkNoDup";

// Material UI Imports
import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";

import LogoutIcon from "@material-ui/icons/ExitToAppOutlined"
import MenuIcon from "@material-ui/icons/Menu";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

// Local Component Imports
import Search from "../../components/FeatureViews/Search/Search";
import {withRouter, NavLink} from "react-router-dom"

const AuthenticatedNav = (props) => {
    // for (let i = 0; i < sessionStorage.length; i++){
    //     console.log(sessionStorage.key(i));
    // }
    const dispatch = useDispatch();
    const authToken = useSelector(({auth}) => auth).token;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobileSearching, setMobileSearching] = useState(false);
    const {pathname} = useLocation();

    const handleDrawerToggle = useCallback((event) => {
        event.preventDefault();
        setMobileOpen((open) => !open);
    }, []);

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const redirectToLogin = () => (e) => {
        e.preventDefault();
        props.history.push("/login");
    };

    const handleSearch = (searchState) =>{
        setMobileSearching(searchState);
    }

    return (<AppBar
                    className="OmouBar"
                    color="default"
                    position="sticky">
            {authToken ?
                <Toolbar>
                    {
                        !isMobileSearching && <>
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
                    <Search onMobile={handleSearch}/>
                    {
                        !isMobileSearching && <LogoutIcon
                            className={"logout-icon"}
                            onClick={handleLogout}/>
                    }
            </Toolbar> :
                redirectToLogin()
            }

                </AppBar>
    );
};

export default withRouter(AuthenticatedNav);
