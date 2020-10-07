/* eslint-disable indent */

import React, { useEffect, useState, useMemo, useCallback} from "react";
import { useSelector } from "react-redux";

import { format } from 'date-fns';
import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import momentTimezone from "moment-timezone";
import moment from "moment";
import Navigation from "./components/Navigation/Navigation";
import { makeStyles } from '@material-ui/core/styles';

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
<<<<<<< HEAD
					{ authUser.user && <IdleLogout /> }

					<MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
						<div className="App">
							<CssBaseline/>
							<Navigation/>
						</div>
					</MuiPickersUtilsProvider>
=======
								{
				authUser.user && <IdleLogout />
			}

						<MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
								<div className="App">
										<CssBaseline/>
										<Navigation/>
								</div>
						</MuiPickersUtilsProvider>
>>>>>>> 390263c8d8968ab3c43a6067ca54948ac73579eb
				</div>
		)};

export default App;
