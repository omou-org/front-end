import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import React from 'react';
import { TableHeadSecondary } from './TableHeadSecondary';

const TableDemo = () => {
    let tableRow = (
        <TableRow>
            <TableCell>Text</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Text</TableCell>
        </TableRow>
    );

    let tableBody = (
        <TableBody>
            {tableRow}
            {tableRow}
            {tableRow}
            {tableRow}
        </TableBody>
    );

    return (
        <Box>
            <Typography variant='h3'>Primary Table</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Heading</TableCell>
                        <TableCell>Heading</TableCell>
                        <TableCell>Heading</TableCell>
                        <TableCell>Heading</TableCell>
                        <TableCell>Heading</TableCell>
                    </TableRow>
                </TableHead>
                {tableBody}
            </Table>
            <Typography variant='h3' style={{ marginTop: '40px' }}>
                Secondary Table
            </Typography>
            <Table>
                <TableHeadSecondary>
                    <TableRow>
                        <TableCell>Heading</TableCell>
                        <TableCell>Heading</TableCell>
                        <TableCell>Heading</TableCell>
                        <TableCell>Heading</TableCell>
                        <TableCell>Heading</TableCell>
                    </TableRow>
                </TableHeadSecondary>
                {tableBody}
            </Table>
        </Box>
    );
};

export default TableDemo;
