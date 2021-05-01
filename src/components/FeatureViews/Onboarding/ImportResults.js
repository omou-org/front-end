import React, {useState} from 'react';
import useOnboardingActions from "./ImportStepperActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {ResponsiveButton} from "../../../theme/ThemedComponents/Button/ResponsiveButton";
import DragAndDropUploadBtn from "./DragAndDropUploadBtn";

const ImportResults = ({templateType, setActiveStep}) => {
    const [successfulRows, setSuccessfulRows] = useState(0);
    const [failedRows, setFailedRows] = useState(0);
    const {handleNext} = useOnboardingActions();
    const handleBack = () => setActiveStep(0);
    const handleNextImportFlowStep = () => {
        setActiveStep(0);
        handleNext();
    }
    // handle next for main stepper 
    return (
        <Grid container
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
                <Grid container
                      direction='row'
                      spacing={4}
                >
                    <Grid item xs={6}>
                        <Typography align='left'>
                            {`Below is a summary of the uploaded ${templateType}.`}
                        </Typography>
                        <Typography align='left'>
                            Please correct and re-upload the failed rows found in the error file.
                        </Typography>
                        <br/><br/>
                        <Typography align='left'>
                            {`${successfulRows} rows uploaded successfully.`}
                        </Typography>
                        <br/>
                        <Typography align='left'>
                            {`${failedRows} rows failed to upload.`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <DragAndDropUploadBtn/>
                    </Grid>
                </Grid>

            </Grid>
            <Grid item
                  container
                  direction='row'
                  justify='center'
                  alignItems='center'
                  spacing={3}
            >
                <Grid item>
                    <ResponsiveButton
                        variant='contained'
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
    )
}


export default ImportResults;