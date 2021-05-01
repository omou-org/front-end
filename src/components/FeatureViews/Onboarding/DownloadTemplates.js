import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import PeopleIcon from '@material-ui/icons/People';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Icon: {
        border: '2px solid #28ABD5',
        borderRadius: '8px',
        color: '#28ABD5',
        margin: '20px',
    },
    Label: {
        display: 'inline',
    },
}));

const DownloadTemplates = () => {
    const classes = useStyles();

    return (
        <>
            <h1 className={classes.test}>Download Templates</h1>
            <IconButton
                iconStyle={classes.Icon}
                className={classes.Icon}
                aria-label='Accounts Template'
            >
                <PeopleIcon style={{ fontSize: '750%' }} />
                <div className={classes.Label}>Accounts Template</div>
            </IconButton>
            <IconButton
                iconStyle={classes.Icon}
                className={classes.Icon}
                aria-label='Accounts Template'
            >
                <MenuBookIcon style={{ fontSize: '750%' }} />
                <div className={classes.Label}>Courses Template</div>
            </IconButton>
        </>
    );
};

export default DownloadTemplates;
