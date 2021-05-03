import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import './SnackBarComponent.scss';

export const SnackBarComponent = ({
    snackBarData,
    snackBarState,
    setSnackBarState,
}) => {

    return (
        <CSSTransition
            in={snackBarState}
            timeout={300}
            classNames='omou-snackbar'
            unmountOnExit
            onExited={() => setSnackBarState(false)}
        >
            <Grid
                item
                style={{ border: '2px solid rgba(153, 153, 153, 0.15)', float: 'left', marginTop: '2.125em' }}
                xs={4}
            >
                <Grid
                    container
                    direction='row'
                    alignItems='center'
                    style={{
                        marginTop: '1em',
                        marginLeft: '.75em',
                        marginBottom: '1.175em',
                    }}
                >
                    <Grid item xs={1} alignContent='flex-end'>
                        {snackBarData.icon}
                    </Grid>
                    <Grid item xs={9}>
                        <Typography
                            variant='h5'
                            style={{
                                color: snackBarData.messageColor,
                                fontWeight: 500,
                                letterSpacing: '0.02em',
                            }}
                            align='left'
                        >
                            {snackBarData.title}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    style={{
                        marginBottom: '.5em',
                        marginLeft: '.75em',
                        lineHeight: '1.425em',
                    }}
                >
                    <Typography variant='body1' align='left'>
                        {snackBarData.date}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    style={{
                        marginBottom: '1.5em',
                        marginLeft: '.75em',
                        fontStyle: 'italic',
                        lineHeight: '1.425em',
                    }}
                >
                    <Typography variant='body1' align='left'>
                        {snackBarData?.message || null}
                    </Typography>
                </Grid>
            </Grid>
        </CSSTransition>
    );
};

SnackBarComponent.propTypes = {
    snackBarData: PropTypes.object,
    snackBarState: PropTypes.object,
    setSnackBarState: PropTypes.func.isRequired
  };
