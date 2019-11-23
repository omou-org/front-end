import "../../../theme/theme.scss";
import Paper from "@material-ui/core/Paper";
import React from "react";
import RegistrationLanding from "./RegistrationLanding";
import RegistrationUserActions from "./RegistrationActions";

const Registration = () => (
    <>
        <Paper className="paper">
            <RegistrationUserActions />
        </Paper>
        <RegistrationLanding />
    </>
);

export default Registration;
