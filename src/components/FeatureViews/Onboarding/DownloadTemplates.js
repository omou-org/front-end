import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import OnboardingControls from './OnboardingControls';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import { omouBlue } from '../../../theme/muiTheme';
import IconButton from '@material-ui/core/IconButton';
import PeopleIcon from '@material-ui/icons/People';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { downloadOmouTemplate } from '../../../utils';
import gql from 'graphql-tag'

const useStyles = makeStyles((theme) => ({
    Icon: {
        border: '2px solid #28ABD5',
        borderRadius: '8px',
        color: '#28ABD5',
        margin: '20px',
    },
    Label: {
        display: 'inline',
    },
    downloadButton: {
        width: '500px',
        fontSize: '16px',
        border: ` 2px solid ${omouBlue}`,
        padding: ' 8px, 16px, 8px, 16px',

    },
    rootNegativeMargin: {
        paddingLeft: 56,
        paddingRight: 56,
        width: '302px',
        fontSize: '16px',
        border: ` 2px solid ${omouBlue}`,
        padding: ' 8px, 16px, 8px, 16px',

        "& .MuiButton-endIcon": {
            marginRight: -46,
            marginLeft: 36
        }
    }

}));

const DownloadTemplates = () => {
    const classes = useStyles();

    const GET_TEMPLATE = {
        "Accounts": gql`query {
                     accountTemplates
                }`,
        "Courses": gql`query {
                    courseTemplates
                }`,
        "Course Enrollments": gql`query {
                courseTemplates
        }`
    }




    return (
        <>

            <Grid container direction='column' justify='center' alignItems='center' spacing={3}>
                <Grid item xs={12}>
                    <h1 className={classes.test}>Download Templates</h1>
                </Grid>
                <Grid item xs={6}>
                    <h3>Download and fill in the templates below to import existing accounts and
                        courses, you will be prompted to upload these later in Steps 4 & 5:</h3>
                </Grid>
                <Grid item xs={12}>

                    <Button
                        variant='outlined'
                        endIcon={<GetAppIcon />}
                        className={classes.rootNegativeMargin}
                        onClick={() => downloadOmouTemplate(GET_TEMPLATE['Accounts'], 'accounts')}

                    >
                        Accounts Template
                    </Button>
                </Grid>

                <Grid item xs={12}>

                    <Button
                        variant='outlined'
                        className={classes.rootNegativeMargin}
                        endIcon={<GetAppIcon />}
                        onClick={() => downloadOmouTemplate(GET_TEMPLATE['Courses'], 'courses')}
                    >
                        Courses Template
                          </Button>
                </Grid>

                <Grid item xs={12}>

                    <Button
                        variant='outlined'
                        className={classes.rootNegativeMargin}
                        endIcon={<GetAppIcon />}
                        onClick={() => downloadOmouTemplate(GET_TEMPLATE['Course Enrollments'], 'Course_Enrollments')}
                    >
                        Enrollments Template
                </Button>
                </Grid>
            </Grid>

            <OnboardingControls />
        </>
    );
};

export default DownloadTemplates;
