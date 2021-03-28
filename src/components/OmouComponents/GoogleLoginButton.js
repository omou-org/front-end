import { makeStyles } from '@material-ui/core';
import React from 'react';
import google_logo from '../Google__G__Logo.svg.webp';
import { GoogleLoginButtonStyles } from '../../theme/muiTheme';

const useStyles = makeStyles(() => ({
    ...GoogleLoginButtonStyles
}));

export const GoogleLoginButton = () => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.logoBackground}>
                <img src={google_logo} width='16px' height='16px'/>
            </div>
            <div className={classes.buttonText}>
                SIGN IN WITH GOOGLE
            </div>
        </div>
    )
}