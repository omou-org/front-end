/* eslint-disable indent */

import React from "react";
import {useSelector} from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import momentTimezone from "moment-timezone";
import moment from "moment";
import NavigationContainer from "./components/Navigation/NavigationContainer";

import "./theme/theme.scss";
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import MomentUtils from "@date-io/moment";

import IdleLogout from "./components/OmouComponents/IdleLogout";


Moment.globalMoment = momentTimezone;
Moment.globalTimezone = "America/Los_Angeles";



const App = () => {
	const authUser = useSelector(({ auth }) => auth);
		return (
				<div>
					{ authUser.user && <IdleLogout /> }

					<MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
						<div className="App">
							<CssBaseline/>
							<NavigationContainer/>
						</div>
					</MuiPickersUtilsProvider>
				</div>
		)};

export default App;
