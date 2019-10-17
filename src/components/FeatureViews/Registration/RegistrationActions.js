/* eslint-disable react/no-multi-comp */
import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import SearchSelect from "react-select";

// Material UI Imports
import AssignmentIcon from "@material-ui/icons/Assignment";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import NewCourse from "@material-ui/icons/School";
import NewTutor from "@material-ui/icons/Group";
import NewUser from "@material-ui/icons/PersonAdd";
import {withStyles} from "@material-ui/core/styles";

import "./registration.scss";

const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        colour += `00${value.toString(16)}`.substr(-2);
    }

    return colour;
};

const styles = (username) => ({
    "backgroundColor": stringToColor(username),
    "color": "white",
    "fontSize": 15,
    "height": "25px",
    "margin": "auto 10px auto 0",
    "width": "25px",
});

const StyledMenu = withStyles({
    "paper": {
        "border": "1px solid #d3d4d5",
    },
})((props) => (
    <Menu
        anchorOrigin={{
            "horizontal": "center",
            "vertical": "bottom",
        }}
        elevation={0}
        getContentAnchorEl={null}
        transformOrigin={{
            "horizontal": "center",
            "vertical": "top",
        }}
        {...props} />
));

// eslint-disable-next-line max-statements
const RegistrationActions = () => {
    const [registerAnchorEl, setRegisterAnchorEl] = useState(null);
    const [showSelect, setShowSelect] = useState(false);
    const [currentParentID, setCurrentParentID] = useState(null);
    const parents = useSelector((state) => state.Users.ParentList);
    console.log(currentParentID);

    const openParentSelect = useCallback(() => {
        setShowSelect(true);
    }, []);

    const closeParentSelect = useCallback(() => {
        setShowSelect(false);
    }, []);

    const openRegisterMenu = useCallback(({currentTarget}) => {
        setRegisterAnchorEl(currentTarget);
    }, []);

    const closeRegisterMenu = useCallback(() => {
        setRegisterAnchorEl(null);
    }, []);

    const parentOptions = useMemo(
        () => Object.values(parents).map((parent) => ({
            "label": parent.name,
            "value": parent.user_id,
        })),
        [parents]
    );

    const handleParentSelect = ({value}) => {
        setCurrentParentID(value);
    };

    const currentParentOption = currentParentID && {
        "label": parents[currentParentID].name,
        "value": currentParentID,
    };

    const labelStyle = ({label}) => (
        <div style={{"display": "flex"}}>
            <Avatar style={styles(label)}>
                {label.match(/\b(\w)/ug).join("")}
            </Avatar>
            <span style={{"margin": "auto 0"}}>
                {label}
            </span>
        </div>
    );

    // eslint-disable-next-line no-ternary
    const parentButton = currentParentID
        ? (
            <Button
                className="parent-selected"
                // Color="primary"
                onClick={openParentSelect}>
                <Avatar style={styles(parents[currentParentID].name)}>
                    {parents[currentParentID].name.match(/\b(\w)/ug).join("")}
                </Avatar>{
                    parents[currentParentID].name}
            </Button>
        )
        : (
            <Button
                className="button primary parent-select-button"
                // Color="primary"
                onClick={openParentSelect}>
                <Avatar style={{
                    "backgroundColor": "white",
                    "color": "white",
                    "fontSize": 15,
                    "height": "25px",
                    "margin": "auto 10px auto 0",
                    "width": "25px",
                }} />
                Set Parent
            </Button>
        );

    return (
        <Grid
            alignItems="flex-start"
            className="registration-action-control"
            container
            direction="row"
            justify="space-between">
            <Grid item>
                <Button
                    className="button"
                    color="secondary"
                    component={NavLink}
                    to="/registration/form/student"
                    variant="outlined">
                    <NewUser className="icon" />
                    New Student
                </Button>
                <Button
                    className="button"
                    color="secondary"
                    onClick={openRegisterMenu}
                    variant="outlined">
                    <AssignmentIcon className="icon" />
                    Register
                </Button>
                <StyledMenu
                    anchorEl={registerAnchorEl}
                    keepMounted
                    onClose={closeRegisterMenu}
                    open={Boolean(registerAnchorEl)}>
                    <MenuItem
                        component={NavLink}
                        to="/registration/form/course/">
                        <NewCourse className="icon innerIcon" />
                        <ListItemText primary="COURSE" />
                    </MenuItem>
                    <MenuItem
                        component={NavLink}
                        to="/registration/form/tutoring/">
                        <NewTutor className="icon innerIcon" />
                        <ListItemText primary="TUTORING" />
                    </MenuItem>
                </StyledMenu>
            </Grid>
            <Grid item>
                {parentButton}
            </Grid>
            <Modal
                onClick={closeParentSelect}
                open={showSelect}>
                <div
                    className="exit-popup"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}>
                    <SearchSelect
                        className="parent-options"
                        formatOptionLabel={labelStyle}
                        onChange={handleParentSelect}
                        options={parentOptions}
                        placeholder="Select Existing Parent"
                        value={currentParentOption} />
                </div>
            </Modal>
        </Grid>

    );
};

export default RegistrationActions;
