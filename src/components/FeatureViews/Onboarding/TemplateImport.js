import React from 'react';
import {Grid} from '@material-ui/core';
import DownloadTemplateButton from './DownloadTemplateButton';
import {ResponsiveButton} from "../../../theme/ThemedComponents/Button/ResponsiveButton";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import useOnboardingActions from "./ImportStepperActions";
import {makeStyles} from "@material-ui/core/styles";
import DragAndDropUploadBtn from "./DragAndDropUploadBtn";

const useStyles = makeStyles((theme) => ({
    uploadField: {
        border: '2px dashed #28ABD5',
        borderRadius: '10px',
    },
    uploadFieldText: {
        color: '#28ABD5',
    },
}));

const TemplateImport = ({templateType, setActiveStep}) => {
    const classes = useStyles();

    const {handleBack} = useOnboardingActions();
    const handleNext = () => setActiveStep(1);
    let lowerCaseType = templateType.toLowerCase();

    // Dropzone for uploading 

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
                    {templateType}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant='h3'>
                    {`Fill out ${lowerCaseType} template and upload it below`}
                </Typography>
            </Grid>
            <Grid item>
                <Link>
                    Why am i entering this data?
                </Link>
            </Grid>
            <Grid item>
                <DownloadTemplateButton
                    templateType={templateType}
                />
            </Grid>
            <Grid item>
                <DragAndDropUploadBtn/>
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
                        onClick={handleNext}
                    >
                        Next
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default TemplateImport;