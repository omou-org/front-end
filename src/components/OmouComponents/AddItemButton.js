import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { PropTypes } from 'prop-types';
import {defaultBoxShadow} from '../../theme/muiTheme'

const useStyles = makeStyles({
    addNewItemStyles: ({ height, width }) => ({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        cursor: 'pointer',
        height: height,
        width: width,
        color: '#999999',
        background: '#F5F5F5',
        border: '1.5px dashed #999999',
        borderRadius: '5px',
        boxSizing: 'border-box',
        boxShadow: defaultBoxShadow,
    }),
});

export const AddItemButton = ({ children, ...buttonComponentProps }) => {
    const { addNewItemStyles } = useStyles({ ...buttonComponentProps });
    return (
        // When passing in a component prop here, it'll ignore height and width unless a div is placed within the Box here.
        <Box {...buttonComponentProps} data-cy='AddItemButton'>
            <div className={addNewItemStyles}>{children}</div>
        </Box>
    );
};

AddItemButton.propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
