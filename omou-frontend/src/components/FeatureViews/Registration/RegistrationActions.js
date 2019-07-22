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
import ListItemIcon from "@material-ui/core/ListItemIcon";
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

const StyledMenuItem = MenuItem;

// const StyledMenuItem = withStyles((theme) => ({
//     root: {
//         "&:focus": {
//             backgroundColor: theme.palette.primary.main,
//             "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
//                 color: theme.palette.common.white,
//             },
//         },
//     },
// }))(MenuItem);

function RegistrationActions(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }
    // console.log(props);
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
            <Grid item>
                <Button component={NavLink}
                    to="/registration/form/teacher"
                    variant="outlined"
                    color="secondary"
                    className="button">
                    <NewUser className="icon" />
                    New Teacher
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="outlined"
                    color="secondary"
                    className="button"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}>
                    <AssignmentIcon className="icon" />
                    Register
                </Button>
                <StyledMenu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    <MenuItem
                        component={NavLink}
                        to={`/registration/form/course/${courseRoute}`}>
                        <NewCourse className="icon innerIcon" />
                        <ListItemText primary="COURSE" />
                    </MenuItem>
                    <MenuItem
                        component={NavLink}
                        to={`/registration/form/tutoring/${courseRoute}`}>
                        <NewTutor className="icon innerIcon" />
                        <ListItemText primary="TUTORING" />
                    </MenuItem>
                </StyledMenu>
            </Grid>
        </Grid>
    );
}

RegistrationActions.propTypes = {
    courseTitle: PropTypes.string,
    admin: PropTypes.bool,
};

export default RegistrationActions;
