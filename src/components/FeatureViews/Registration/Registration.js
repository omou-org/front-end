import "../../../theme/theme.scss";
import React from "react";
import RegistrationLanding from "./RegistrationLanding";
import Zoom from "@material-ui/core/Zoom";

const Registration = () => {
    return <div>
        <Zoom>
            <RegistrationLanding />
        </Zoom>
    </div>;
};

export default Registration;
