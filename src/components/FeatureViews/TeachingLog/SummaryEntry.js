import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from "prop-types";

function SummaryEntry({title, hours, grade}) {
    return (
        <TableRow>
            <TableCell>
                {title} -{' '}
                <span style={{fontStyle: 'italic', fontWeight: 300}}>
                    {grade}
                </span>
            </TableCell>
            <TableCell>{hours}</TableCell>
        </TableRow>
    );
}

SummaryEntry.propTypes = {
    title: PropTypes.string,
    hours: PropTypes.string,
    grade: PropTypes.string,
};

export default SummaryEntry;
