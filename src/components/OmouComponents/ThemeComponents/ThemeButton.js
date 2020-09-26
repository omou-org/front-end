import React from 'react'
import theme from '../../../theme/muiTheme';
import { PropTypes } from 'prop-types';
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles(label => ({
//     root: {
//         width: buttonWidth(label)
//     },
//   }));

const buttonWidth = (label) => {
    let buttonWidth;
       if (label.length < 6) {
           buttonWidth = 88
       } else if (label.length >= 7 && label.length <= 10) {
           buttonWidth = 112
       } else if (label.length >= 11 && label.length <= 16) {
           buttonWidth = 144
       }
       console.log(buttonWidth)
       return buttonWidth;
   };

export const ThemeButton = ({ label, variant, }) => {
    // const classes= useStyles(label);
    return (
        <Button
        style={{width: buttonWidth(label)}}
        // className={classes.root}
        variant={variant}>
            {label}
        </Button>
    )
}

ThemeButton.propTypes = {
    label: PropTypes.string.isRequired,
}