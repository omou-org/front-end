import React, { useState, useContext } from 'react';
import useOnboardingActions from './ImportStepperActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import DragAndDropUploadBtn from './DragAndDropUploadBtn';
import { OnboardingContext } from './OnboardingContext';
import DownloadTemplateButton from './DownloadTemplateButton';
import PropTypes from 'prop-types';

const ImportResults = ({ templateType, setActiveStep }) => {
    const { state } = useContext(OnboardingContext);
    const [setUploadedFile] = useState(null);
    const { handleNext } = useOnboardingActions();
    const handleBack = () => setActiveStep(0);

    const handleNextImportFlowStep = () => {
        setActiveStep(0);
        handleNext();
    };

    const isError =
        state.UPLOAD_RESPONSE.data[`upload${templateType}`].errorExcel != '';
    const totalSuccess =
        state.UPLOAD_RESPONSE.data[`upload${templateType}`].totalSuccess;
    const totalFailure =
        state.UPLOAD_RESPONSE.data[`upload${templateType}`].totalFailure;

    return (
        <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
            spacing={4}
        >
            <Grid item>
                <Typography variant='h1'>
                    {`${templateType} Uploaded!`}
                </Typography>
            </Grid>
            <Grid item>
                <Grid container direction='row' spacing={4}>
                    <Grid item xs={!isError ? 12 : 6}>
                        <Typography align='left'>
                            {`Below is a summary of the uploaded ${templateType}.`}
                        </Typography>
                        <Typography align='left'>
                            Please correct and re-upload the failed rows found
                            in the error file.
                        </Typography>
                        <br />
                        <br />
                        <Typography align='left'>
                            {`${totalSuccess} rows uploaded successfully.`}
                        </Typography>
                        <br />
                        <Typography align='left'>
                            {`${totalFailure} rows failed to upload.`}
                        </Typography>
                        <br />
                        <Typography align='left'>
                            {isError && (
                                <DownloadTemplateButton
                                    templateType={templateType}
                                    resultsError={true}
                                />
                            )}
                        </Typography>
                    </Grid>
                    <Grid item>
                        {isError && (
                            <DragAndDropUploadBtn
                                templateType={templateType}
                                setUploadedFile={setUploadedFile}
                            />
                        )}
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                container
                direction='row'
                justify='center'
                alignItems='center'
                spacing={3}
            >
                <Grid item>
                    <ResponsiveButton
                        variant='contained'
                        color='secondary'
                        onClick={handleBack}
                    >
                        Back
                    </ResponsiveButton>
                </Grid>
                <Grid item>
                    <ResponsiveButton
                        variant='contained'
                        onClick={handleNextImportFlowStep}
                    >
                        Next
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

ImportResults.propTypes = {
    templateType: PropTypes.string,
    setActiveStep: PropTypes.func,
};

export default ImportResults;
