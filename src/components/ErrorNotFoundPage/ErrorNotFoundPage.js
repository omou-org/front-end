import React from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import "./ErrorNotFoundPage.scss";

const ErrorNotFoundPage = (props) => {
	const { goBack } = useHistory();
	return (
		<div className="error-page">
			<Paper elevation={2} className="paper">
				{props.location.state !== "NoEnrollment" ?
					<Typography className="center">
						404.
					<br />
						page not found.
					<div className="space" />
						<Button className="backButton" onClick={goBack}>
							<span className="buttonText">Let's go back.</span>
						</Button>
					</Typography>
					:
					<Typography className="center">
						Oh no!
				<br />
						It looks like no student is enrolled in that class, try a different class
				<div className="space" />
						<Button className="backButton" onClick={goBack}>
							<span className="buttonText">Let's go back.</span>
						</Button>
					</Typography>
				}
			</Paper>
		</div>
	);
};

export default ErrorNotFoundPage;
