import React, {useCallback, useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link, useHistory} from "react-router-dom";
import NewCourse from "@material-ui/icons/School";
import Tooltip from "@material-ui/core/Tooltip";

import "./registration.scss";
import SelectParentDialog from "./SelectParentDialog";
import {stringToColor} from "../Accounts/accountUtils";
import {fullName, USER_TYPES} from "../../../utils";
import {useValidateRegisteringParent} from "../../OmouComponents/RegistrationUtils";
import {useDispatch, useSelector} from "react-redux";
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loading from "../../OmouComponents/Loading";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCartOutlined";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import * as types from "actions/actionTypes";

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

const RegistrationActions = ({ updateRegisteringParent }) => {
	const AuthUser = useSelector(({auth}) => auth);
	const {currentParent, ...registrationState} = useSelector((state) => state.Registration);
	const {parentIsLoggedIn} = useValidateRegisteringParent();
	const dispatch = useDispatch();

	const [dialogOpen, setDialog] = useState(false);
	const {data, error, loading} = useQuery(GET_PARENT_QUERY, {
		variables: {userId: AuthUser.user.id},
		skip: AuthUser.accountType !== USER_TYPES.parent,
	});
	const history = useHistory();

	const openDialog = useCallback(() => {
		setDialog(true);
	}, []);

	const closeDialog = useCallback((isParentSet) => {
		setDialog(false);
		updateRegisteringParent(isParentSet);
	}, []);

	useEffect(() => {
		if (parentIsLoggedIn && !loading && Object.values(registrationState).length === 0) {
			dispatch({
				type: types.SET_PARENT,
				payload: data.parent,
			})
		}
	}, [AuthUser.accountType, loading]);

	if (loading) return <Loading/>;
	if (error) return <div>There has been an error: {error.message}</div>

	const registeringParent = data?.parent || currentParent;

	const parentName = registeringParent && fullName(registeringParent.user);
	const {
		submitStatus = {},
		...registrationCartState
	} = registrationState;
	const numberOfRegistrationsInCart = Object.values(registrationCartState).length > 0 ?
		Object.values(registrationState).reduce((accumulator, currentStudent) => (accumulator + currentStudent?.length),
			0) : 0;

	const toShoppingCart = () => {
		history.push("/registration/cart");
	}

	return (
		<>
			<Grid

				className="registration-action-control"
				container
				direction="row"
				justify="flex-start"
				alignItems="center"
				spacing={1}

			>
				<Grid item md={9}>
					{(currentParent || parentIsLoggedIn) && (
						<Grid item xs={2}>
							<Button
								aria-controls="simple-menu"
								aria-haspopup="true"
								className="button"
								color="secondary"
								component={Link} to="/registration/form/class-registration"
								variant="outlined"
								data-cy="register-class"
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
									data-cy="current-parent"
								/>
								{parentName}
							</Button>
						</Tooltip>
					) : (
						<Button className="button set-parent" onClick={openDialog} data-cy="select-parent">
							<div className="circle-icon"/>
							SET PARENT
						</Button>
					)}
				</Grid>
				<Grid item xs={1} style={{ paddingRight: "6vh", verticalAlign: "middle" }}>
					<IconButton
						onClick={toShoppingCart}
						disabled={numberOfRegistrationsInCart === 0}
					>
						<Badge
							data-cy="shopping-cart-num-registrations"
							badgeContent={numberOfRegistrationsInCart}
							color="primary"
							showZero
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
						>
							<ShoppingCartIcon style={{fontSize: "1.4em",}}/>
						</Badge>
					</IconButton>
				</Grid>
			</Grid>
			<SelectParentDialog onClose={closeDialog} open={dialogOpen}/>
		</>
	);
};

export default RegistrationActions;
