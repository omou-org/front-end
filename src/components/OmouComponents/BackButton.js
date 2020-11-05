import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import BackArrow from '@material-ui/icons/ArrowBackIos';
import Modal from "@material-ui/core/Modal";
import Hidden from "@material-ui/core/Hidden/Hidden";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import { ResponsiveButton } from '../../theme/ThemedComponents/Button/ResponsiveButton';


const BackButton = (props) => {

	const [alert, setAlert] = React.useState(false);

	const goBack = () => {
		// only call user defined function from parent component if defined
		props.onBack && props.onBack();
		props.history.goBack();

	};
	const label = () => {
		var label = "";
		if (props.label == null) {
			label = "back";
		}
		if (props.label == "cancel") {
			label = "cancel";
		}
		return label;
	};


	const handleClick = () => {
		if (props.warn) {
			setAlert(true);
		} else {
			goBack();
		}
	};

	const hideWarning = () => {
		setAlert(false);
	};

	const saveForm = () => {
		//enter future code to save form
	};

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
	};

	const denyAction = (actionName) => {
		// switch(actionName){
		//future switch statement for denyAction functions
		// }
		goBack();
	};

	const renderIcon = () => {
		if (props.icon == null) {
			return <BackArrow style={{transform: "scale(0.8)"}}/>
		}
		if (props.icon == "cancel") {
			return null;
		}
	};

	return (
		<Hidden mdDown>
			<ResponsiveButton
				style={{display: 'flex'}} 
				variant='outlined'
				className="control course button"
				onClick={() => { handleClick() }}
				startIcon={renderIcon()}
			>
				{label()}
			</ResponsiveButton>
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={alert}
				onClick={() => { hideWarning() }}
			>
				<div className="exit-popup">
					<Typography variant="h6" id="modal-title">
						{props.alertMessage ||
							"Are you sure you want to leave unsaved changes?"}
					</Typography>
					<ResponsiveButton
						onClick={(e) => {
							e.preventDefault();
							(denyAction());
						}}
						color="secondary"
						className="button secondary"
					>
						{props.alertDenyText || "No, leave me here"}
					</ResponsiveButton>
					<ResponsiveButton
						onClick={(e) => {
							e.preventDefault();
							(confirmAction());
						}}
						color="primary"
						className="button primary"
					>
						{props.alertConfirmText || "Yes, take me back"}
					</ResponsiveButton>
				</div>
			</Modal>
		</Hidden>
	);
};

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
