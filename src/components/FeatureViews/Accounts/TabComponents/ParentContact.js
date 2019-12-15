import * as hooks from "actions/hooks";
import PropTypes from "prop-types";
import React from "react";
import {useSelector} from "react-redux";


import Grid from "@material-ui/core/Grid";
import ProfileCard from "../ProfileCard";
import "./TabComponents.scss";

const ParentContact = ({parent_id}) => {
    const parentStatus = hooks.useParent(parent_id);
    const parent = useSelector(({Users}) => Users.ParentList[parent_id]);

    if (hooks.isLoading(parentStatus) && !parent) {
        return "Loading parent...";
    }

    if (hooks.isFail(parentStatus) && !parent) {
        return "Error loading parent!";
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
                    md={10}
                    xs={12} >
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
