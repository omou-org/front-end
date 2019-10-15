import PropTypes from "prop-types";
import React, { useState } from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import { NavLink } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import "./registration.scss";
import ListItemText from "@material-ui/core/ListItemText";
import AssignmentIcon from "@material-ui/icons/Assignment";

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5",
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

function RegistrationActions(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    const courseRoute = props.courseTitle ? encodeURIComponent(props.courseTitle) : "";
    return (
        <Grid container
            direction="row"
            justify="flex-start"
            className="registration-action-control">
            <Grid item>
                <Button component={NavLink} to="/registration/form/student"
                    variant="outlined"
                    color="secondary"
                    className="button">
                    <NewUser className="icon" />
                    New Student
                </Button>
            </Grid>
        </Grid>
    );
}

RegistrationActions.propTypes = {
    courseTitle: PropTypes.string,
    admin: PropTypes.bool,
};

export default RegistrationActions;
