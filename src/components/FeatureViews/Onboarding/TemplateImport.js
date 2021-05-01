import React from 'react';
import { Grid } from '@material-ui/core';
import { downloadOmouTemplate, useUploadOmouTemplate } from '../../../utils';
import DownloadTemplateButton from './DownloadTemplateButton';

const TemplateImport = ({ templateType }) => {

    let lowerCaseType = templateType.toLowerCase();

    // Dropzone for uploading 

    return (
        <Grid container direction='column' justify='center' alignItems='center' spacing={4}>
            <Grid item xs={12}>
                <h1>{templateType}</h1>
            </Grid>
            <Grid item xs={12}>
                <h3>{`Fill out ${lowerCaseType} template and upload it below`}</h3>
            </Grid>
            <Grid item xs={12}>
                Why am i entering this data?
                </Grid>
            <DownloadTemplateButton
                templateType={templateType}
            />

        </Grid>



    )
}


export default TemplateImport;