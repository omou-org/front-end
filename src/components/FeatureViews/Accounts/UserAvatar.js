import React, {useMemo} from "react";
import PropTypes from "prop-types";

import Avatar from "@material-ui/core/Avatar";

import "./Accounts.scss";
import {stringToColor} from "./accountUtils";


const UserAvatar = ({name, size = 40, fontSize = size * 0.8, margin = 0, style}) => {
    const avatarStyles = useMemo(() => ({
        "backgroundColor": stringToColor(name),
        fontSize,
        "height": size,
        margin,
        "width": size,
        ...style,
    }), [name, size, fontSize, margin, style]);

    return (
        <Avatar
            className="avatar"
            style={avatarStyles}>
            {name.match(/\b\w/ug).join("")}
        </Avatar>
    );
};

UserAvatar.propTypes = {
    "fontSize": PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    "margin": PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    "name": PropTypes.string.isRequired,
    "size": PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    "style": PropTypes.object,
};

export default UserAvatar;
