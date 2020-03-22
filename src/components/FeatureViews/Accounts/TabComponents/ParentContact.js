import "./TabComponents.scss";
import * as hooks from "actions/hooks";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import ProfileCard from "../ProfileCard";
import PropTypes from "prop-types";
import React from "react";
import {useSelector} from "react-redux";

const ParentContact = ({parent_id}) => {
    const parentStatus = hooks.useParent(parent_id);
    const parent = useSelector(({Users}) => Users.ParentList[parent_id]);

    if (!parent) {
        if (hooks.isLoading(parentStatus)) {
            return <Loading small loadingText="PARENT LOADING"/>;
        }

        if (hooks.isFail(parentStatus)) {
            return "Error loading parent!";
        }
    }

    return (
        <Grid
            item
            md={12}>
            <Grid
                container
                spacing={2}>
                <Grid
                    item
                    md={12}
                    xs={10}>
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
