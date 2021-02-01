import React from 'react';
import Paper from '@material-ui/core/Paper';

export default function BackgroundPaper({ children, ...rest }) {
    return (
        <Paper style={{ padding: '3%', ...rest?.styles }} {...rest}>
            {children}
        </Paper>
    );
}
