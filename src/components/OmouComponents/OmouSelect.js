/**
 * @description Custom Omou Select compoenent, Material-UI select custom style wrapper
 * @param {string} selectedItem supplied by the parent
 * @param {function} handleSelectChange updates state of selected item in parent
 * @param {object} children Menu Item compoenents passed
 *
 */

import React, { useState } from 'react';
import { Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { white, omouBlue } from '../../theme/muiTheme';
import SvgIcon from '@material-ui/core/SvgIcon';
import PropTypes from 'prop-types';
const useStyles = makeStyles({
    selectDisplay: {
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        width: '13.375em',
        padding: '0.5em 3em 0.5em 1em',
    },
});

const OmouSelect = ({ selectedItem, handleSelectChange, children }) => {
    const classes = useStyles();
    const [dropDown, setDropDown] = useState();

    const handleDropDown = () =>
        dropDown === 'rotate(0deg)'
            ? setDropDown('rotate(180deg)')
            : setDropDown('rotate(0deg)');

    return (
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
            value={selectedItem}
            displayEmpty
            onChange={handleSelectChange}
        >
            {children}
        </Select>
    );
};

export default OmouSelect;

OmouSelect.propTypes = {
    selectedItem: PropTypes.string.isRequired,
    handleSelectChange: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
};
