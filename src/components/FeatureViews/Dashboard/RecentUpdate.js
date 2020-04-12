import React from 'react';
import {useSelector} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import './Dashboard.scss';

const RecentUpdate = () => {
    const accountSearchResult = useSelector(({Search}) => Search.accounts) || [];
    const accountArray = Object.values(accountSearchResult);
    console.log(accountArray);

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
