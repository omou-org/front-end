import PropTypes from "prop-types";
import React, {useEffect, useMemo, useState} from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/styles";
import "./registration.scss";
import SelectParentDialog from "./SelectParentDialog";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {connect, useDispatch} from "react-redux";
import {stringToColor} from "../Accounts/accountUtils";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import * as searchActions from "../../../actions/searchActions";
import {Tooltip} from "@material-ui/core";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
})

function SetRegistrationActions(props) {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(searchActions, dispatch),
        }),
        [dispatch]
    );
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialog] = useState(false);
    const classes = useStyles();

    const handleClick = () => (e) => {
        e.preventDefault();
        setDialog(true);
    }

    const closeDialog = () => {
        setDialog(false);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    useEffect(()=>{
        let pastRegisteredCourses = JSON.parse(sessionStorage.getItem("registered_courses"));
        let pastParent = JSON.parse(sessionStorage.getItem("CurrentParent"));
        if(pastParent !== "none"){
            if(pastRegisteredCourses === null || pastRegisteredCourses === undefined || pastRegisteredCourses === ""){
                api.initializeRegistration();
            }
        }
    },[]);

    return (
        <Grid item xs={2}>
            {
               props.registration.CurrentParent && props.registration.CurrentParent !== "none" ?
                   <Tooltip title={"Registering Parent"}>
                       <Button className={"button"} onClick={handleClick()}>
                            <div className={"circle-icon"} style={{backgroundColor:stringToColor(props.registration.CurrentParent.user.name)}} />
                            {props.registration.CurrentParent.user.name}
                        </Button>
                   </Tooltip>
                       :
                    <Button className={`button set-parent`} onClick={handleClick()}>
                        <div className={"circle-icon"}/>
                        SET PARENT
                    </Button>
            }
            <SelectParentDialog open={dialogOpen} onClose={closeDialog}/>
        </Grid>
    );
}

SetRegistrationActions.propTypes = {
    courseTitle: PropTypes.string,
    admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SetRegistrationActions);
