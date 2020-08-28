/* eslint-disable indent */

import React, { useEffect, useState, useMemo, useCallback} from "react";
import { useDispatch }  from "react-redux";
import { logout } from "actions/authActions";
import { closeRegistrationCart } from "components/OmouComponents/RegistrationUtils";


import { format } from 'date-fns';
import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import momentTimezone from "moment-timezone";
import moment from "moment";
import Navigation from "./components/Navigation/Navigation";
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import "./theme/theme.scss";
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import MomentUtils from "@date-io/moment";
import {useIdleTimer} from 'react-idle-timer';
import { useHistory } from "react-router-dom";

Moment.globalMoment = momentTimezone;
Moment.globalTimezone = "America/Los_Angeles";

function rand() {
	return Math.round(Math.random() * 20) - 10;
  }


function getModalStyle() {
	const top = 50 + rand();
	const left = 50 + rand();
  
	return {
	  top: `${top}%`,
	  left: `${left}%`,
	  transform: `translate(-${top}%, -${left}%)`,
	};
  }

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

const App = () => {
		const history = useHistory();
		const dispatch = useDispatch();

		const handleLogout = useCallback(() => {
			console.log("logging out...")
			closeRegistrationCart();
			dispatch(logout());
			history.push("/login");
		}, [dispatch, history]);

		let timeout = 10000; //1080000;
		const modalTimeout = 5000 //120000;
		const [remaining, setRemaining] = useState(timeout);
		const [elapsed, setElapsed] = useState(0);
		const elapseDiff = 5000;

		const [lastActive, setLastActive] = useState(+new Date());
		const [isIdle, setIsIdle] = useState(false);

		const handleOnActive = () => setIsIdle(false);
		const handleOnIdle = () => setIsIdle(true);

		const classes = useStyles();
		// getModalStyle is not a pure function, we roll the style only on the first render
		const [modalStyle] = useState(getModalStyle);
		const [open, setOpen] = useState(false);

		function logoutAfter2Minutes() {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(logoutAndCloseModal());
				}, 5000);
			})
		};
		const logoutAndCloseModal = () => {
			handleClose();
			handleLogout();
		}

		async function handleOpen() {
			setOpen(true);
			handleReset();
			setRemaining(modalTimeout);
			await logoutAfter2Minutes();

		  };
		
		  const handleClose = () => {
			setOpen(false);
			handleLogout();
		  };

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
				}, 1000);
		}, []);

		const body = () => {
			return (
			<div style={modalStyle} className={classes.paper}>
			  <p id="simple-modal-description">
				{/* {
					(remaining < 100) && handleClose()
					// remaining <= 5000 ? handleLogout() : doNothing()
				} */}
				Are you still there?
				<button onClick={handleClose}>Yes</button>
			  </p>
			</div>
		  )};

		return (
				<div>
					<div>
					<button type="button" onClick={handleOpen}>
						Open Modal
					</button>
					{
						(remaining === 0) && handleOpen()
						// remaining === 0 ? handleOpen() : doNothing()
					}
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
				>
					{body()}
				</Modal>


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
