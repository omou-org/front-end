import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import Link from '@material-ui/core/Link';
import SvgIcon from '@material-ui/core/SvgIcon';
import PropTypes from 'prop-types';
import {white, omouBlue} from '../../../theme/muiTheme';

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
    bottomNav: {
        width: '100%',
        position: 'fixed',
        bottom: '19px',
        right: '30px',
    },

});


const UploadedResultsStep = ({
    uploadedResponse,
    selectedItem,
    closeModal,
    handleDownloadErrorFile,

}) => {
    const classes = useStyles();
    const totalSuccess =  uploadedResponse?.data[`upload${selectedItem}`].totalSuccess;
    const totalFailure =  uploadedResponse?.data[`upload${selectedItem}`].totalFailure;

    return (
        <Grid container className={classes.modalStyle}>
            <Grid item style={{ padding: '2em' }} xs={12}>
                <Typography
                    className={classes.modalTypography}
                    variant='h3'
                >
                    Upload Results
                </Typography>

                <Typography
                    align='left'
                    className={classes.modalTypography}
                    variant='body1'
                >
                    {`${totalSuccess} rows uploaded successfully.`}
                </Typography>

                <Typography
                    align='left'
                    className={classes.modalTypography}
                    variant='body1'
                >
                    {`${totalFailure} rows failed.`}
                </Typography>
                {uploadedResponse?.data[`upload${selectedItem}`]
                    .errorExcel !== '' && (
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
                )}
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
};

export default UploadedResultsStep;

UploadedResultsStep.propTypes = {
    uploadedResponse : PropTypes.func,
    closeModal: PropTypes.func,
    handleDownloadErrorFile : PropTypes.func,
    selectedItem: PropTypes.string
};