import React from "react";

import Chip from "@material-ui/core/Chip";
import theme from "../../../theme/muiTheme"
import { makeStyles } from "@material-ui/core";

const calculateWidth = (label, type) => {

}

const useStyles = makeStyles(theme => ({
    status: {

    },
    positive: {

    },
    warning: {
        
    },
    negative: {

    },
    active: {

    },
    past: {

    },
    new: {

    },
    user: {

    },
    type: {

    },
    informationContained: {

    },
    informationOutline: {

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

const Badge = (props) => {
    const classes = useStyles(theme);
    console.log(classes);

    return <Chip className={classes.warning} {...props}/>
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
 */