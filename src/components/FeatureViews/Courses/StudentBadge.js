import React from "react";
import { makeStyles, MenuItem, Typography } from "@material-ui/core";
import {stringToColor} from "../Accounts/accountUtils";

const useStyles = makeStyles(() => ({
    colorIcon: {
        height: "24px",
        width: "24px",
        borderRadius: "12px",
        marginRight: "24px",
    }
}))

export const StudentBadge = ({label}) => {

    const classes = useStyles();
    const backgroundColor = stringToColor(label);
    return (
        <div 
            className={classes.colorIcon}
            style={{backgroundColor}}
        ></div>
    )
            
}