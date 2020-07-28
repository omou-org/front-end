import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

import {closeRegistration, setRegisteringParent,} from "actions/registrationActions";
import AccountCard from "../Search/cards/AccountCard";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import gql from "graphql-tag";
import {useLazyQuery} from "@apollo/react-hooks";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {fullName} from "../../../utils";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
	closeRegistrationCart,
	getRegistrationCart,
	setParentRegistrationCart
} from "../../OmouComponents/RegistrationUtils";

const GET_PARENTS_QUERY = gql`
query GetParents($query: String!) {
  accountSearch(query: $query, profile: "PARENT") {
    results {
      ... on ParentType {
        user { 
          firstName
          lastName
          id
          email
        }
        studentList
      }
    }
  }
}
`;

const SelectParentDialog = ({onClose, open}) => {
	const dispatch = useDispatch();
	const [parent, setParent] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [searching, setSearching] = useState(false);
	const {currentParent, ...registrationCartState} = getRegistrationCart();

	const [
		getParents,
		{loading, data}
	] = useLazyQuery(GET_PARENTS_QUERY);

	useEffect(() => {
		if (!currentParent) {
			dispatch(
				setRegisteringParent(
					JSON.parse(sessionStorage.getItem("registrations"))?.currentParent
				)
			);
		}
	}, [currentParent, dispatch]);

	const handleClose = useCallback(() => {
		// if there's something in the input
		if (parent) {
			const registeringParent = parent;

			dispatch(setRegisteringParent(registeringParent));
			setParentRegistrationCart(registeringParent);

			// Add students to redux once the registered parent has been set
			// TODO: redo registration flow
			// registeringParent.student_list.forEach((studentID) => {
			// 	fetchStudents(studentID)(dispatch);
			// });
			sessionStorage.setItem(
				"CurrentParent",
				JSON.stringify(registeringParent)
			);
		}
		// close the dialogue
		onClose();
	}, [parent, dispatch, onClose]);

	const handleExitParent = useCallback(
		(event) => {
			event.preventDefault();
			setParent(null);
			dispatch(setRegisteringParent(null));
			dispatch(closeRegistration());
			closeRegistrationCart();
			onClose();
		},
		[dispatch, handleClose]
	);

	const handleOnChange = useCallback((_, newValue) => {
		setSearching(false);
		setParent(newValue?.value);
	}, [setParent]);

	const handleOnInputChange = useCallback((_, newValue) => {
		if (typeof newValue === 'string') {
			setSearching(true);
			setInputValue(newValue || '');
			getParents({variables: {query: newValue}});
		}
	}, [getParents, setSearching, setInputValue]);

	const SelectParentInput = (params) => <TextField
		{...params}
		label="Search Parent"
		variant="outlined"
		InputProps={{
			...params.InputProps,
			endAdornment: (
				<React.Fragment>
					{loading ? <CircularProgress color="inherit" size={20}/> : null}
					{params.InputProps.endAdornment}
				</React.Fragment>
			),
		}}
	/>;

	const numToCheckout = Object.values(registrationCartState).flat().length;

	const options = data ? data.accountSearch.results
		.map(parent => ({label: fullName(parent.user), value: parent})) : [];

	return (
		<Dialog
			aria-labelledby="simple-dialog-title"
			className="select-parent-dialog"
			onClose={handleClose}
			open={open}
		>
			<DialogTitle id="simple-dialog-title">Currently helping</DialogTitle>
			<DialogContent>
				{(currentParent) ? (
					<div className="active-parent-dialog-content">
						<Grid container direction="row" justify="center">
							<Grid item>
								<AccountCard accountType="PARENT" userID={currentParent.user.id}/>
							</Grid>
						</Grid>
					</div>
				) : (
					<div
						className={`select-parent-search-wrapper ${searching && "active"}`}
					>
						<Autocomplete
							loading={loading}
							options={options}
							selectOnFocus
							autoHighlight
							onChange={handleOnChange}
							onInputChange={handleOnInputChange}
							getOptionLabel={option => option.label}
							renderInput={SelectParentInput}
							inputValue={inputValue}
							noOptionsText="We haven't found a parent yet"
							loadingText="We're searching for a parent..."
						/>
					</div>
				)}
			</DialogContent>
			<DialogActions>
				{currentParent ? (
					<>
						<Button onClick={handleExitParent}>Exit Parent</Button>
						<span>
              <Button
				  component={NavLinkNoDup}
				  disabled={numToCheckout === 0}
				  to="/registration/cart"
              >
                Checkout {numToCheckout} Courses
              </Button>
            </span>
					</>
				) : (
					<Button onClick={handleClose}>Set Parent</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

SelectParentDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

export default SelectParentDialog;
