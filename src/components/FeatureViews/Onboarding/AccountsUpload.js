import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import OnboardingControls from './OnboardingControls';

const useStyles = makeStyles((theme) => ({
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

const UPLOAD_FILE = gql`
    mutation UploadMutation($uploadFile: Upload!) {
        uploadMutation(uploadFile: $uploadFile) {
            success
        }
    }
`;

const AccountsUpload = () => {
    const [mutate] = useMutation(UPLOAD_FILE);

    const classes = useStyles();

    function onChange({
        target: {
            validity,
            files: [file],
        },
    }) {
        if (validity.valid) mutate({ variables: { file } });
    }
    return (
        <Container>
            <Box className={classes.Text}>
                <Typography variant='h3'>Accounts</Typography>
                <Box fontSize='h5.fontSize' className={classes.Subtitle}>
                    <Typography variant='p'>
                        Upload your filled-in Accounts template:
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
                onChange={onChange}
                type='file'
                accept='.csv'
            ></input>
            <OnboardingControls />
        </Container>
    );
};

export default AccountsUpload;
