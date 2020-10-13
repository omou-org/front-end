import React, {useState, useCallback} from "react";
import {Redirect, useParams} from "react-router-dom";
import TextField from "@material-ui/core/textfield";
import Container from "@material-ui/core/Container";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Text: {
        marginTop: '65px'
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: "center",
        marginTop: '50px',

    }
}));

const BusinessInfo = () => {
    const classes = useStyles();

    return (
        <Container>
        <Box className={classes.Text}>

                <Typography 
                    variant="h3">Business Information</Typography>
                <Box fontSize="h5.fontSize" className={classes.Subtitle}>
                    <Typography 
                    variant="p"
                    >
                    Please input the following business info, these would show up in payment receipt printouts:

                    </Typography>
                </Box>
            </Box>
        <form style={{width: 500, margin: "auto"}} noValidate autoComplete="off">
  <TextField style={{marginTop: 25 }} fullWidth id="name" label="* Business Name" /> <br />
  <TextField style={{marginTop: 25 }} fullWidth id="phone" label="* Business Phone" /><br />
  <TextField style={{marginTop: 25 }} fullWidth id="email" label="* Business Email" /><br />
  <TextField style={{marginTop: 25 }} fullWidth id="address" label="* Business Address" /><br />
</form>
        </Container>
    )
};

export default BusinessInfo;