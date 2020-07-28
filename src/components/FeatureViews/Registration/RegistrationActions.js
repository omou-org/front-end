import React, {useCallback, useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import NewCourse from "@material-ui/icons/School";
import Tooltip from "@material-ui/core/Tooltip";

import "./registration.scss";
import SelectParentDialog from "./SelectParentDialog";
import {stringToColor} from "../Accounts/accountUtils";
import {fullName, USER_TYPES} from "../../../utils";
import {
	getRegistrationCart,
	setParentRegistrationCart,
	useValidateRegisteringParent
} from "../../OmouComponents/RegistrationUtils";
import {useSelector} from "react-redux";
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loading from "../../OmouComponents/Loading";

const GET_PARENT_QUERY = gql`
query GetRegisteringParent($userId: ID!) {
  __typename
  parent(userId: $userId) {
    user {
      firstName
      id
      lastName
      email
    }
    studentList
  }
}

`

const RegistrationActions = () => {
	const AuthUser = useSelector(({auth}) => auth);
	const {parentIsLoggedIn} = useValidateRegisteringParent();
	const {currentParent, ...registrationState} = getRegistrationCart();
	const [dialogOpen, setDialog] = useState(false);
	const {data, error, loading} = useQuery(GET_PARENT_QUERY, {
		variables: {userId: AuthUser.user.id},
		skip: AuthUser.accountType !== USER_TYPES.parent,
	});

	const openDialog = useCallback(() => {
		setDialog(true);
	}, []);

	const closeDialog = useCallback(() => {
		setDialog(false);
	}, []);

	useEffect(() => {
		if (parentIsLoggedIn && !loading && Object.values(registrationState).length === 0) {
			setParentRegistrationCart(data.parent);
		}
	}, [AuthUser.accountType, loading]);

	if (loading) return <Loading/>;
	if (error) return <div>There has been an error: {error.message}</div>

	const registeringParent = data?.parent || currentParent;

	const parentName = fullName(registeringParent.user);

	return (
		<>
			<Grid
				item
				className="registration-action-control"
				container
				direction="row"
				justify="flex-start"
			>
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
					{registeringParent ? (
						!data && <Tooltip title="Registering Parent">
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
