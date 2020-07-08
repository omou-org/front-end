import React, {useMemo} from "react";
import PropTypes from "prop-types";

import Avatar from "@material-ui/core/Avatar";

import "./Accounts.scss";
import {stringToColor} from "./accountUtils";


const UserAvatar = ({name, size = 40, fontSize = size * 0.8, margin = 0}) => {
    const style = useMemo(() => ({
        "backgroundColor": stringToColor(name),
        fontSize,
        "height": size,
        margin,
        "width": size,
    }), [name, size, fontSize, margin]);

    return (
        <Avatar
            className="avatar"
            style={style}>
            {name.match(/\b\w/ug).join("")}
        </Avatar>
    );
};

UserAvatar.propTypes = {
    "fontSize": PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    "margin": PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    "name": PropTypes.string.isRequired,
    "size": PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default UserAvatar;
