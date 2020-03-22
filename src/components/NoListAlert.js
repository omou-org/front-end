import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const NoListAlert = ({list}) => (
    <Grid
        item
        xs={12}>
        <Grow in>
            <Paper className="info">
                <Typography style={{"fontWeight": 700}}>
                    No {list} Yet!
                </Typography>
            </Paper>
        </Grow>
    </Grid>
);

NoListAlert.propTypes = {
    "list": PropTypes.string.isRequired,
};

export default NoListAlert;
