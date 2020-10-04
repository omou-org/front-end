import React from "react";

import Chip from "@material-ui/core/Chip";
import theme from "../../muiTheme";
import { makeStyles, Typography } from "@material-ui/core";

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

const OmouBadge = ({label, type, ...rest}) => {
    return <Chip 
                label={<Typography component="body1">{label}</Typography>} 
                {...rest}/>
}

export const LabelBadge = ({label, type, ...rest}) => {
    const classes = useStyles(theme);

    const badgeType = {
        "userType": {},
        "information": {
            labelComponent: "body1",
            labelColor: "white"
        },
        "list": {
            badgeMinWidth: "72px",
            labelComponent: "body2",
            labelColor: "white" //Will replace once Palette is ready 
        }
    }

    const badgeStyle = badgeType[type];

    return <Chip 
                style={{minWidth: "96px"}}
                label={<Typography 
                                variant={badgeStyle.labelComponent}
                                style={{color: badgeStyle.labelColor}}
                        >
                            {label}
                        </Typography>} 
                {...rest}/>
}


//LabelBadge.propTypes

const StatusBadge = () => {
    return 
}

// export const LabelBadge = ({label, type, ...rest}) => {
//     const classes = useStyles(theme);

//     const badgeType = {
//         "default": {},
//         "table": {},
//         "list": {
//             badgeMinWidth: "72px",
//             labelComponent: "body2",
//             labelColor: "white" //Will replace once Palette is ready 
//         },
//         "round": {}
//     }

//     const badgeStyle = badgeType[type];

//     return <Chip 
//                 style={{minWidth: badgeStyle.badgeMinWidth}}
//                 label={<Typography 
//                                 variant={badgeStyle.labelComponent}
//                                 style={{color: badgeStyle.labelColor}}
//                         >
//                             {label}
//                         </Typography>} 
//                 {...rest}/>
// }

/**
 * classes[type]
 * Expected prop list
 * type = default, tables, lists, round
 * label = text on badge
 * variant (outlined or not)
 * 
 * 
 * 
 */