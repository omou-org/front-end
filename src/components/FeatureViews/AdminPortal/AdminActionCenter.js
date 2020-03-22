import React, { useEffect, useMemo, useState } from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import "./AdminPortal.scss";

import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import { connect, useDispatch } from "react-redux";
import { Button, withStyles } from "@material-ui/core";
import { NavLink, withRouter } from "react-router-dom";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import NewInstructor from "@material-ui/icons/PersonAdd";
import CourseIcon from "@material-ui/icons/Class";
import TuitionIcon from "@material-ui/icons/AttachMoney";
import DiscountIcon from "@material-ui/icons/LocalActivity";

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
    let { location } = props;

    const [userAnchor, setUserAnchor] = useState(null);
    const [courseAnchor, setCourseAnchor] = useState(null);
    const [tuitionAnchor, setTuitionAnchor] = useState(null);
    const [discountAnchor, setDiscountAnchor] = useState(null);
    const tabState = {
        1: location.pathname.includes("instructor"),
        2: location.pathname.includes("course"),
        3: location.pathname.includes("tuition") || location.pathname.includes("pricing"),
        4: location.pathname.includes("discount"),
        5: location.pathname.includes("user"),
    };

    const dispatch = useDispatch();
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
    }, []);

    const handleClick = (menu) => (event) => {
        switch (menu) {
            case "user": {
                setUserAnchor(event.currentTarget);
                break;
            }
            case "course": {
                setCourseAnchor(event.currentTarget);
                break;
            }
            case "tuition": {
                setTuitionAnchor(event.currentTarget);
                break;
            }
            case "discount": {
                setDiscountAnchor(event.currentTarget);
                break;
            }
        }

    };

    const handleClose = (menu) => () => {
        switch (menu) {
            case "user": {
                setUserAnchor(null);
                break;
            }
            case "course": {
                setCourseAnchor(null);
                break;
            }
            case "tuition": {
                setTuitionAnchor(null);
                break;
            }
            case "discount": {
                setDiscountAnchor(null);
                break;
            }
        }
    };

    useEffect(() => {
        setCourseAnchor(null);
        setTuitionAnchor(null);
    }, [location]);

    return (
        <Grid
            className="admin-actions-wrapper"
            container
            spacing={2}>
            <Grid item>
                <Button
                    className={`button ${tabState[5] ? "active" : ""}`}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick("user")}>
                    <NewInstructor className="admin-action-icon" />
                    Add Users
                    </Button>
            </Grid>
            <Grid item>
                <Button
                    className={`button ${tabState[2] ? "active" : ""}`}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick("course")}>
                    <CourseIcon className="admin-action-icon" />
                    Manage Course
                    </Button>
            </Grid>
            <Grid item>
                <Button
                    className={`button ${tabState[3] ? "active" : ""}`}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick("tuition")}>
                    <TuitionIcon className="admin-action-icon" />
                    Manage Tuition
                    </Button>
            </Grid>
            <Grid item>
                <Button
                    className={`button ${tabState[4] ? "active" : ""}`}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick("discount")}>
                    <DiscountIcon className="admin-action-icon" />
                    Manage Discounts
                    </Button>
            </Grid>
            <StyledMenu
                anchorEl={userAnchor}
                keepMounted
                open={Boolean(userAnchor)}
                onClose={handleClose("user")}>
                <MenuItem
                    component={NavLink}
                    to={`/registration/form/instructor`}>
                    <ListItemText primary="ADD INSTRUCTOR" />
                </MenuItem>
                <MenuItem
                    component={NavLink}
                    to={`/registration/form/admin`}>
                    <ListItemText primary="ADD ADMIN" />
                </MenuItem>
            </StyledMenu>


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
            </StyledMenu>
            <StyledMenu
                anchorEl={discountAnchor}
                keepMounted
                open={Boolean(discountAnchor)}
                onClose={handleClose("discount")}>
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
