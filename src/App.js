/* eslint-disable indent */

import React, { useEffect, useState, useMemo} from "react";
import { format } from 'date-fns';
import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import momentTimezone from "moment-timezone";
import moment from "moment";
import Navigation from "./components/Navigation/Navigation";
import { Modal } from '@material-ui/core';

import "./theme/theme.scss";
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import MomentUtils from "@date-io/moment";
import {useIdleTimer} from 'react-idle-timer';

Moment.globalMoment = momentTimezone;
Moment.globalTimezone = "America/Los_Angeles";



const App = () => {
		const timeout = 3000;
		const [remaining, setRemaining] = useState(timeout);
		const [elapsed, setElapsed] = useState(0);
		const [lastActive, setLastActive] = useState(+new Date());
		const [isIdle, setIsIdle] = useState(false);

		const handleOnActive = () => setIsIdle(false);
		const handleOnIdle = () => setIsIdle(true);

		const {
				reset,
				pause,
				resume,
				getRemainingTime,
				getLastActiveTime,
				getElapsedTime
		} = useIdleTimer({
				timeout,
				onActive: handleOnActive,
				onIdle: handleOnIdle
		});
		
		const handleReset = () => reset();
		const handlePause = () => pause();
		const handleResume = () => resume();

		useEffect(() => {
				setRemaining(getRemainingTime())
				setLastActive(getLastActiveTime())
				setElapsed(getElapsedTime())
		
				setInterval(() => {
						setRemaining(getRemainingTime())
						setLastActive(getLastActiveTime())
						setElapsed(getElapsedTime())
				}, 1000)
		}, []);

		const idle20Minutes = () => {
				return elapsed > 10000;
		};
		const useStyles = makeStyles((theme) => ({
				paper: {
						position: 'absolute',
						width: 400,
						backgroundColor: theme.palette.background.paper,
						border: '2px solid #000',
						boxShadow: theme.shadows[5],
						padding: theme.spacing(2, 4, 3),
				},
		}));
		const handleOpen = () => {
			setOpen(true);
		  };
		
		  const handleClose = () => {
			setOpen(false);
		  };

		const modalBody = (
				<div style={modalStyle}>

				</div>
		);

		return (
				<div>
					<div>
						<button onClick={handleOpen}>Open Modal</button>
						<Modal
							open={open}
							onClose={handleClose}
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description"
						></Modal>


						<button onClick={handleReset}>Yes</button>

						<div>
							<button onClick={handleReset}>RESET</button>
							<button onClick={handlePause}>PAUSE</button>
							<button onClick={handleResume}>RESUME</button>

							<h1>Timeout: {timeout}ms</h1>
							<h1>Time Remaining: {remaining}</h1>
							<h1>Time Elapsed: {elapsed}</h1>
							<h1>Last Active: {format(lastActive, 'MM-dd-yyyy HH:MM:ss.SSS')}</h1>
							<h1>Idle: {isIdle.toString()}</h1>
						</div>

					</div>


						<MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
								<div className="App">
										<CssBaseline/>
										<Navigation/>
								</div>
						</MuiPickersUtilsProvider>
				</div>
		)};

export default App;
