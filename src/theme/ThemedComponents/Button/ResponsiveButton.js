import React from 'react'
import { PropTypes } from 'prop-types';
import Button from "@material-ui/core/Button";

const buttonWidth = (label) => {
    let buttonWidth;
       if (label.length < 6) {
           buttonWidth = 88;
       } else if (label.length >= 7 && label.length <= 10) {
           buttonWidth = 112;
       } else if (label.length >= 11 && label.lenght <= 16) {
           buttonWidth = 144;
       } else if (label.length >= 17) {
           buttonWidth = 160;
       }
       return buttonWidth;;
   };

/* 
Using icons: 
import the icon in your component.
To have it on the left of label, pass through startIcon. Example: startIcon={<Icon />}
To have it on the right of label, pass through endIcon. Example: endIcon={<Icon />}

ResponsiveButtonProps: variant, label, component, to, disabled, startIcon, endIcon
*/

export const ResponsiveButton = ({ label, disabled, startIcon, endIcon, ...ResponsiveButtonProps}) => {
    return (
        <Button
        style={{
            width: startIcon || endIcon ? buttonWidth(label) + 16 : buttonWidth(label),
            border: disabled ? "2px solid #DBD7D7" : ""
        }}
        disabled={disabled}
        startIcon={startIcon}
        endIcon={endIcon}
        {...ResponsiveButtonProps}
        >
            {label}
        </Button>
    )
}

ResponsiveButton.propTypes = {
    label: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
    startIcon: PropTypes.elementType,
    endIcon: PropTypes.elementType,
    component: PropTypes.elementType,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}