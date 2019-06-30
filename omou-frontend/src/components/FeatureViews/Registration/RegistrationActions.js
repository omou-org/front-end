import PropTypes from "prop-types";
import React, {useState} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import {NavLink} from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core/styles";
import "./registration.scss";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

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

const StyledMenuItem = withStyles((theme) => ({
    root: {
        "&:focus": {
            backgroundColor: theme.palette.primary.main,
            "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

function RegistrationActions(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    const courseRoute = props.courseTitle ? encodeURIComponent(this.props.courseTitle) : "";
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
                <Button
                    variant="outlined"
                    color="secondary"
                    className="button"
                    ria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}>
                    <NewTutor className={"icon"} />
                    Register
                </Button>
                <StyledMenu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    <StyledMenuItem
                        component={NavLink}
                        to={`/registration/form/course/${courseRoute}`}>
                        <ListItemIcon>
                            <NewCourse className="icon" />
                        </ListItemIcon>
                        <ListItemText primary="Course" />
                    </StyledMenuItem>
                    <StyledMenuItem
                        component={NavLink}
                        to={`/registration/form/tutoring/${courseRoute}`}>
                        <ListItemIcon>
                            <NewTutor className="icon" />
                        </ListItemIcon>
                        <ListItemText primary="Tutoring" />
                    </StyledMenuItem>
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
