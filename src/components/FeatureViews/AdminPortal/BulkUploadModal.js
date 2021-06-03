import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {white,goth} from '../../../theme/muiTheme';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { downloadOmouTemplate, useUploadOmouTemplate } from '../../../utils';
import Loading from '../../../components/OmouComponents/Loading';
import SelectTemplateStep from './SelectTemplateStep';
import UploadTemplateStep from './UploadTemplateStep';
import UploadedResultsStep from './UploadedResultsStep';


const useStyles = makeStyles({
    modalStyle: {
        top: '50%',
        left: `50%`,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        width: '31.8em',
        height: '21em',
        background: white,
        boxShadow: '0px 0px 8px rgba(153, 153, 153, 0.8);',
        borderRadius: '5px',
    },
   
    menuSelect: {
        '&:hover': { backgroundColor: white, color: goth },
    },
});

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
    const classes = useStyles();
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
            { error: uploadedResponse?.data[`upload${selectedItem}`].errorExcel },
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
                    <>
                        {loading ? (
                            <Grid conatiner className={classes.modalStyle}>
                                <Loading small={true} />
                            </Grid>
                        ) : (

                            <UploadTemplateStep
                                selectedItem={selectedItem}
                                disableUploadBtn={disableUploadBtn}
                                setDisableUploadBtn={setDisableUploadBtn}
                                setSelectedFile={setSelectedFile}
                                uploadFile={uploadFile}
                                handleBackStep={handleBackStep}
                            />
                           
                        )}
                    </>
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
