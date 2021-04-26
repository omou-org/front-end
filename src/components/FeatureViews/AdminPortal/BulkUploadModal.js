import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { white, omouBlue, darkGrey, highlightColor, h6, h5, goth, gloom } from '../../../theme/muiTheme';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import axios from 'axios';

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
    useCaseLink: {
        ...h6,
        lineHeight: '22px',
        textDecoration: 'underline',
    },
    errorLink: {
        ...h6,
        color: omouBlue,
        lineHeight: '22px',
        textDecoration: 'underline',
    },
    menuSelect: {
        '&:hover': { backgroundColor: white, color: goth },
    },
    menuSelected: {
        backgroundColor: `${highlightColor} !important`,
    },
    selectDisplay: {
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        width: '13.375em',
        padding: '0.5em 3em 0.5em 1em',
    },
});

const BulkUploadModal = ({ closeModal }) => {
    const [template, setTemplate] = useState('');
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [dropDown, setDropDown] = useState('rotate(0deg)')

    const handleTemplateChange = (e) => {
        setTemplate(e.target.value);
    };

    const handleStepChange = (e) => {
        setActiveStep((prevState) => prevState + 1);
    };

    const handleBackStep = () => {
        setActiveStep((prevState) => prevState - 1);
    };

    const handleDropDown = () => dropDown === 'rotate(0deg)' ? setDropDown('rotate(180deg)') : setDropDown('rotate(0deg)')

    const b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }


    function convertBase64ToExcel() {
        let data = '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'
        let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        let blob1 = b64toBlob(data, contentType);
        let blobUrl1 = URL.createObjectURL(blob1);

        window.open(blobUrl1);

    }



    const uploadFile = () => {
        var bodyFormData = new FormData();
        let file = document.getElementById('xml-upload').files[0]


        // bodyFormData.append('operations', '{"query": "mutation ($file: Upload!) { uploadCourses(courses: $file) { totalSuccess totalFailure errorExcel}}", "variables": { "file": null }}');
        // bodyFormData.append('map', '{"courses_excel":  ["variables.file"]}');
        // bodyFormData.append('courses_excel', file);

        bodyFormData.append('operations', '{"query": "mutation ($file: Upload!) { uploadAccounts(accounts: $file) { totalSuccess totalFailure errorExcel}}", "variables": { "file": null }}');
        bodyFormData.append('map', '{"accounts_excel":  ["variables.file"]}');
        bodyFormData.append('accounts_excel', file);
        let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InN0YWZmMkBnbWFpbC5jb20iLCJleHAiOjE2MTg4OTEwNzYsIm9yaWdJYXQiOjE2MTg4OTA3NzZ9.RwV95oMrKxMTjedxWfHpwpi22RxwnF9KdvSL0xRtdNk'

        fetch('http://localhost:8000/graphql', {
            method: "POST",
            body: bodyFormData,
            headers: {
                'Authorization': `JWT ${token}`
            }
        })
            .then((resp) => resp.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.error(err);
            })
        handleStepChange()
    }


    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container className={classes.modalStyle}>
                        <Grid item style={{ padding: '2em' }} xs={12}>
                            <Typography
                                className={classes.modalTypography}
                                variant='h3'
                            >
                                {' '}
                                Bulk Upload
                            </Typography>

                            <Typography
                                align='left'
                                className={classes.modalTypography}
                                variant='h6'
                            >
                                Please select and download the template for the
                                data you want to upload, fill out the template
                                and upload it back Omou.
                            </Typography>

                            <Link
                                className={`${classes.modalTypography} ${classes.useCaseLink}`}
                            >
                                Why am I entering this data?
                            </Link>

                            <div style={{ margin: '1em 0px' }}>
                                <Select
                                    onOpen={handleDropDown}
                                    onClose={handleDropDown}
                                    SelectDisplayProps={{
                                        className: classes.selectDisplay
                                    }}
                                    disableUnderline
                                    MenuProps={
                                        {
                                            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                                            getContentAnchorEl: null,
                                        }
                                    }
                                    IconComponent={() => (
                                        <SvgIcon
                                            style={{ position: 'absolute', top: '24%', left: '84.25%', pointerEvents: 'none', transform: dropDown }}
                                            fontSize='small'
                                            viewBox="0 0 16 10"
                                        >
                                            <path d="M1.90255 0.623718L0.57505 1.95122L8.00005 9.37622L15.425 1.95122L14.0975 0.623718L8.00005 6.72122L1.90255 0.623718V0.623718Z" fill="#43B5D9" />
                                        </SvgIcon>
                                    )}
                                    value={template}
                                    displayEmpty
                                    onChange={handleTemplateChange}
                                >

                                    <MenuItem
                                        style={{ display: 'none' }}
                                        value=''
                                        ListItemClasses={{ selected: classes.menuSelected }}
                                        className={classes.menuSelect}
                                        disabled
                                        style={{ display: 'none' }}
                                    >
                                        Select Template
                                    </MenuItem>
                                    <MenuItem
                                        value='Accounts'
                                        ListItemClasses={{ selected: classes.menuSelected }}
                                        className={classes.menuSelect}>
                                        Accounts
                                    </MenuItem>
                                    <MenuItem
                                        value='Courses'
                                        ListItemClasses={{ selected: classes.menuSelected }}
                                        className={classes.menuSelect}>
                                        Courses
                                    </MenuItem>
                                    <MenuItem
                                        value='Course Enrollments'
                                        ListItemClasses={{ selected: classes.menuSelected }}
                                        className={classes.menuSelect}
                                    >
                                        Course Enrollments
                                    </MenuItem>
                                </Select>
                                <IconButton
                                    disabled={!template && true}
                                    onClick={convertBase64ToExcel}
                                >
                                    <SvgIcon>
                                        <path
                                            d='M17.5 13.75V17.5H2.5V13.75H0V17.5C0 18.875 1.125 20 2.5 20H17.5C18.875 20 20 18.875 20 17.5V13.75H17.5ZM16.25 8.75L14.4875 6.9875L11.25 10.2125V0H8.75V10.2125L5.5125 6.9875L3.75 8.75L10 15L16.25 8.75Z'
                                            fill={template ? omouBlue : gloom}
                                        />
                                    </SvgIcon>
                                </IconButton>
                            </div>

                            <Grid style={{ textAlign: 'right' }} item xs={12}>
                                <ResponsiveButton
                                    style={{ border: 'none', color: darkGrey }}
                                    variant='outlined'
                                    onClick={closeModal}
                                >
                                    cancel
                                </ResponsiveButton>
                                <ResponsiveButton
                                    style={{ border: 'none', background: white }}
                                    disabled={!template && true}
                                    variant={template ? 'outlined' : 'contained'}
                                    template={template}
                                    onClick={handleStepChange}
                                >
                                    continue to upload
                                </ResponsiveButton>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container style={{ height: '19em' }} className={classes.modalStyle}>
                        <Grid item style={{ padding: '2em' }} xs={12}>
                            <Typography
                                className={classes.modalTypography}
                                variant='h3'
                            >
                                Upload {template}
                            </Typography>

                            <Typography
                                align='left'
                                className={classes.modalTypography}
                                variant='h6'
                            >
                                After you fill out the template, please upload
                                your file here. You can only upload one file at
                                a time.
                            </Typography>

                            <div style={{ margin: '2em 0px' }}>
                                <input type='file' id='xml-upload' />
                                {/* <ResponsiveButton type='file' variant='contained'  >Select File</ResponsiveButton> */}
                            </div>

                            <Grid style={{ textAlign: 'right' }} item xs={12}>
                                <ResponsiveButton
                                    style={{ border: 'none', color: darkGrey }}
                                    variant='outlined'
                                    onClick={handleBackStep}
                                >
                                    Back
                                </ResponsiveButton>
                                <ResponsiveButton
                                    style={{ border: 'none' }}
                                    variant='outlined'
                                    template={template}
                                    onClick={uploadFile}
                                >
                                    Upload
                                </ResponsiveButton>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container style={{ height: '17em' }} className={classes.modalStyle}>
                        <Grid item style={{ padding: '2em' }} xs={12}>
                            <Typography
                                className={classes.modalTypography}
                                variant='h3'
                            >
                                {' '}
                                Upload Results
                            </Typography>

                            <Typography
                                align='left'
                                className={classes.modalTypography}
                                variant='body1'
                            >
                                1435 rows uploaded successfully.
                            </Typography>

                            <div style={{ margin: '1em 0px' }}>
                                <Link
                                    className={`${classes.modalTypography} ${classes.errorLink}`}
                                >
                                    Download Error File
                            </Link>

                                <IconButton>
                                    <SvgIcon>
                                        <path
                                            d='M17.5 13.75V17.5H2.5V13.75H0V17.5C0 18.875 1.125 20 2.5 20H17.5C18.875 20 20 18.875 20 17.5V13.75H17.5ZM16.25 8.75L14.4875 6.9875L11.25 10.2125V0H8.75V10.2125L5.5125 6.9875L3.75 8.75L10 15L16.25 8.75Z'
                                            fill={omouBlue}
                                        />
                                    </SvgIcon>
                                </IconButton>
                            </div>

                            <Grid style={{ textAlign: 'right', marginTop: '2em' }} item xs={12}>
                                <ResponsiveButton
                                    style={{ border: 'none' }}
                                    variant='outlined'
                                    template={template}
                                    onClick={closeModal}
                                >
                                    done
                                </ResponsiveButton>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            default:
                return 'Unknown';
        }
    };

    return <>{getStepContent(activeStep)}</>;
};

export default BulkUploadModal;
