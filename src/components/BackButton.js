import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import BackArrow from "@material-ui/icons/ArrowBack";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden/Hidden";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";


class BackButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alert: false,
		};
	}

	label() {
		return label || "Back";
	}

	handleClick() {
		if (this.props.warn) {
			this.setState({
				alert: true,
			});
		} else {
			this.goBack();
		}
	}

	hideWarning() {
		this.setState({
			alert: false,
		});
	}

	goBack() {
		// only call user defined function from parent component if defined
		this.props.onBack && this.props.onBack();
		this.props.history.goBack();
	}

	saveForm() {
		//enter future code to save form
	}

	confirmAction(actionName) {
		//actionName is a string
		switch (actionName) {
			case "saveForm":
				this.saveForm();
				break;
			default:
				console.warn(`Unhandled backbutton action ${actionName}`);
		}
		this.goBack();
	}

	denyAction(actionName) {
		// switch(actionName){
		//future switch statement for denyAction functions
		// }
		this.goBack();
	}

	renderIcon() {
		if (this.props.icon == null) {
			return <BackArrow className="icon"/>
		}
		if (this.props.icon == "cancel") {
			return null;
		}
	}

	render() {
		return (
			<Hidden mdDown>
				<Button
					className="control course button"
					onClick={this.handleClick.bind(this)}
				>
					<Grid container>
					{this.renderIcon()}
					<span className="label">{this.label()}</span>
					</Grid>
				</Button>
				<Modal
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.state.alert}
					onClick={this.hideWarning.bind(this)}
				>
					<div className="exit-popup">
						<Typography variant="h6" id="modal-title">
							{this.props.alertMessage ||
								"Are you sure you want to leave unsaved changes?"}
						</Typography>
						<Button
							onClick={(e) => {
								e.preventDefault();
								this.denyAction.bind(this)(this.props.denyAction);
							}}
							color="secondary"
							className="button secondary"
						>
							{this.props.alertDenyText || "No, leave me here"}
						</Button>
						<Button
							onClick={(e) => {
								e.preventDefault();
								this.confirmAction.bind(this)(this.props.confirmAction);
							}}
							color="primary"
							className="button primary"
						>
							{this.props.alertConfirmText || "Yes, take me back"}
						</Button>
					</div>
				</Modal>
			</Hidden>
		);
	}
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
