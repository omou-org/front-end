import React from "react";
import PropTypes from "prop-types";

import Chip from "@material-ui/core/Chip";

import "./Accounts.scss";
import {capitalizeString} from "utils";

const RoleChip = ({role}) => (
    <Chip
        className={`userLabel ${role}`}
        label={capitalizeString(role)} />
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
