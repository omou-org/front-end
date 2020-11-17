import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";

import { OmouTable, OmouTableBody, OmouTableCell, OmouTableHead, OmouTableRow } from "./OmouTable"; 


const TableDemo = () => {

    let tableRow = (
    <OmouTableRow>
        <OmouTableCell>Text</OmouTableCell>
        <OmouTableCell>Text</OmouTableCell>
        <OmouTableCell>Text</OmouTableCell>
        <OmouTableCell>Text</OmouTableCell>
        <OmouTableCell>Text</OmouTableCell>
    </OmouTableRow>)

    return (
    <OmouTable>
        <OmouTableHead>
            <OmouTableRow>
                <OmouTableCell>Heading</OmouTableCell>
                <OmouTableCell>Heading</OmouTableCell>
                <OmouTableCell>Heading</OmouTableCell>
                <OmouTableCell>Heading</OmouTableCell>
                <OmouTableCell>Heading</OmouTableCell>
            </OmouTableRow>
        </OmouTableHead>
        <OmouTableBody>
            {tableRow}
            {tableRow}
            {tableRow}
            {tableRow}
            
        </OmouTableBody>
    </OmouTable>)
}

export default TableDemo;