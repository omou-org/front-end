import PropTypes from "prop-types";
import React, {useState} from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import {NavLink} from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core/styles";
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

function ParentRegistrationActions(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    const courseRoute = props.courseTitle ? encodeURIComponent(props.courseTitle) : "";
    return (
         <Grid container>
             <Grid item xs={2}>
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
             </Grid>
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
                 <MenuItem
                     component={NavLink}
                     to={`/registration/form/small_group/${courseRoute}`}>
                     <NewTutor className="icon innerIcon" />
                     <ListItemText primary="SMALL GROUP" />
                 </MenuItem>
                </StyledMenu>
         </Grid>
    );
}

ParentRegistrationActions.propTypes = {
    courseTitle: PropTypes.string,
    admin: PropTypes.bool,
};

export default ParentRegistrationActions;
