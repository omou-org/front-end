import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";

import {logout} from "actions/authActions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";

import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import LogoutIcon from "@material-ui/icons/ExitToAppOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
import Search from "components/FeatureViews/Search/Search";
import Typography from "@material-ui/core/Typography";
// Local Component Imports
import Search from "../../components/FeatureViews/Search/Search";
import Avatar from "@material-ui/core/Avatar";
import {stringToColor} from "../FeatureViews/Accounts/accountUtils";
import Tooltip from "@material-ui/core/Tooltip";

const AuthenticatedNav = ({ toggleDrawer }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const authUser = useSelector(({auth}) => auth);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobileSearching, setMobileSearching] = useState(false);

    const handleDrawerToggle = useCallback(() => {
        toggleDrawer(!mobileOpen);
        setMobileOpen((open) => !open);
    }, [mobileOpen, toggleDrawer]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        history.push("/login");
    }, [dispatch, history]);

    const handleMobileSearch = useCallback((searchQuery) => {
        setMobileSearching(searchQuery);
    }, []);

    return (
        <>
            {!isMobileSearching && (
                <>
                    <Hidden lgUp>
                        <IconButton aria-label="Open Drawer" color="inherit"
                            onClick={handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Typography className="title" component={NavLinkNoDup}
                        to="/">
                        omou
                    </Typography>
                    <div style={{"flex": 1}} />
                </>
            )}
            <Search onMobileType={handleMobileSearch} />
			<Tooltip title={`${name}'s Profile`}>
				<Avatar
					className="avatar"
					alt={name}
					style={{
						"backgroundColor": stringToColor(name),
						fontSize: ".9em",
						height: "30px", width: "30px",
						textDecoration: "none"
					}}
					component={NavLinkNoDup}
					to={"/accounts/parent/2"}
				>
					{name.match(/\b\w/ug).join("")}
				</Avatar>
			</Tooltip>
            <Typography className="catsButton" component={NavLinkNoDup}
                to="/cats">
                CATS
            </Typography>
            {!isMobileSearching &&
                <LogoutIcon className="logout-icon" onClick={handleLogout} />}
        </>
    );
};

AuthenticatedNav.propTypes = {
    "toggleDrawer": PropTypes.func.isRequired,
};

export default AuthenticatedNav;
