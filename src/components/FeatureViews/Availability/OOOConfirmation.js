import React from "react";
import checkMarkIcon from "components/FeatureViews/Scheduler/icons/bluecheckmark.svg"
import { Typography, Grid, Button } from "@material-ui/core/";
import { omouBlue } from "../../../theme/muiTheme";
import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles((theme) => ({
    messageSent: {
        fontSize: '30px',
        color: "#43B5D9",
        fontWeight: "bold"
    },
    messageContext: {
        fontSize: "16px",

    },
    cancelbutton: {
        backgroundColor: "#FFFFFF"

    },

}));



export default function OOOConfirmation(props) {
    const classes = useStyles(props)

    return (
        <Grid container>

            <Grid item xs={12}>
                <img src={checkMarkIcon} style={{ paddingTop: "2em", paddingBottom: "2em" }} />
            </Grid>
            <Grid item xs={12} alignItems="center">
                <Typography className={classes.messageSent}>Your notice has been sent </Typography>
                <Typography variant="h6">You will recieve a confirmation of your OOO request</Typography>
            </Grid>

            <Grid item xs={12} alignItems="center" style={{ marginTop: "5vh" }}>
                <Button className={classes.cancelbutton} variant="outlined" onClick={props.handleClose}>Close</Button>
            </Grid>
        </Grid>

    )
}





