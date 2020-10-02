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

export const ResponsiveButton = ({ label, variant, disabled, icon}) => {
    return (
        <Button
        style={{
            width: buttonWidth(label),
            border: disabled ? "2px solid #DBD7D7" : ""
        }}
        variant={variant}
        disabled={disabled}
        >
        {/* {hasIcon && label === 'back' 
        ? <Grid container>
			<BackArrow style={{transform: 'scale(0.6)'}} />
        </Grid> 
        : hasIcon && label !== 'back'
        ? <Grid container>
            <AddIcon style={{transform: 'scale(0.7)'}} />
        </Grid> :
        null
        } */}
            {label}
        </Button>
    )
}

ResponsiveButton.propTypes = {
    label: PropTypes.string.isRequired,
    variant: PropTypes.string,
}