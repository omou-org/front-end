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
import {addDashes} from "../accountUtils";

const ParentContact = (props) => {
    const {parent_id} = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(userActions, dispatch), [dispatch]);

    useEffect(() => {
        api.fetchParents(parent_id);
    }, [api, parent_id]);

    const parent = useSelector(({Users}) => Users.ParentList[parent_id]);
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus.parent[GET][parent_id]);

    const goToParent = useCallback(() => {
        history.push(`/accounts/parent/${parent_id}`);
    }, [history, parent_id]);

    if (!requestStatus || requestStatus === REQUEST_STARTED) {
        return "Loading parent...";
    }

    return (
        <Grid
            item
            md={12}>
            <Grid
                container
                spacing={16}>
                <Grid
                    item
                    md={6}
                    xs={12}>
                    <Paper
                        className="ParentContact"
                        key={parent.user_id}
                        onClick={goToParent}
                        style={{
                            "cursor": "pointer",
                        }}>
                        <div
                            align="left"
                            className="parent-header">
                            <Typography className="header-text">
                                {parent.name}
                            </Typography>
                        </div>
                        <Grid
                            className="bodyText"
                            container
                            spacing={16}>
                            <Grid
                                align="left"
                                className="bold"
                                item
                                xs={5}>
                                Relation
                            </Grid>
                            <Grid
                                align="left"
                                item
                                xs={5}>
                                {parent.relationship}
                            </Grid>
                            <Grid
                                align="left"
                                className="bold"
                                item
                                xs={5}>
                                    Phone
                            </Grid>
                            <Grid
                                align="left"
                                item
                                xs={5}>
                                {addDashes(parent.phone_number)}
                            </Grid>
                            <Grid
                                align="left"
                                className="bold"
                                item
                                xs={5}>
                                    Email
                            </Grid>
                            <Grid
                                align="left"
                                item
                                xs={5}>
                                {parent.email}
                            </Grid>
                        </Grid>
                    </Paper>
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
