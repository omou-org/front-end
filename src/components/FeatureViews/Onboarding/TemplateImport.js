import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import DownloadTemplateButton from './DownloadTemplateButton';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { makeStyles } from '@material-ui/core/styles';
import { h6 } from '../../../theme/muiTheme';
import Typography from '@material-ui/core/Typography';
import useOnboardingActions from './ImportStepperActions';

import DragAndDropUploadBtn from './DragAndDropUploadBtn';
import { OnboardingContext } from './OnboardingContext';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    modalTypography: {
        marginBottom: '1em',
    },
    useCaseLink: {
        ...h6,
        lineHeight: '22px',
        textDecoration: 'underline',
    },
});

const TemplateImport = ({ templateType, setActiveStep }) => {
    const [disabled, setDisabled] = useState(true);
    const { state } = useContext(OnboardingContext);

    const { handleBack } = useOnboardingActions();
    const classes = useStyles();

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
                <a
                    className={`${classes.modalTypography} ${classes.useCaseLink}`}
                    href='/business-use-cases'
                    target='_blank'
                    rel='noopener noreferrer'
                    type='button'
                >
                    Why am I entering this data?
                </a>
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
