import React from "react";

import Chip from "@material-ui/core/Chip";
import theme from "../../../theme/muiTheme";
import { makeStyles } from "@material-ui/core";

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
    }
    
    return minWidth;
}

const useStyles = makeStyles(theme => ({
    positive: {
        backgroundColor: theme.colors.statusGreen
    },
    warning: {
        backgroundColor: theme.colors.statusYellow
    },
    negative: {

        backgroundColor: theme.colors.statusRed
    },
    active: {
        backgroundColor: theme.colors.statusGreen
    },
    past: {
        backgroundColor: theme.colors.gloom
    },
    new: {
        backgroundColor: theme.colors.omouBlue
    },
    informationContained: {
        backgroundColor: theme.colors.darkBlue
    },
    informationOutline: {
        backgroundColor: theme.colors.white,
        color: theme.colors.buttonBlue,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: theme.colors.buttonBlue
    },
    userType: {
        backgroundColor: theme.colors.white
    },
    round: {
        width: "24px",
        borderRadius: "25%"
    }
}))

/**
 * 
 * 
 * const useStyles = makeStyles(theme => ({
    root: props => ({
      backgroundColor: props.backgroundColor,
      color: theme.color,
    }),
  })); 
 */

const Badge = ({type, isRound, ...rest}) => {
    const classes = useStyles(theme);

    return <Chip className={classes[type]} {...rest}/>
}

export default Badge;
//LabelBadge.propTypes

/**
 * 
 * Expected prop list
 * type = user, status, round
 * label = text on badge
 * 
 * 
 * 
 */