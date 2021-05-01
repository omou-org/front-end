import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import { downloadOmouTemplate } from '../../../utils';
import gql from 'graphql-tag';
import { omouBlue } from '../../../theme/muiTheme';


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


const DownloadTemplateButton = ({ templateType }) => {
    const classes = useStyles();
    let lowerCaseType = templateType === 'Course enrollments' ? 'Course_Enrollments' : templateType.toLowerCase();

    const GET_TEMPLATE = {
        "Accounts": gql`query {
                     accountTemplates
                }`,
        "Courses": gql`query {
                    courseTemplates
                }`,
        "Course enrollments": gql`query {
                courseTemplates
        }`
    }


    return (
        <Button
            variant='outlined'
            endIcon={<GetAppIcon />}
            className={classes.rootNegativeMargin}
            onClick={() => downloadOmouTemplate(GET_TEMPLATE[templateType], lowerCaseType)}

        >
            {`${templateType} Template`}
        </Button>
    )
}

export default DownloadTemplateButton;