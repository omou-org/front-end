import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';

import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

import PropTypes from 'prop-types';
import { white, darkGrey } from '../../../theme/muiTheme';

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
    modalTypography: {
        marginBottom: '1em',
    },
});

const SelectTemplateStep = ({
    disableUploadBtn,
    setDisableUploadBtn,
    selectedItem,
    setSelectedFile,
    uploadFile,
    handleBackStep,
}) => {
    const classes = useStyles();
    const [fileName, setFileName] = useState(null);
    const [responseError, setResponseError] = useState({
        error: false,
        responseMessage: null,
    });

    const uploadFileWrapper = () => {
        document.getElementById('xml-upload').click();
        setResponseError({
            ...responseError,
            error: false,
            responseMessage: null,
        });
    };
    const removeUpload = () => {
        setDisableUploadBtn(false);
        setFileName(null);
    };

    const handleSelectFile = () => {
        const file = document.getElementById('xml-upload').files[0];
        setFileName(file.name);
        setDisableUploadBtn(true);
        setSelectedFile(file);
    };

    return (
        <Grid container className={classes.modalStyle}>
            <Grid item style={{ padding: '2em' }} xs={12}>
                <Typography className={classes.modalTypography} variant='h3'>
                    Upload {selectedItem}
                </Typography>

                <Typography
                    align='left'
                    className={classes.modalTypography}
                    variant='h6'
                >
                    After you fill out the template, please upload your file
                    here. You can only upload one file at a time.
                </Typography>

                <div>
                    <ResponsiveButton
                        onClick={uploadFileWrapper}
                        disabled={disableUploadBtn}
                        variant='contained'
                    >
                        Select File
                    </ResponsiveButton>
                    <input
                        id='xml-upload'
                        hidden
                        type='file'
                        multiple={false}
                        accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        onChange={handleSelectFile}
                    />
                    {fileName ? (
                        <>
                            <p>
                                {fileName}{' '}
                                <button onClick={removeUpload}>X</button>
                            </p>
                        </>
                    ) : (
                        <p style={{ color: 'red' }}>
                            {responseError.responseMessage}
                        </p>
                    )}
                </div>
                <Grid
                    className={classes.bottomNav}
                    style={{ textAlign: 'right' }}
                    item
                    xs={12}
                >
                    <ResponsiveButton
                        style={{
                            border: 'none',
                            color: darkGrey,
                        }}
                        variant='outlined'
                        onClick={handleBackStep}
                    >
                        Back
                    </ResponsiveButton>
                    <ResponsiveButton
                        style={{ border: 'none' }}
                        variant='outlined'
                        template={selectedItem}
                        onClick={uploadFile}
                        disabled={!disableUploadBtn}
                    >
                        Upload
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SelectTemplateStep;

SelectTemplateStep.propTypes = {
    disableUploadBtn: PropTypes.func,
    setDisableUploadBtn: PropTypes.func,
    setSelectedFile: PropTypes.func,
    uploadFile: PropTypes.func,
    handleBackStep: PropTypes.func,
    selectedItem: PropTypes.string,
};
