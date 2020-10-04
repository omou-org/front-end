import React from 'react'
import theme from '../../muiTheme';
import { PropTypes } from 'prop-types';
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import BackArrow from '@material-ui/icons/ArrowBackIos';
import AddIcon from '@material-ui/icons/Add';

const buttonWidth = (label) => {
    let buttonWidth;
       if (label.length < 6) {
           buttonWidth = 88
       } else if (label.length >= 7 && label.length <= 10) {
           buttonWidth = 112
       } else if (label.length >= 11) {
           buttonWidth = 144
       }
       return buttonWidth;
   };

export const ThemeButton = ({ label, variant, disabled, hasIcon}) => {
    return (
        <Button
        style={{width: buttonWidth(label)}}
        variant={variant}
        disabled = {disabled ? true : undefined}
        >
            {hasIcon && label === 'back' 
            ? <Grid container>
				<BackArrow style={{transform: 'scale(0.6)'}} />
            </Grid> 
            : hasIcon && label === 'register'
            ? <Grid container>
                <AddIcon style={{transform: 'scale(0.7)'}} />
            </Grid> :
            null
            }

            {label}
        </Button>
    )
}

ThemeButton.propTypes = {
    label: PropTypes.string.isRequired,
    variant: PropTypes.string,
}