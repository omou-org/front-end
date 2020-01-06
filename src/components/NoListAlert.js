import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import React from "react";

export const NoListAlert = ({list}) => (<Grid
    item
    xs={12}>
    <Paper className="info">
        <Typography style={{"fontWeight": 700}}>
            No {list} Yet!
        </Typography>
    </Paper>
</Grid>);