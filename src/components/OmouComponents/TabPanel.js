import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
// import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';

export default function TabPanel(props) {
    const { children, value, index, backgroundColor, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Paper
                        elevation={0}
                        style={{ backgroundColor: backgroundColor }}
                    >
                        {children}
                    </Paper>
                    {/* <Typography>{children}</Typography> */}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
