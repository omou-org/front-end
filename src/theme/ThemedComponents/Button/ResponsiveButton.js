import React from 'react'
import { PropTypes } from 'prop-types';
import Button from "@material-ui/core/Button";

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

/* To utilize an icon in this button, import the icon in your component and pass it in through the startIcon prop to have it 
on the left of the label and endIcon to have it on the right. Example: startIcon={<AddIcon />}
*/

export const ResponsiveButton = ({ label, variant, disabled, startIcon, endIcon}) => {
    return (
        <Button
        style={{
            width: buttonWidth(label),
            border: disabled ? "2px solid #DBD7D7" : ""
        }}
        variant={variant}
        disabled={disabled}
        startIcon={startIcon}
        endIcon={endIcon}
        >
            {label}
        </Button>
    )
}

ResponsiveButton.propTypes = {
    label: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired
}