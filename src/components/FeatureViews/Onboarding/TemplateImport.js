import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import DownloadTemplateButton from './DownloadTemplateButton';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import useOnboardingActions from './ImportStepperActions';

import DragAndDropUploadBtn from './DragAndDropUploadBtn';
import { OnboardingContext } from './OnboardingContext';
import PropTypes from 'prop-types';

const TemplateImport = ({ templateType, setActiveStep }) => {
    const [disabled, setDisabled] = useState(true);
    const { state } = useContext(OnboardingContext);

    const { handleBack } = useOnboardingActions();

    useEffect(() => {
        if (state.UPLOAD_RESPONSE != null) {
            if (
                Object.prototype.hasOwnProperty.call(
                    state.UPLOAD_RESPONSE,
                    'errors'
                )
            ) {
                setDisabled(true);
            }

            if (state.UPLOAD_RESPONSE.data[`upload${templateType}`] != null) {
                setDisabled(false);
            }
        }
    }, [state.UPLOAD_RESPONSE, templateType]);

    let lowerCaseType = templateType.toLowerCase();
    const handleNext = () => {
        setActiveStep(1);
    };

    return (
        <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
            spacing={4}
        >
            <Grid item>
                <Typography variant='h1'>{templateType}</Typography>
            </Grid>
            <Grid item>
                <Typography variant='h3'>
                    {`Fill out ${lowerCaseType} template and upload it below`}
                </Typography>
            </Grid>
            <Grid item>
                <Link>Why am I entering this data?</Link>
            </Grid>
            <Grid item>
                <DownloadTemplateButton templateType={templateType} />
            </Grid>
            <Grid item>
                <DragAndDropUploadBtn templateType={templateType} />
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
                    <ResponsiveButton variant='contained' onClick={handleBack}>
                        Back
                    </ResponsiveButton>
                </Grid>
                <Grid item>
                    <ResponsiveButton
                        variant='contained'
                        onClick={handleNext}
                        disabled={disabled}
                    >
                        Next
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

TemplateImport.propTypes = {
    templateType: PropTypes.string,
    setActiveStep: PropTypes.func,
};

export default TemplateImport;
