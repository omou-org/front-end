import React, {useContext, useEffect, useState} from "react";
import {RegistrationContext} from "./RegistrationContext";
import {useLazyQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

const GET_PRICE_QUOTE = gql`
	query GetPriceQuote($method: String!, 
						$disabledDiscounts: [ID],  
						$priceAdjustment: Float,
						$classes: [ ClassQuote ],
						$tutoring: [ TutoringQuote ],
						$parent: ID!) {
		priceQuote(method: $method, disabledDiscounts: $disabledDiscounts, priceAdjustment: $priceAdjustment,
					classes:$classes, tutoring:$tutoring, parent:$parent) {
			subTotal
			priceAdjustment
			accountBalance
			total
			discounts {
				id
				name
				amount
			}
		}					
	}
`;


const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

export default function PaymentBoard() {
	const [registrationCart, currentParent] = useContext(RegistrationContext);
	const [getPriceQuote, {data, error}] = useLazyQuery(GET_PRICE_QUOTE);
	const [paymentMethodState, setPaymentMethodState] = useState([
		{
			label: "Cash",
			value: "cash",
			checked: false,
		},
		{
			label: "Credit Card",
			value: "credit_card",
			checked: false,
		},
		{
			label: "Check",
			value: "check",
			checked: false,
		},
		{
			label: "International Credit Card",
			value: "intl_credit_card",
			checked: false,
		}
	]);
	const {priceAdjustmentValue, setPriceAdjustmentValue} = useState('');
	const classes = useRowStyles();
	const classRegistrations = [].concat(Object.values(registrationCart).flat())
		.filter(registration => registration.course.id && registration.checked)
		.map(({course, numSessions, student}) => ({
			course: course.id,
			sessions: numSessions,
			student,
		}));

	useEffect(() => {
		const paymentMethod = paymentMethodState.find(({checked}) => checked)?.value;
		if (paymentMethod) {
			getPriceQuote({
				variables: {
					method: paymentMethod,
					classes: classRegistrations,
					parent: currentParent.user.id,
					disabledDiscounts: [],
				}
			});
		}

	}, [registrationCart]);

	const handlePaymentMethodStateChange = (index) => {
		getPriceQuote({
			variables: {
				method: paymentMethodState[index].value,
				classes: classRegistrations,
				parent: currentParent.user.id,
				disabledDiscounts: [],
			}
		});
		setPaymentMethodState((prevState) =>
			prevState.map((method, methodIndex) => {
				if (methodIndex === index) {
					return {
						...method,
						checked: !method.checked,
					}
				}
				return {
					...method,
					checked: false,
				}
			})
		);
	};

	const handlePriceAdjustmentValueChange = (e) => {
		getPriceQuote({
			variables: {
				method: paymentMethodState.find(({checked}) => checked).value,
				classes: classRegistrations,
				parent: currentParent.user.id,
				disabledDiscounts: [],
				priceAdjustment: Number(e.target.value),
			}
		});
		if (setPriceAdjustmentValue) {
			setPriceAdjustmentValue(e.target.value);
		}

	};

	if (error) {
		console.error(error.message);
		return <div>There has been an error! : {error.message} </div>
	}

	const priceQuote = data?.priceQuote || {
		subTotal: "-",
		priceAdjustment: "-",
		accountBalance: "-",
		total: "-",
		discounts: [],
	};

	return (<>
		<Grid item>
			<Typography align="left" style={{fontWeight: "600"}}>Payment Method</Typography>
			{
				paymentMethodState.map((method, index) => <FormControlLabel
					control={
						<Checkbox
							checked={method.checked}
							onChange={() => handlePaymentMethodStateChange(index)}
							name={method.label}
							color="primary"
						/>
					}
					label={method.label}
				/>)
			}
		</Grid>
		<Grid item>
			<Table>
				<TableRow className={classes.root}>
					<TableCell>Sub-Total</TableCell>
					<TableCell>$ {priceQuote.subTotal}</TableCell>
				</TableRow>
				<TableRow className={classes.root}>
					<TableCell>Account Balance</TableCell>
					<TableCell>$ {priceQuote.accountBalance}</TableCell>
				</TableRow>
				<TableRow className={classes.root}>
					<TableCell>Discounts</TableCell>
					<TableCell> </TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Price Adjustment</TableCell>
					<TableCell style={{width: "55%"}}>
						$ - <TextField
						value={priceAdjustmentValue}
						onChange={handlePriceAdjustmentValueChange}
						variant="outlined"
						style={{width: "30%"}}
						inputProps={{
							style: {
								padding: 8,
								textAlign: "center"
							}
						}}
						type="number"
					/>
					</TableCell>
				</TableRow>
				<TableRow className={classes.root}>
					<TableCell>Total</TableCell>
					<TableCell>$ {priceQuote.total}</TableCell>
				</TableRow>
			</Table>
		</Grid>
	</>)
}