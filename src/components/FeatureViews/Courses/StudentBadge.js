import React from "react";
import { Box, makeStyles, MenuItem, Typography } from "@material-ui/core";
import {stringToColor} from "../Accounts/accountUtils";

const useStyles = makeStyles(() => ({
    colorIcon: {
        height: "24px",
        width: "24px",
        borderRadius: "12px",
        marginRight: "24px",
    },
    courseLabel: {
        display:"flex",
        margin:"12px",
    },
    labelText: {
        paddingTop:"3px"
    }
}))

export const UserAvatarCircle = ({label}) => {

    const classes = useStyles();
    const backgroundColor = stringToColor(label);
    return (
        <div 
            className={classes.colorIcon}
            style={{backgroundColor}}
        ></div>
    )
}

export const StudentCourseLabel = ({label}) => {

    const classes = useStyles();
    return (
        <Box className={classes.courseLabel}>
            <UserAvatarCircle label={label}/>
            <Typography className={classes.labelText} variant="body">{label}</Typography>
        </Box>
    )
}