
import PropTypes from "prop-types";
import React, { useState, useEffect, useMemo } from "react";


// Material UI Imports
import Grid from "@material-ui/core/Grid";

import "./AdminPortal.scss";

import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import { connect, useDispatch } from "react-redux";
import { Button, Typography, withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { NavLink, withRouter } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as searchActions from "../../../actions/searchActions";
import AssignmentIcon from "@material-ui/core/SvgIcon/SvgIcon";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import PinDropIcon from '@material-ui/icons/PinDrop';
import Menu from "@material-ui/core/Menu";
import AddPerson from "@material-ui/icons/PersonAdd";
import EventNoteIcon from '@material-ui/icons/EventNote';


const useStyles = makeStyles(theme => ({
    setParent: {
        backgroundColor: "#1F82A1",
        borderRadius: "10px",
        color: "white",
        paddingRight: "10px",
    },

}));

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

function AdminActionCenter(props) {
    const classes = useStyles();
    const [courseAnchor, setCourseAnchor] = useState(null);
    const [tuitionAnchor, setTuitionAnchor] = useState(null);
    const dispatch = useDispatch();
    let { location } = props;
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    useEffect(() => {
        api.initializeRegistration();
    }, [api]);

    const handleClick = (menu) => (event) => {
        switch (menu) {
            case "course": {
                setCourseAnchor(event.currentTarget);
                break;
            }
            case "tuition": {
                setTuitionAnchor(event.currentTarget);
            }
        }

    }

    const handleClose = (menu) => () => {
        switch (menu) {
            case "course": {
                setCourseAnchor(null);
                break;
            }
            case "tuition": {
                setTuitionAnchor(null);
            }
        }
    }

    useEffect(() => {
        setCourseAnchor(null);
        setTuitionAnchor(null);
    }, [location]);

    return (<Grid container spacing={16} className="registration-buttons">
        <Grid item>
            <Button component={NavLinkNoDup} to={"/registration/form/instructor"}
                // color={"primary"}
                className={classes.setParent}>
                <AddPerson className="icon" />
                Add Instructor
            </Button>
        </Grid>
        <Grid item>
            <Button
                variant="outlined"
                // color="primary"
                className={classes.setParent}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick("course")}>
                <PinDropIcon className="icon" />
                Manage Course
                    </Button>
        </Grid>
        <Grid item>
            <Button
                variant="outlined"
                // color="primary"
                className={classes.setParent}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick("tuition")}>
                <EventNoteIcon className="icon" />
                Manage Tuition
                    </Button>
        </Grid>
        <StyledMenu
            anchorEl={courseAnchor}
            keepMounted
            open={Boolean(courseAnchor)}
            onClose={handleClose("course")}>
            <MenuItem
                component={NavLink}
                to={`/registration/form/course_details`}>
                <ListItemText primary="NEW COURSE" />
            </MenuItem>
            <MenuItem
                component={NavLink}
                to={`/adminportal/manage-course-categories`}>
                {/*<NewTutor className="icon innerIcon" />*/}
                <ListItemText primary="COURSE CATEGORIES" />
            </MenuItem>
        </StyledMenu>
        <StyledMenu
            anchorEl={tuitionAnchor}
            keepMounted
            open={Boolean(tuitionAnchor)}
            onClose={handleClose("tuition")}>
            <MenuItem
                component={NavLink}
                to={`/adminportal/form/pricing`}>
                <ListItemText primary="SET TUITION RULES" />
            </MenuItem>
            <MenuItem
                component={NavLink}
                to={`/adminportal/tuition-rules`}>
                <ListItemText primary="TUITION RULES" />
            </MenuItem>
            <MenuItem
                component={NavLink}
                to={`/adminportal/form/discount`}>
                <ListItemText primary="SET DISCOUNTS" />
            </MenuItem>
            <MenuItem
                component={NavLink}
                to={`/adminportal/manage-discounts`}>
                <ListItemText primary="DISCOUNTS" />
            </MenuItem>
        </StyledMenu>
    </Grid>);
}

AdminActionCenter.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "courseList": state.Course.NewCourseList,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminActionCenter));
