import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import BackArrow from "@material-ui/icons/ArrowBack";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden/Hidden";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";


const BackButton = (props) => {

	const [alert, setAlert] = React.useState(false);

	const goBack = () => {
		// only call user defined function from parent component if defined
		props.onBack && props.onBack();
		props.history.goBack();

	}
	const label = () => {
		var label = "";
		if (props.label == null) {
			label = "Back";
		}
		if (props.label == "cancel") {
			label = "Cancel";
		}
		return label;
	}


	const handleClick = () => {
		if (props.warn) {
			setAlert=true;
		} else {
			goBack();
		}
	}

	const hideWarning = () => {
		setAlert(false);
	}

	const saveForm = () => {
		//enter future code to save form
	}

	const confirmAction = (actionName) => {
		//actionName is a string
		switch (actionName) {
			case "saveForm":
				saveForm();
				break;
			default:
				console.warn(`Unhandled backbutton action ${actionName}`);
		}
		goBack();
	}

	const denyAction = (actionName) => {
		// switch(actionName){
		//future switch statement for denyAction functions
		// }
		goBack();
	}

	const renderIcon = () => {
		if (props.icon == null) {
			return <BackArrow className="icon" />
		}
		if (props.icon == "cancel") {
			return null;
		}
	}

	return (
		<Hidden mdDown>
			<Button
				className="control course button"
				onClick={()=>{handleClick()}}
			>
				<Grid container>
					{renderIcon()}
					<span className="label">{label()}</span>
				</Grid>
			</Button>
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={alert}
				onClick={()=>{hideWarning()}}
			>
				<div className="exit-popup">
					<Typography variant="h6" id="modal-title">
						{props.alertMessage ||
							"Are you sure you want to leave unsaved changes?"}
					</Typography>
					<Button
						onClick={(e) => {
							e.preventDefault();
							(denyAction());
						}}
						color="secondary"
						className="button secondary"
					>
						{props.alertDenyText || "No, leave me here"}
					</Button>
					<Button
						onClick={(e) => {
							e.preventDefault();
							(confirmAction());
						}}
						color="primary"
						className="button primary"
					>
						{props.alertConfirmText || "Yes, take me back"}
					</Button>
				</div>
			</Modal>
		</Hidden>
	);
}

BackButton.propTypes = {
	history: PropTypes.shape({
		goBack: PropTypes.func.isRequired,
	}).isRequired,
	alertConfirmText: PropTypes.string,
	onBack: PropTypes.func,
	alertMessage: PropTypes.string,
	warn: PropTypes.bool,
	alertDenyText: PropTypes.string,
	alertConfirmAction: PropTypes.string,
	alertDenyAction: PropTypes.string,
};

export default withRouter(BackButton);
