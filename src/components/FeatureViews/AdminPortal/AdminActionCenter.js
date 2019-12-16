import PropTypes from "prop-types";
import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";
import "./AdminPortal.scss";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {connect, useDispatch} from "react-redux";
import {Button, Typography, withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {NavLink, withRouter} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as searchActions from "../../../actions/searchActions";
import AssignmentIcon from "@material-ui/core/SvgIcon/SvgIcon";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
});

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
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    let {location} = props;
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    useEffect(()=>{
        api.initializeRegistration();
    },[]);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    useEffect(()=>{
        setAnchorEl(null)
    },[location]);

    return (<Grid container>
                <Grid item xs={2}>
                    <Button component={NavLinkNoDup} to={"/registration/form/instructor"}
                            color={"primary"}
                            className={"button"}>Add Instructor</Button>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="outlined"
                        color="primary"
                        className="button"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}>
                        Manage Courses
                    </Button>
                </Grid>
                <StyledMenu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    <MenuItem
                        component={NavLink}
                        to={`/registration/form/course_details`}>
                        <ListItemText primary="NEW COURSE" />
                    </MenuItem>
                    <MenuItem
                        component={NavLink}
                        to={`/adminportal/manage-tuition`}>
                        <ListItemText primary="TUITION" />
                    </MenuItem>
                    <MenuItem
                        component={NavLink}
                        to={`/adminportal/manage-course-categories`}>
                        {/*<NewTutor className="icon innerIcon" />*/}
                        <ListItemText primary="COURSE CATEGORIES" />
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
