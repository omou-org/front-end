import React from 'react';
import useOnboardingActions from "./ImportStepperActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {ResponsiveButton} from "../../../theme/ThemedComponents/Button/ResponsiveButton";

const ImportResults = ({templateType, setActiveStep}) => {
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