import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import NewCourse from "@material-ui/icons/School";
import NewUser from "@material-ui/icons/PersonAdd";
import Tooltip from "@material-ui/core/Tooltip";

import "./registration.scss";
import SelectParentDialog from "./SelectParentDialog";
import {stringToColor} from "../Accounts/accountUtils";
import {fullName} from "../../../utils";

const RegistrationActions = () => {
	const currentParent = useSelector(
		({Registration}) => Registration.CurrentParent
	);
	const [dialogOpen, setDialog] = useState(false);

	const openDialog = useCallback(() => {
		setDialog(true);
	}, []);

	const closeDialog = useCallback(() => {
		setDialog(false);
	}, []);

	const parentName = currentParent && fullName(currentParent.user);

	return (
		<>
			<Grid
				item
				className="registration-action-control"
				container
				direction="row"
				justify="flex-start"
			>
				<Grid item md={2}>
					<Button
						className="button"
						color="secondary"
						component={Link}
						to="/registration/form/student"
						variant="outlined"
					>
						<NewUser className="icon"/> New Student
					</Button>
				</Grid>
				<Grid item md={8}>
					{currentParent && (
						<Grid item xs={2}>
							<Button
								aria-controls="simple-menu"
								aria-haspopup="true"
								className="button"
								color="secondary"
								component={Link} to="/registration/form/class-registration"
								variant="outlined"
							>
								<NewCourse className="icon innerIcon"/>
								REGISTER CLASS
							</Button>
						</Grid>
					)}
				</Grid>
				<Grid item xs={2}>
					{currentParent ? (
						<Tooltip title="Registering Parent">
							<Button className="button" onClick={openDialog}>
								<div
									className="circle-icon"
									style={{
										backgroundColor: stringToColor(parentName),
									}}
								/>
								{parentName}
							</Button>
						</Tooltip>
					) : (
						<Button className="button set-parent" onClick={openDialog}>
							<div className="circle-icon"/>
							SET PARENT
						</Button>
					)}
				</Grid>
			</Grid>
			<SelectParentDialog onClose={closeDialog} open={dialogOpen}/>
		</>
	);
};

export default RegistrationActions;
