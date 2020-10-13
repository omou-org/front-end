/* eslint-disable no-unused-vars */
import React from "react";
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from "@material-ui/core/Typography";
import { spacing } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
const Button = styled(MuiButton)(spacing);

const useStyles = makeStyles((theme) => ({
    Text: {
        marginTop: '65px'
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: "center",
        marginTop: '65px',

    }
}));

const Welcome = () => {
    const classes = useStyles();
        //className={(classes.Class1, classes.Class2)}

    return (
        <Container>
            <Box className={classes.Text}>

                <Typography 
                    variant="h3">Welcome to Omou</Typography>
                <Box fontSize="h5.fontSize" className={classes.Subtitle}>
                    <Typography 
                    variant="p"
                    >
                        Let's import your data so you can start using Omou!
                    </Typography>
                </Box>
            </Box>
            <Box mt={20}>
                <Button px={8} size="large" variant="outlined" color="primary">Skip for now</Button>
                <Button px={8} size="large" ml={5} variant="contained" color="primary" href="/onboarding/import">Let's do it!</Button>
            </Box>

        </Container>
    );
};

export default Welcome;