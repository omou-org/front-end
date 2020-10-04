import { Grid } from "@material-ui/core";
import React from "react";
import {LabelBadge} from "./LabelBadge";



const BadgeDemo = () => {

    return (
        <Grid container>
            <LabelBadge label="Chemistry" type="information" color="primary"/>
        </Grid>
    )
}

export default BadgeDemo;