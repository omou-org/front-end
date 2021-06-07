import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { omouBlue } from '../../theme/muiTheme';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        border: `1px solid ${omouBlue}`,
        height: '32px',
        borderRadius: '20px',
        color: `${omouBlue}`,
    },
}));

export function TablePagination(props) {
    const classes = useStyles();
    const theme = useTheme();
    const { totalPages, page, onChangePage, isGraphqlPage } = props;

    const handleBackButtonClick = () => onChangePage(page - 1);

    const handleNextButtonClick = () => onChangePage(page + 1);

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label='previous page'
                style={{ color: omouBlue }}
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <div style={{ paddingTop: '3pt' }}>
                {isGraphqlPage
                    ? `${page} OF ${totalPages}`
                    : `${page + 1} OF ${totalPages}`}
            </div>

            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= totalPages}
                aria-label='next page'
                style={{ color: omouBlue }}
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
        </div>
    );
}

TablePagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    isGraphqlPage: PropTypes.bool.isRequired,
};
