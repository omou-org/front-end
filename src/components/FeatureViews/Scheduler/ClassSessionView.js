import PropTypes from "prop-types";
import React, { useState, useEffect, useMemo, } from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import BackArrow from "@material-ui/icons/ArrowBack";
import { makeStyles } from "@material-ui/styles";


import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as userActions from "../../../actions/userActions.js"
import { connect, useDispatch, useSelector } from "react-redux";
import { FormControl, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withRouter } from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as apiActions from "../../../actions/apiActions";
import * as searchActions from "../../../actions/searchActions";
import { GET } from "../../../actions/actionTypes";
import Button from "@material-ui/core/Button";
import Loading from "../../Loading";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import TextField from "@material-ui/core/TextField";
import Prompt from "react-router-dom/es/Prompt";

const useStyles = makeStyles({
    setParent: {
        backgroundColor: "#39A1C2",
        color: "white",
        // padding: "",
    }
})

function ClassSessionView(props) {
    const dispatch = useDispatch();
    const [classData, setClassData] = useState("");
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    useEffect(() => {
        setClassData(props.courseData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(classData)



    return (
        <div>
            Class Session View
        </div>

    );
}
ClassSessionView.propTypes = {
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
    "userActions": bindActionCreators(userActions, dispatch),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ClassSessionView));
