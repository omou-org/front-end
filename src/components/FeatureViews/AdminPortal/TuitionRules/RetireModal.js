import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
    white,
    omouBlue,
    darkGrey,
    highlightColor,
    // h6,
    goth,
    // gloom,
} from '../../../../theme/muiTheme';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';

const useStyles = makeStyles({
    modalStyle: {
        top: '50%',
        left: `50%`,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        width: '31rem',
        height: '16rem',
        background: white,
        boxShadow: '0px 0px 8px rgba(153, 153, 153, 0.8);',
        borderRadius: '5px',
    },
    modalTypography: {
        marginBottom: '1rem',
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
    verticalMargin: {
        marginTop: '1rem',
    },
});

const RetireModal = ({ closeModal }) => {
    const classes = useStyles();
    return (
        <Grid container className={classes.modalStyle}>
            <Grid item style={{ padding: '2rem' }} xs={12}>
                <Typography className={classes.modalTypography} variant='h3'>
                    Retire rule?
                </Typography>

                <Typography
                    align='left'
                    style={{ marginBottom: '1.5rem' }}
                    variant='h6'
                >
                    When you retire this rule, instructors assigned to this rule
                    will be assigned to the default All Instructor rule at $___
                    per hour.
                    <strong>
                        {' '}
                        This update will be applied to new invoices for both
                        existing and new students enrolled with this tuition
                        rule.
                    </strong>
                </Typography>

                <Grid style={{ textAlign: 'right' }} item xs={12}>
                    <ResponsiveButton
                        style={{ border: 'none', color: darkGrey }}
                        variant='outlined'
                        onClick={closeModal}
                    >
                        cancel
                    </ResponsiveButton>
                    <ResponsiveButton
                        variant='outlined'
                        style={{
                            border: 'none',
                            background: white,
                        }}
                        onClick={closeModal}
                    >
                        retire
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

RetireModal.propTypes = {
    closeModal: PropTypes.func,
};

export default RetireModal;
