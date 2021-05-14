import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    white,
    omouBlue,
    darkGrey,
    highlightColor,
    h6,
    goth,
    gloom,
} from '../../../theme/muiTheme';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import gql from 'graphql-tag';
import { downloadOmouTemplate, useUploadOmouTemplate  } from '../../../utils';
import PropTypes from 'prop-types';
import Loading from '../../../components/OmouComponents/Loading';


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
    dataPopup: {
        border: '1px solid',
        width: '44rem',
        height: '34rem',
        padding: '2rem',
        backgroundColor: white,
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    selectDisplay: {
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        width: '13.375em',
        padding: '0.5em 3em 0.5em 1em',
    },
    verticalMargin: {
        marginTop: '1rem'
    },
    tableHead: {
        background: omouBlue,
        color: white,
        borderLeft: `1px solid ${omouBlue}`,
        borderRight: `1px solid ${omouBlue}`,
    },
    leftCell: {
        borderLeft: '1px solid gray',
        borderRight: '1px solid gray',
    },
    rightCell: {
        borderRight: '1px solid gray',
    },
    bottomNav: {
        width: '100%',
        position: 'fixed',
        bottom: '19px',
        right: '30px',

    },
    doneBtn: {

    }
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
    const [template, setTemplate] = useState('');
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [dropDown, setDropDown] = useState('rotate(0deg)');
    const { uploadTemplate } = useUploadOmouTemplate();
    const [fileName, setFileName] = useState(null);
    const [disableUploadBtn, setDisableUploadBtn] = useState(false);
    const [uploadResponse , setUploadResponse ]= useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading ] = useState(false);
    const [responseError, setResponseError] = useState({error: false, responseMessage: null});

    

    const handleTemplateChange = (e) => {
        setTemplate(e.target.value);
    };

    const handleStepChange = () => {
        setActiveStep((prevState) => prevState + 1);
    };

    const handleBackStep = () => {
        setActiveStep((prevState) => prevState - 1);
        setResponseError({error: false, responseMessage: null});
    };
    
    const handleDropDown = () =>
        dropDown === 'rotate(0deg)'
            ? setDropDown('rotate(180deg)')
            : setDropDown('rotate(0deg)');

    

    const handleDownloadTemplate = () =>  {
        downloadOmouTemplate(
            {query :GET_TEMPLATE[template]},
            template.toLowerCase()
        );
    };

    const upload = () => {
        document.getElementById("xml-upload").click();
        setResponseError({...responseError, error: false, responseMessage: null});
    };

    
    
    // Show loading screen when user clicks upload 
    const uploadFile = async () => {
        setLoading(true);
        let response = await uploadTemplate(selectedFile, template);
        
        setTimeout(() => {
            if(Object.prototype.hasOwnProperty.call(response, 'errors')){
                setResponseError({...responseError, 
                    error: true,
                    responseMessage: response.errors[0].message
                });
                setLoading(false);    
                setDisableUploadBtn(false);
                setFileName(null);
            }else {
                setLoading(false);
                handleStepChange();
                setUploadResponse(response);
            }
        },300);
    };


    const handleSelectFile = ( ) => {
        const file = document.getElementById('xml-upload').files[0];
        setFileName(file.name);
        setDisableUploadBtn(true);
        setSelectedFile(file);
    };
    let lowerCaseType =  template.toLowerCase();
  
    const handleDownloadErrorFile = () => {
        
        downloadOmouTemplate({error: uploadResponse?.data[`upload${template}`].errorExcel}, lowerCaseType);
    };



    const removeUpload = () => {
        setDisableUploadBtn(false);
        setFileName(null);
        
    };
    

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
                            <a
                                className={`${classes.modalTypography} ${classes.useCaseLink}`}
                                href='/business-use-cases'
                                target='_blank'
                                rel='noopener noreferrer'
                                type='button'
                            >
                                Why am I entering this data?
                            </a>
                            <div style={{ margin: '1em 0px' }}>
                                <Select
                                    onOpen={handleDropDown}
                                    onClose={handleDropDown}
                                    SelectDisplayProps={{
                                        className: classes.selectDisplay,
                                    }}
                                    disableUnderline
                                    MenuProps={{
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        },
                                        getContentAnchorEl: null,
                                    }}
                                    IconComponent={() => (
                                        <SvgIcon
                                            style={{
                                                position: 'absolute',
                                                top: '24%',
                                                left: '84.25%',
                                                pointerEvents: 'none',
                                                transform: dropDown,
                                            }}
                                            fontSize='small'
                                            viewBox='0 0 16 10'
                                        >
                                            <path
                                                d='M1.90255 0.623718L0.57505 1.95122L8.00005 9.37622L15.425 1.95122L14.0975 0.623718L8.00005 6.72122L1.90255 0.623718V0.623718Z'
                                                fill='#43B5D9'
                                            />
                                        </SvgIcon>
                                    )}
                                    value={template}
                                    displayEmpty
                                    onChange={handleTemplateChange}
                                >
                                    <MenuItem
                                        style={{ display: 'none' }}
                                        value=''
                                        ListItemClasses={{
                                            selected: classes.menuSelected,
                                        }}
                                        className={classes.menuSelect}
                                        disabled
                                        
                                    >
                                        Select Template
                                    </MenuItem>
                                    <MenuItem
                                        value='Accounts'
                                        ListItemClasses={{
                                            selected: classes.menuSelected,
                                        }}
                                        className={classes.menuSelect}
                                    >
                                        Accounts
                                    </MenuItem>
                                    <MenuItem
                                        value='Courses'
                                        ListItemClasses={{
                                            selected: classes.menuSelected,
                                        }}
                                        className={classes.menuSelect}
                                    >
                                        Courses
                                    </MenuItem>
                                    <MenuItem
                                        value='Enrollments'
                                        ListItemClasses={{
                                            selected: classes.menuSelected,
                                        }}
                                        className={classes.menuSelect}
                                    >
                                        Course Enrollments
                                    </MenuItem>
                                </Select>
                                <IconButton
                                disabled={!template && true}
                                onClick={handleDownloadTemplate}
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
                                    style={{
                                        border: 'none',
                                        background: white,
                                    }}
                                    disabled={!template && true}
                                    variant={
                                        template ? 'outlined' : 'contained'
                                    }
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
                    <>
                    { loading ? 

                    <Grid conatiner 
              
                    className={classes.modalStyle}>
                        <Loading small={true} /> 
                    </Grid>

                    :

                    <Grid
                        container
                  
                        className={classes.modalStyle}
                    >
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

                            
                            <div >
                                <ResponsiveButton onClick={upload} disabled={disableUploadBtn} variant='contained'>Select File</ResponsiveButton>
                                <input id='xml-upload' hidden type="file" multiple={false} accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' onChange={handleSelectFile} /> 
                                {fileName ? 
                                    <>
                                        <p>{fileName} <button onClick={removeUpload}>X</button></p>
                                        </>
                                        :
                                        <p style={{color: 'red'}}>{responseError.responseMessage}</p> 
                                }
                            </div>
                            <Grid className={classes.bottomNav} style={{ textAlign: 'right' }} item xs={12}>
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
                                    disabled={!disableUploadBtn}
                                >
                                    Upload
                                </ResponsiveButton>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                    </>
                );
            case 2:
                return (
                    <Grid
                        container
                        
                        className={classes.modalStyle}
                    >
                        <Grid item style={{ padding: '2em',  }} xs={12}>
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
                                {`${uploadResponse?.data[`upload${template}`].totalSuccess} rows uploaded successfully.`}
                            </Typography>

                            <Typography
                                align='left'
                                className={classes.modalTypography}
                                variant='body1'
                            >
                                {`${uploadResponse?.data[`upload${template}`].totalFailure} rows failed.`}
                            </Typography>
                            {uploadResponse?.data[`upload${template}`].errorExcel !== "" && 
                            <div style={{ margin: '1em 0px' }}>
                                <Link
                                    className={`${classes.modalTypography} ${classes.errorLink}`}
                                    onClick={handleDownloadErrorFile}
                                >
                                    Download Error File
                                </Link>

                                <IconButton
                                    onClick={handleDownloadErrorFile}
                                    >
                                    <SvgIcon>
                                        <path
                                            d='M17.5 13.75V17.5H2.5V13.75H0V17.5C0 18.875 1.125 20 2.5 20H17.5C18.875 20 20 18.875 20 17.5V13.75H17.5ZM16.25 8.75L14.4875 6.9875L11.25 10.2125V0H8.75V10.2125L5.5125 6.9875L3.75 8.75L10 15L16.25 8.75Z'
                                            fill={omouBlue}
                                        />
                                    </SvgIcon>
                                </IconButton>
                            </div>
                                }
                            <Grid
                                className={classes.bottomNav}
                                style={{ textAlign: 'right', marginTop: '2em' }}
                                item
                                xs={12}
                            >
                                <ResponsiveButton
                                    style={{ border: 'none' }}
                                    
                                    variant='outlined'
                                    
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

BulkUploadModal.propTypes = {
    closeModal: PropTypes.func
};

export default BulkUploadModal;

