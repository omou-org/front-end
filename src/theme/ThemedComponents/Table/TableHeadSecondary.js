import React from 'react';
import { TableHead } from '@material-ui/core';
import theme from '../../muiTheme';

export const TableHeadSecondary = ({ children, rest }) => {
    return (
        <TableHead style={theme.overrides.TableHeadSecondary} {...rest}>
            {children}
        </TableHead>
    );
};
