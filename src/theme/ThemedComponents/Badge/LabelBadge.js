import React from "react";

import Chip from "@material-ui/core/Chip";
import theme from "../../muiTheme";
import { makeStyles, Typography } from "@material-ui/core";

const calculateWidth = (label, type, isRound = false) => {
    let minWidth;
    if (isRound) {
        return "24px";
    } else if (type === "informationContained" ||
               type === "informationOutline" ||
               type === "userType") {
        minWidth = 96;
    } else {
        minWidth = 72;
        if (label.length > 7) {
            minWidth += Math.ceil(((label.length - 7) / 2)) * 8;
        }
    }
    
    return minWidth;
}

const useStyles = makeStyles(({colors}) => ({
    positive: {
        backgroundColor: colors.statusGreen
    },
    warning: {
        backgroundColor: colors.statusYellow
    },
    negative: {

        backgroundColor: colors.statusRed
    },
    active: {
        backgroundColor: colors.statusGreen
    },
    past: {
        backgroundColor: colors.gloom
    },
    new: {
        backgroundColor: colors.omouBlue
    },
    informationContained: {
        backgroundColor: colors.darkBlue,
        color: colors.white
    },
    informationOutline: {
        backgroundColor: colors.white,
        color: colors.buttonBlue,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: colors.buttonBlue
    },
    userType: {
        backgroundColor: colors.white
    },
    round: {
        width: "24px",
        borderRadius: "12px",
        
    }
}))

/**
 * 
 * 
 * const useStyles = makeStyles(theme => ({
    root: props => ({
      backgroundColor: props.backgroundColor,
      color: color,
    }),
  })); 
 */

const LabelBadge = ({label, type, isRound, ...rest}) => {
    const classes = useStyles(theme);

    return <Chip 
                label={<Typography component="body1">{label}</Typography>} 
                className={`${classes[type]} ${isRound ? classes.round : ""}`} 
                style={{width:calculateWidth(label, type, isRound)}} 
                {...rest}/>
}

export default LabelBadge;
//LabelBadge.propTypes

/**
 * classes[type]
 * Expected prop list
 * type = user, status, round
 * label = text on badge
 * 
 * 
 * 
 */