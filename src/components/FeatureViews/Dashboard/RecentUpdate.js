import React from 'react'
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import './Dashboard.scss';

const RecentUpdate = () => {
    return( 
        <Paper className="Paper">
            <Typography>
                Recently Updated Accounts
            </Typography>
            <br/>
        </Paper>
        )
};

export default RecentUpdate;
