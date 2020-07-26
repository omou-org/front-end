import React, {useContext, useEffect, useState} from "react";
import {RegistrationContext} from "./RegistrationContext";
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
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
import Button from "@material-ui/core/Button";
import Loading from "../../../OmouComponents/Loading";
import {useHistory} from "react-router-dom"

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

const CREATE_ENROLLMENTS = gql`mutation CreateEnrollments($enrollments:[EnrollmentInput]!) {
  __typename
  createEnrollments(enrollments:$enrollments) {
    enrollments {
      id
      course {
        id
      }
      student {
        user {
          id
        }
      }
    }
  }
}`;

const CREATE_PAYMENT = gql`mutation CreatePayment($method:String!, $parent:ID!, $classes:[ClassQuote]!,
					$disabledDiscounts:[ID], $priceAdjustment: Float, $registrations:[EnrollmentQuote]!) {
  __typename
  createPayment(method: $method, parent: $parent, classes: $classes, disabledDiscounts: $disabledDiscounts, 
  priceAdjustment: $priceAdjustment, registrations: $registrations) {
    payment {
      id
      accountBalance
      createdAt
      discountTotal
      enrollments {
        course {
          title
          startTime
          startDate
          instructor {
            user {
              lastName
              firstName
            }
          }
          courseId
          endDate
          endTime
          hourlyTuition
        }
        student {
          user {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
}`

const GET_PARENT_ENROLLMENTS = gql`query GetParentEnrollments($studentIds:[ID]!) {
  __typename
  enrollments(studentIds: $studentIds) {
    id
    course {
      id
    }
    student {
      user {
        id
      }
    }
  }
}`

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

export default function PaymentBoard() {
	const {registrationCart, currentParent} = useContext(RegistrationContext);
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
	const [priceAdjustmentValue, setPriceAdjustmentValue] = useState('');
	const classes = useRowStyles();
	const classRegistrations = [].concat(Object.values(registrationCart).flat())
		.filter(registration => registration.course.id && registration.checked)
		.map(({course, numSessions, student}) => ({
			course: course.id,
			sessions: numSessions,
			student,
		}));
	const enrollmentResponse = useQuery(GET_PARENT_ENROLLMENTS, {variables: {studentIds: currentParent.studentList}})
	const [createEnrollments, createEnrollmentResults] = useMutation(CREATE_ENROLLMENTS);
	const [createPayment, createPaymentResults] = useMutation(CREATE_PAYMENT);
	const history = useHistory();

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

	const handlePayment = async () => {
		const paymentMethod = paymentMethodState.find(({checked}) => checked)?.value;
		const {data: {enrollments}} = enrollmentResponse;
		const enrollmentsToCreate = classRegistrations
			.filter(({course, student}) =>
				(!enrollments.find(enrollment =>
					(course === enrollment.course.id && student === enrollment.student.user.id))))
			.map(({course, student}) => ({course, student}));
		const existingEnrollments = classRegistrations
			.filter(({course, student}) =>
				(enrollments.find(enrollment =>
					(course === enrollment.course.id && student === enrollment.student.user.id))))
			.map(registration => ({
				...registration,
				id: enrollments.find(enrollment =>
					(registration.course === enrollment.course.id &&
						registration.student === enrollment.student.user.id)).id
			}))
		const newEnrollmentIDs = await createEnrollments({
			variables: {
				enrollments: enrollmentsToCreate,
			}
		});

		const registrations = [
			...newEnrollmentIDs.data.createEnrollments.enrollments.map(enrollment => ({
				enrollment: enrollment.id,
				numSessions: classRegistrations.find(({course, student}) =>
					(course === enrollment.course.id && student === enrollment.student.user.id)).sessions
			})),
			...existingEnrollments.map(enrollment => ({
				enrollment: enrollment.id,
				numSessions: enrollment.sessions,
			}))
		]

		const payment = await createPayment({
			variables: {
				parent: currentParent.user.id,
				method: paymentMethod,
				classes: classRegistrations,
				disabledDiscounts: [],
				priceAdjustment: Number(priceAdjustmentValue),
				registrations: registrations,
			}
		});

		history.push(`/registration/receipt/${payment.data.createPayment.payment.id}`)
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

	if (enrollmentResponse.loading) return <Loading/>

	return (<>
		<Grid item container justify="space-between">
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
		</Grid>
		<Grid item container justify="flex-end">
			<Grid item>
				<Button
					variant="contained"
					color="primary"
					disabled={priceQuote.total <= 0 || priceQuote.total === "-"}
					onClick={handlePayment}
				>
					Pay
				</Button>
			</Grid>
		</Grid>
	</>)
}