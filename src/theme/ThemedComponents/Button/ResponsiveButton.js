import React from 'react'
import { PropTypes } from 'prop-types';
import Button from "@material-ui/core/Button";

const buttonWidth = (label, children) => {
    const buttonText = label || children;
    let buttonWidth;
       if (buttonText.length < 6) {
           buttonWidth = 88;
       } else if (buttonText.length >= 7 && buttonText.length <= 10) {
           buttonWidth = 112;
       } else if (buttonText.length >= 11 && buttonText.lenght <= 16) {
           buttonWidth = 144;
       } else if (buttonText.length >= 17) {
           buttonWidth = 160;
       }
       return buttonWidth;;
   };

/* 
Using icons: 
import the icon in your component.
To have it on the left of label, pass through startIcon. Example: startIcon={<Icon />}
To have it on the right of label, pass through endIcon. Example: endIcon={<Icon />}

ResponsiveButtonProps: variant, label, component, to, disabled, startIcon, endIcon, onClick
*/

export const ResponsiveButton = ({ label, children, disabled, startIcon, endIcon, ...ResponsiveButtonProps}) => {
    const buttonText = label || children
    return (
        <Button
            style={{
                width: startIcon || endIcon ? buttonWidth(buttonText) + 16 : buttonWidth(buttonText),
                border: disabled ? "2px solid #DBD7D7" : "",
            }}
            size='large'
            disabled={disabled}
            startIcon={startIcon}
            endIcon={endIcon}
            {...ResponsiveButtonProps}
            >
                {buttonText}
        </Button>
    )
}

ResponsiveButton.propTypes = {
    variant: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
    startIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]),
    endIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]),
    component: PropTypes.elementType,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}