import React, {useCallback, useState} from "react";
import {Redirect, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "./LoginPage.scss";
import {isFail, isLoading, isSuccessful} from "actions/hooks";
import {login, resetAttemptStatus} from "actions/authActions.js";

const LoginPage = () => {
	const fetchUserStatus = useSelector(
		({RequestStatus}) => RequestStatus.userFetch
	);
	const loginStatus = useSelector(({RequestStatus}) => RequestStatus.login);
	const dispatch = useDispatch();
	const history = useHistory();

	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [savePassword, setSavePassword] = useState(false);
	const [shouldRedirect, setShouldRedirect] = useState(true);

	const handleTextInput = useCallback(
		(setter) => ({target}) => {
			setter(target.value);
			dispatch(resetAttemptStatus());
		},
		[dispatch]
	);

	const handleSubmit = useCallback(
		(event) => {
			event.preventDefault();
			login(email, password, savePassword)(dispatch);
		},
		[dispatch, email, password, savePassword]
	);

	const toggleSavePassword = useCallback(() => {
		setSavePassword((prevPassword) => !prevPassword);
	}, []);

	const failedLogin = isFail(loginStatus);
	if (isLoading(loginStatus) && isLoading(fetchUserStatus)) {
		return <Loading/>;
	}

	if (
		(isSuccessful(fetchUserStatus) || isSuccessful(loginStatus)) &&
		shouldRedirect
	) {
		if (history.length > 2) {
			history.goBack();
		} else {
			return <Redirect to="/"/>;
		}
		setShouldRedirect(false);
	}

	return (
		<Paper className="bg">
			<Typography align="center" color="primary">
				<span className="header">sign in</span>
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					className="email"
					error={failedLogin || email === ""}
					inputProps={{"data-cy": "emailField"}}
					label="E-Mail"
					margin="dense"
					onChange={handleTextInput(setEmail)}
					value={email}
				/>
				<TextField
					autoComplete="current-password"
					className="password"
					error={failedLogin || password === ""}
					inputProps={{"data-cy": "passwordField"}}
					label="Password"
					margin="normal"
					onChange={handleTextInput(setPassword)}
					type="password"
					value={password}
				/>
				<Grid container>
					<Grid className="remember" item>
						<Checkbox
							checked={savePassword}
							component="label"
							inputProps={{
								"data-cy": "rememberMe",
							}}
							onClick={toggleSavePassword}
						/>
						Remember me
					</Grid>
				</Grid>
				<Button
					className="signIn"
					color="primary"
					data-cy="signInButton"
					disabled={!email || !password}
					type="submit"
					variant="contained"
				>
					sign in
				</Button>
			</form>
			{failedLogin && (
				<Typography color="error" data-cy="errorMessage">
					Invalid credentials
				</Typography>
			)}
		</Paper>
	);
};

export default LoginPage;
