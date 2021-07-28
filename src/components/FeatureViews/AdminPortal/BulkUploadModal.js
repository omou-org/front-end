import React, { useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import { white, goth } from '../../../theme/muiTheme';

import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { downloadOmouTemplate, useUploadOmouTemplate } from '../../../utils';

import SelectTemplateStep from './SelectTemplateStep';
import UploadTemplateStep from './UploadTemplateStep';
import UploadedResultsStep from './UploadedResultsStep';

const GET_TEMPLATE = {
    Accounts: gql`
        query {
            accountTemplates
        }
    `,
    Courses: gql`
        query {
            courseTemplates
        }
    `,
    Enrollments: gql`
        query {
            enrollmentTemplates
        }
    `,
};

const BulkUploadModal = ({ closeModal }) => {
    const [selectedItem, setSelectedItem] = useState('');

    const [activeStep, setActiveStep] = useState(0);

    const { uploadTemplate } = useUploadOmouTemplate();
    const [, setFileName] = useState(null);
    const [disableUploadBtn, setDisableUploadBtn] = useState(false);
    const [uploadedResponse, setUploadedResponse] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [responseError, setResponseError] = useState({
        error: false,
        responseMessage: null,
    });

    const handleSelectChange = (e) => {
        setSelectedItem(e.target.value);
    };

    const handleStepChange = () => {
        setActiveStep((prevState) => prevState + 1);
    };

    const handleBackStep = () => {
        setActiveStep((prevState) => prevState - 1);
        setResponseError({ error: false, responseMessage: null });
    };

    const handleDownloadTemplate = () => {
        downloadOmouTemplate(
            { query: GET_TEMPLATE[selectedItem] },
            selectedItem.toLowerCase()
        );
    };

    // Show loading screen when user clicks upload
    const uploadFile = async () => {
        setLoading(true);
        let response = await uploadTemplate(selectedFile, selectedItem);

        setTimeout(() => {
            if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
                setResponseError({
                    ...responseError,
                    error: true,
                    responseMessage: response.errors[0].message,
                });
                setLoading(false);
                setDisableUploadBtn(false);
                setFileName(null);
            } else {
                setLoading(false);
                handleStepChange();
                setUploadedResponse(response);
            }
        }, 300);
    };

    let lowerCaseType = selectedItem.toLowerCase();

    const handleDownloadErrorFile = () => {
        downloadOmouTemplate(
            {
                error: uploadedResponse?.data[`upload${selectedItem}`]
                    .errorExcel,
            },
            lowerCaseType
        );
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <SelectTemplateStep
                        closeModal={closeModal}
                        handleDownloadTemplate={handleDownloadTemplate}
                        handleStepChange={handleStepChange}
                        handleSelectChange={handleSelectChange}
                        selectedItem={selectedItem}
                    />
                );
            case 1:
                return (
                    <UploadTemplateStep
                        selectedItem={selectedItem}
                        disableUploadBtn={disableUploadBtn}
                        setDisableUploadBtn={setDisableUploadBtn}
                        setSelectedFile={setSelectedFile}
                        uploadFile={uploadFile}
                        handleBackStep={handleBackStep}
                        loading={loading}
                    />
                );
            case 2:
                return (
                    <UploadedResultsStep
                        uploadedResponse={uploadedResponse}
                        selectedItem={selectedItem}
                        closeModal={closeModal}
                        handleDownloadErrorFile={handleDownloadErrorFile}
                    />
                );
            default:
                return 'Unknown';
        }
    };

    return <>{getStepContent(activeStep)}</>;
};

BulkUploadModal.propTypes = {
    closeModal: PropTypes.func,
};

export default BulkUploadModal;
