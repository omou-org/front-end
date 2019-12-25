// React Imports
import React, {useCallback, useState, useEffect} from "react";
import {Redirect, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/authActions";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
import PropTypes from "prop-types";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

// Local Component Imports


const PriceQuoteForm = ({courses, tutoring, students}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(()=>{
        console.log(courses, tutoring, students)
    },[courses, tutoring, students]);

    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <Grid container>

        </Grid>
    );
};

PriceQuoteForm.propTypes = {
    "courses": PropTypes.array.isRequired,
    "tutoring": PropTypes.array.isRequired,
    "students": PropTypes.array.isRequired,
};

export default PriceQuoteForm;