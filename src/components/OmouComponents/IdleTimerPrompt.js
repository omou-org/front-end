import React, {useCallback, useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {ResponsiveButton} from "../../theme/ThemedComponents/Button/ResponsiveButton";
import Dialog from "@material-ui/core/Dialog";
import {closeRegistrationCart} from "./RegistrationUtils";
import {logout} from "../../actions/authActions";
import {useIdleTimer} from "react-idle-timer";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

export default function IdleTimerPrompt() {
	const [openIdlePrompt, setIdlePrompt] = useState(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const handleOnIdle = event => {
		setIdlePrompt(true);
	}

	const handleLogout = useCallback(() => {
		closeRegistrationCart();
		dispatch(logout());
		history.push("/login");
	}, [dispatch, history]);

	useEffect(() => {
		if (openIdlePrompt) {
			setInterval(() => {
				setIdlePrompt(false);
				handleLogout();
			}, 1000 * 60 * 2)
		}
	}, [openIdlePrompt])

	useIdleTimer({
		timeout: 1000 * 60 * 18,
		onIdle: handleOnIdle,
		debounce: 500
	});

	return (<Dialog open={openIdlePrompt}>
		<DialogTitle disableTypography>
			<Typography variant="h4">
				Are you still there?
			</Typography>
		</DialogTitle>
		<DialogContent>
			Looks like you've been idle for a while. To make sure no one will use your account behind your back, you
			will be logged out automatically within 2 minutes.
		</DialogContent>
		<DialogActions>
			<ResponsiveButton
				onClick={() => setIdlePrompt(false)}
				color="primary"
				variant="contained"
			>
				Yes
			</ResponsiveButton>
		</DialogActions>
	</Dialog>)
}