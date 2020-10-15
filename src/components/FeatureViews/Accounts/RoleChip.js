import React from "react";
import PropTypes from "prop-types";

import Chip from "@material-ui/core/Chip";

import "./Accounts.scss";
import { capitalizeString } from "utils";

const clipColor = {
    "INSTRUCTOR": "#1FA18A",
    "STUDENT": "#37ABFF",
    "PARENT": "#812CD7",
    "OWNER": "#D04E3D",
    "RECEPTIONIST": "#D04E3D",
    "ASSISTANT": "#D04E3D"
}

console.log(clipColor["INSTRUCTOR"])

const RoleChip = ({ role }) => (
    <Chip
        className={`userLabel ${role}`}
        label={capitalizeString(role)}
        style={{ backgroundColor: clipColor[role] }}
    />
);

RoleChip.propTypes = {
    "role": PropTypes.oneOf([
        "student",
        "parent",
        "instructor",
        "receptionist",
    ]),
};

export default RoleChip;
