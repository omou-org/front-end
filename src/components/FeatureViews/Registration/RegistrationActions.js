import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";

import AssignmentIcon from "@material-ui/icons/Assignment";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import NewCourse from "@material-ui/icons/School";
import NewTutor from "@material-ui/icons/Group";
import NewUser from "@material-ui/icons/PersonAdd";
import Tooltip from "@material-ui/core/Tooltip";
import {withStyles} from "@material-ui/core/styles";

import "./registration.scss";
import SelectParentDialog from "./SelectParentDialog";
import {stringToColor} from "../Accounts/accountUtils";

const StyledMenu = withStyles({
    "paper": {
        "border": "1px solid #d3d4d5",
    },
})((props) => (
    <Menu anchorOrigin={{"horizontal": "center", "vertical": "bottom"}}
        elevation={0} getContentAnchorEl={null}
        transformOrigin={{"horizontal": "center", "vertical": "top"}}
        {...props} />
));

const RegistrationActions = () => {
    const currentParent =
        useSelector(({Registration}) => Registration.CurrentParent);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialog] = useState(false);

    const openRegisterMenu = useCallback(({currentTarget}) => {
        setAnchorEl(currentTarget);
    }, []);

    const closeRegisterMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const openDialog = useCallback(() => {
        setDialog(true);
    }, []);

    const closeDialog = useCallback(() => {
        setDialog(false);
    }, []);

    return (
        <>
            <Grid className="registration-action-control" container
                direction="row" justify="flex-start">
                <Grid item md={2}>
                    <Button className="button" color="secondary"
                        component={Link} to="/registration/form/student"
                        variant="outlined">
                        <NewUser className="icon" /> New Student
                    </Button>
                </Grid>
                <Grid item md={8}>
                    {currentParent &&
                        <Grid item xs={2}>
                            <Button aria-controls="simple-menu"
                                aria-haspopup="true" className="button"
                                color="secondary" onClick={openRegisterMenu}
                                variant="outlined">
                                <AssignmentIcon className="icon" /> Register
                            </Button>
                        </Grid>}
                </Grid>
                <Grid item xs={2}>
                    {currentParent ?
                        <Tooltip title="Registering Parent">
                            <Button className="button" onClick={openDialog}>
                                <div className="circle-icon"
                                    style={{
                                        "backgroundColor": stringToColor(
                                            currentParent.user.name
                                        ),
                                    }} />
                                {currentParent.user.name}
                            </Button>
                        </Tooltip> :
                        <Button className="button set-parent"
                            onClick={openDialog}>
                            <div className="circle-icon" /> SET PARENT
                        </Button>}
                </Grid>
            </Grid>
            <StyledMenu anchorEl={anchorEl} keepMounted
                onClose={closeRegisterMenu} open={anchorEl !== null}>
                <MenuItem component={Link}
                    to="/registration/form/course/">
                    <NewCourse className="icon innerIcon" />
                    <ListItemText primary="COURSE" />
                </MenuItem>
                <MenuItem component={Link}
                    to="/registration/form/tutoring/">
                    <NewTutor className="icon innerIcon" />
                    <ListItemText primary="TUTORING" />
                </MenuItem>
                <MenuItem component={Link}
                    to="/registration/form/small_group/">
                    <NewTutor className="icon innerIcon" />
                    <ListItemText primary="SMALL GROUP" />
                </MenuItem>
            </StyledMenu>
            <SelectParentDialog onClose={closeDialog} open={dialogOpen} />
        </>
    );
};

export default RegistrationActions;
