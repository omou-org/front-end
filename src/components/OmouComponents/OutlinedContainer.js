import React from 'react';
import {outlineGrey} from '../../theme/muiTheme';
import PropTypes from "prop-types";

function OutlinedContainer({children, ...rest}) {
    return (
        <div
            style={{
                border: 'solid 1px ' + outlineGrey,
                borderRadius: '10px',
                padding: '3%',
                ...rest?.styles,
            }}
            {...rest}
        >
            {children}
        </div>
    );
}

OutlinedContainer.propTypes = {
    children: PropTypes.any,
};

export default OutlinedContainer;
