import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

export const OmouTable = ({children}) => {
    return (
        <Table>
            {children}
        </Table>
    )
}

export const OmouTableHead = ({children}) => {
    return (
        <TableHead>
            {children}
        </TableHead>
    )
}

export const OmouTableBody = ({children}) => {
    return (
        <TableBody>
            {children}
        </TableBody>
    )
}

export const OmouTableRow = ({children}) => {
    return (
        <TableRow>
            {children}
        </TableRow>
    )
}

export const OmouTableCell = ({children}) => {
    return (
        <TableCell>
            {children}
        </TableCell>
    )
}