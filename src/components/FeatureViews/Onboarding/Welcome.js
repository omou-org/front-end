/* eslint-disable no-unused-vars */
import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { spacing } from '@material-ui/system';
import { makeStyles, styled } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import MuiButton from '@material-ui/core/Button';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import NavLinkNoDup from '../../Routes/NavLinkNoDup';

const Button = styled(MuiButton)(spacing);

const useStyles = makeStyles((theme) => ({
    Text: {
        marginTop: '65px',
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: 'center',
        marginTop: '65px',
    },
}));

const Welcome = () => {
    const classes = useStyles();

    return (
        <Container>
            <Box className={classes.Text}>
                <Typography variant='h3'>Welcome to Omou</Typography>
                <Box fontSize='h5.fontSize' className={classes.Subtitle}>
                    <Typography variant='p'>
                        Let's import your data so you can start using Omou!
                    </Typography>
                </Box>
            </Box>
            <Box mt={20}>
                <ResponsiveButton
                    px={8}
                    size='large'
                    variant='outlined'
                    color='primary'
                >
                    Skip for now
                </ResponsiveButton>
                <ResponsiveButton
                    style={{ marginLeft: '15px' }}
                    px={8}
                    size='large'
                    ml={5}
                    variant='contained'
                    color='primary'
                    component={NavLinkNoDup}
                    to='/onboarding/import'
                >
                    Let's do it!
                </ResponsiveButton>
            </Box>
        </Container>
    );
};

export default Welcome;
