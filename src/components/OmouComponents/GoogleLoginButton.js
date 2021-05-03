import { makeStyles } from '@material-ui/core';
import React from 'react';
import google_logo from '../Google__G__Logo.svg.webp';
import { GoogleLoginButtonStyles } from '../../theme/muiTheme';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    ...GoogleLoginButtonStyles,
}));

const GoogleLoginButton = ({ onClick }) => {
    const classes = useStyles();

    return (
        <div className={classes.root} onClick={onClick}>
            <div className={classes.logoBackground}>
                <img src={google_logo} width='16px' height='16px' />
            </div>
            <div className={classes.buttonText}>SIGN IN WITH GOOGLE</div>
        </div>
    );
};

GoogleLoginButton.propTypes = {
    onClick: PropTypes.func,
};

export default GoogleLoginButton;
