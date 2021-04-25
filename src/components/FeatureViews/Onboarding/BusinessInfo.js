import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Text: {
        marginTop: '65px',
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: 'center',
        marginTop: '50px',
    },
}));

const BusinessInfo = () => {
    const classes = useStyles();
    const [bizName, setBizName] = useState('');
    const [bizPhone, setBizPhone] = useState('');
    const [bizEmail, setBizEmail] = useState('');
    const [bizAddress, setBizAddress] = useState('');

    return (
        <Container>
            <Box className={classes.Text}>
                <Typography variant='h3'>Business Information</Typography>
                <Box fontSize='h5.fontSize' className={classes.Subtitle}>
                    <Typography variant='p'>
                        Please input the following business info, these would
                        show up in payment receipt printouts:
                    </Typography>
                </Box>
            </Box>
            <form style={{ width: 500, margin: 'auto' }} autoComplete='off'>
                <TextField
                    style={{ marginTop: 25 }}
                    fullWidth
                    id='name'
                    label='Business Name'
                    required
                />{' '}
                <br />
                <TextField
                    style={{ marginTop: 25 }}
                    fullWidth
                    id='phone'
                    label='Business Phone'
                    required
                />
                <br />
                <TextField
                    style={{ marginTop: 25 }}
                    fullWidth
                    id='email'
                    label='Business Email'
                    required
                />
                <br />
                <TextField
                    style={{ marginTop: 25 }}
                    fullWidth
                    id='address'
                    label='Business Address'
                    required
                />
                <br />
            </form>
        </Container>
    );
};

export default BusinessInfo;
