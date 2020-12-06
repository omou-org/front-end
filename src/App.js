import React from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import momentTimezone from "moment-timezone";
import moment from "moment";
import Navigation from "./components/Navigation/Navigation";

import "./theme/theme.scss";
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import MomentUtils from "@date-io/moment";

Moment.globalMoment = momentTimezone;
Moment.globalTimezone = "America/Los_Angeles";

const App = () => (
    <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
        <div className="App">
            <CssBaseline/>
            <Navigation/>
        </div>
    </MuiPickersUtilsProvider>
);

export default App;