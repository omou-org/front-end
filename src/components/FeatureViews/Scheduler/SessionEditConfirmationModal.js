import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import {Typography} from '@material-ui/core';
// import {darkBlue, darkGrey} from "../../../theme/muiTheme";
import {ResponsiveButton} from "../../../theme/ThemedComponents/Button/ResponsiveButton";

const SessionEditConfirmationModal = ({children, studentName, updateSession}) => {
	const [modalState, setModalState] = useState({
		leaveState: false,
		confirmationState: false,
	});

	const handleClose = () => {
		setModalState({...modalState, confirmationState: false});
	};

	const handleSave = () => {
		updateSession();
		handleClose();
	}
	const handleOpenModal = (e) => {
		const {value} = e.currentTarget;
		if (value === 'confirm') {
			setModalState({...modalState, confirmationState: true});
		}

		if (value === 'cancel') {
			setModalState({...modalState, leaveState: true});
		}
	};

	return (<>
			<ResponsiveButton
				variant='contained'
				onClick={handleOpenModal}
				value='confirm'
				// disabled={!checkAllFields}
			>
				Save
			</ResponsiveButton>
			<Dialog
				open={modalState.confirmationState}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					<Typography variant="h3" align='left'>Are you sure?</Typography>
				</DialogTitle>
				<DialogContent>
					<Typography align='left'>
						{`Summary of our updated session for ${studentName}:`}
					</Typography>
				</DialogContent>
				<DialogTitle>
					{"Schedule update:"}
				</DialogTitle>
				<DialogContent>
					{children}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						{'CANCEL'}
					</Button>
					<Button onClick={handleSave} color="primary" autoFocus>
						{'CONTINUE'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

SessionEditConfirmationModal.propTypes = {
	children: PropTypes.any,
	studentName: PropTypes.string,
};

export default SessionEditConfirmationModal;