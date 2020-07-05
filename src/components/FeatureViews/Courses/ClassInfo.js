import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const ClassInfo = ({description}) => {
    return(
        <Grid container>
            <Grid item xs={12}>
        <Typography variant="body2" align="left">{description}</Typography>
                <br />
                <br />
                <br />
                <br />
        <Typography variant="h5" align="left">Course Files</Typography>
            </Grid>
        </Grid>
    )
};

export default ClassInfo;