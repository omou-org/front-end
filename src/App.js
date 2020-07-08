import React from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import moment from "moment-timezone";
import Navigation from "./components/Navigation/Navigation";

import "./theme/theme.scss";

Moment.globalMoment = moment;
Moment.globalTimezone = "America/Los_Angeles";

const App = () => (
    <div className="App">
        <CssBaseline />
        <Navigation />
    </div>
);

export default App;
