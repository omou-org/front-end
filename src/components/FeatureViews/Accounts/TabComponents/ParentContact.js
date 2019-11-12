import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import React, {useCallback, useEffect, useMemo} from "react";
import {useHistory} from "react-router-dom";
import {GET} from "../../../../actions/actionTypes";
import {REQUEST_STARTED} from "../../../../actions/apiActions";
import * as userActions from "../../../../actions/userActions";


import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "./TabComponents.scss";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/EditOutlined";
import ProfileCard from "../ProfileCard";
import {addDashes} from "../accountUtils";

const ParentContact = (props) => {
    const {parent_id} = props;
    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(userActions, dispatch), [dispatch]);

    useEffect(() => {
        api.fetchParents(parent_id);
    }, [api, parent_id]);

    const parent = useSelector(({Users}) => Users.ParentList[parent_id]);
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus.parent[GET][parent_id]);

    if (!requestStatus || requestStatus === REQUEST_STARTED) {
        return "Loading parent...";
    }

    return (
        <Grid item md={12}>
            <Grid container spacing={16}>
                <Grid item md={10} xs={12} >
                    <ProfileCard
                        route={`/accounts/parent/${parent_id}`}
                        user={parent} />
                </Grid>
            </Grid>
        </Grid>
    );
};

ParentContact.propTypes = {
    "parent_id": PropTypes.oneOf([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default ParentContact;
