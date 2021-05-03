import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import OnboardingControls from './OnboardingControls';

const useStyles = makeStyles(() => ({
    Text: {
        marginTop: '65px',
        marginBottom: '30px;',
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: 'center',
        marginTop: '40px',
    },
    uploadField: {
        width: '250px',
        height: '250px',
        border: '2px dashed #28ABD5',
        borderRadius: '10px',
        margin: 'auto',
    },
    uploadFieldText: {
        marginTop: 110,
        color: '#28ABD5',
    },
}));
const CourseUpload = () => {
    const classes = useStyles();

    return (
        <Container>
            <Box className={classes.Text}>
                <Typography variant='h3'>Courses</Typography>
                <Box fontSize='h5.fontSize' className={classes.Subtitle}>
                    <Typography variant='p'>
                        Upload your filled-in Courses template:
                    </Typography>
                </Box>
            </Box>
            <Box className={classes.uploadField}>
                <Typography className={classes.uploadFieldText}>
                    Drag & Drop files here
                </Typography>
            </Box>
            <input
                className={classes.manualUploadBtn}
                type='file'
                accept='.csv'
            ></input>
            <OnboardingControls />
        </Container>
    );
};

export default CourseUpload;
