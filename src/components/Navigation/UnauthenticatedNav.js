// React Imports
import React from "react";

// Material UI Imports
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

// Local Component Imports
import NavLinkNoDup from "../Routes/NavLinkNoDup";

const AuthenticatedNav = () => (
    <AppBar
        className="OmouBar"
        color="initial"
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

export default AuthenticatedNav;
