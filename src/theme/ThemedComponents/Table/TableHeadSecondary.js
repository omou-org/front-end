import React from 'react';
import { TableHead } from '@material-ui/core';
import theme from '../../muiTheme';
import PropTypes from 'prop-types';

export const TableHeadSecondary = ({ children, rest }) => {
    return (
        <TableHead style={theme.overrides.TableHeadSecondary} {...rest}>
            {children}
        </TableHead>
    );
};

TableHeadSecondary.propTypes = {
    children: PropTypes.any,
    rest: PropTypes.any,
};
