import React from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import moment from "moment-timezone";
import Navigation from "./components/Navigation/Navigation";

import "./theme/theme.scss";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

Moment.globalMoment = moment;
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
