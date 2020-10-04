import { Grid } from "@material-ui/core";
import React from "react";
import LabelBadge from "./LabelBadge";



const BadgeDemo = () => {

    return (
        <Grid container>
            <LabelBadge label="hello" color="primary"/>
        </Grid>
    )
}

export default BadgeDemo;