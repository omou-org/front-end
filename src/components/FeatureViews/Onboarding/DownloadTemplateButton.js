import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import { downloadOmouTemplate } from '../../../utils';
import gql from 'graphql-tag';
import { omouBlue } from '../../../theme/muiTheme';
import { OnboardingContext } from './OnboardingContext';
import PropTypes from 'prop-types';


const useStyles = makeStyles(() => ({
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


const DownloadTemplateButton = ({ templateType, resultsError }) => {
    const { state } = useContext(OnboardingContext);
    const classes = useStyles();
    let lowerCaseType =  templateType.toLowerCase();
    
    const GET_TEMPLATE = {
        "Accounts": gql`query {
                     accountTemplates
                }`,
        "Courses": gql`query {
                    courseTemplates
                }`,
        "Enrollments": gql`query {
                    enrollmentTemplates
                }`,
    };



    const handleOnChange = () => {

        if (resultsError) {
            downloadOmouTemplate({ error: state.UPLOAD_RESPONSE.data[`upload${templateType}`].errorExcel }, lowerCaseType);
        } else {
            downloadOmouTemplate({ query: GET_TEMPLATE[templateType] }, lowerCaseType);
        }

    };


    return (
        <Button
            variant='outlined'
            endIcon={<GetAppIcon />}
            className={classes.rootNegativeMargin}
            onClick={handleOnChange}

        >
            {resultsError ? `${templateType} error Template` : `${templateType} Template`}
            
        </Button>
    );
};

DownloadTemplateButton.propTypes = {
    templateType: PropTypes.string,
    resultsError: PropTypes.bool
};

export default DownloadTemplateButton;