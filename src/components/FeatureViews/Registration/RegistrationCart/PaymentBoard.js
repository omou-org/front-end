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
import { ResponsiveButton } from '../../../../theme/ThemedComponents/Button/ResponsiveButton';
import Loading from "../../../OmouComponents/Loading";
import {useHistory} from "react-router-dom"
import {GET_PAYMENT} from "../PaymentReceipt";
import {GET_COURSES} from "../RegistrationLanding";
import {GET_STUDENTS_AND_ENROLLMENTS} from "../CourseList";
import {GET_REGISTRATION_CART} from "../SelectParentDialog";
import {CREATE_REGISTRATION_CART} from "./RegistrationCartContainer";
import {GET_ENROLLMENT_DETAILS} from "../RegistrationCourseEnrollments";


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
		  availabilityList {
			endTime
			startTime
		  }
          startDate
          instructor {
            user {
			  id
              lastName
              firstName
            }
          }
		  courseId
          endDate
          hourlyTuition
        }
        student {
          primaryParent {
                user {
                  firstName
                  lastName
                  email
                  id
                }
                phoneNumber
              }
		  user {
			firstName
			lastName
			email
			id
		  }
		  school {
			name
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
      title
    }
    student {
      primaryParent {
		user {
		  firstName
		  lastName
		  email
		  id
		}
		phoneNumber
	  }
	  user {
		firstName
		lastName
		email
		id
	  }
	  school {
		name
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

	const enrollmentResponse = useQuery(GET_PARENT_ENROLLMENTS, {variables: {studentIds: currentParent.studentIdList}})
	const [createEnrollments, createEnrollmentResults] = useMutation(CREATE_ENROLLMENTS, {
		update: (cache, {data}) => {
			const existingEnrollmentsFromGetParent = cache.readQuery({
				query: GET_PARENT_ENROLLMENTS,
				variables: {studentIds: currentParent.studentIdList}
			}).enrollments;

			cache.writeQuery({
				query: GET_PARENT_ENROLLMENTS,
				data: {
					__typename: "EnrollmentType",
					enrollments: [
						...existingEnrollmentsFromGetParent,
						...data["createEnrollments"].enrollments
					],
				},
				variables: {studentIds: currentParent.studentIdList}
			});
			let cachedCourses = cache.readQuery({
				query: GET_COURSES,
			}).courses;

			const newEnrollments = data.createEnrollments.enrollments.map(enrollment => {
				return {
					__typename: "EnrollmentType",
					id: enrollment.id,
					course: enrollment.course,
					student: enrollment.student,
				}
			});

			newEnrollments.forEach(newEnrollment => {
				const matchingIndex = cachedCourses.findIndex((course) =>
					(course.id === newEnrollment.course.id));
				cachedCourses[matchingIndex] = {
					...cachedCourses[matchingIndex],
					enrollmentSet: [...cachedCourses[matchingIndex].enrollmentSet,
						{...newEnrollment}],
				};
			});

			cache.writeQuery({
				query: GET_COURSES,
				data: {
					courses: cachedCourses,
				}
			});

			const {userInfos, enrollments} = cache.readQuery({
				query: GET_STUDENTS_AND_ENROLLMENTS,
				variables: {
					userIds: currentParent.studentIdList
				}
			});

			const newQueryEnrollments = data.createEnrollments.enrollments.map(enrollment => ({
					id: enrollment.id,
					course: {
						id: enrollment.course.id,
					}
				})
			);

			cache.writeQuery({
				query: GET_STUDENTS_AND_ENROLLMENTS,
				data: {
					userInfos,
					enrollments: [
						...enrollments,
						...newQueryEnrollments,
					]
				}
			});

			// get unique list of course ids from enrollments
			const enrolledCourseIds = [...new Set(data.createEnrollments.enrollments
				.map(enrollment => enrollment.course.id))];
			// read enrollment details for all cached enrolled courses
			const existingCourseEnrollmentsMatrix = enrolledCourseIds.reduce((courseEnrollmentMatrix, courseId) => {
				try {
					courseEnrollmentMatrix[courseId] = cache.readQuery({
						query: GET_ENROLLMENT_DETAILS,
						variables: {courseId: courseId}
					}).enrollments;
				} catch {
					courseEnrollmentMatrix[courseId] = [];
				}
				return courseEnrollmentMatrix;
			}, {});
			// organize enrollments by courses
			const newCourseEnrollmentsMatrix = data.createEnrollments.enrollments
				.reduce((courseEnrollmentMatrix, enrollment) => {
					if (Object.keys(courseEnrollmentMatrix).includes(enrollment.course.id)) {
						const prevNewCourseEnrollments = courseEnrollmentMatrix[enrollment.course.id]
						courseEnrollmentMatrix[enrollment.course.id] = [...prevNewCourseEnrollments, enrollment]
					} else {
						courseEnrollmentMatrix[enrollment.course.id] = [enrollment]
					}
					return courseEnrollmentMatrix;
				}, {});
			// console.log(existingCourseEnrollmentsMatrix, newCourseEnrollmentsMatrix);
			// write query for each course
			const createEnrollmentList = (enrollmentMatrix, courseId) => {
				const anyCourseEnrollments = Object.keys(enrollmentMatrix).includes(courseId);
				return anyCourseEnrollments ? enrollmentMatrix[courseId] : [];
			}
			enrolledCourseIds.forEach(courseId => {
				cache.writeQuery({
					query: GET_ENROLLMENT_DETAILS,
					variables: {courseId: courseId},
					data: {
						enrollments: [
							...createEnrollmentList(existingCourseEnrollmentsMatrix, courseId),
							...createEnrollmentList(newCourseEnrollmentsMatrix, courseId),
						]
					}
				});
			});
		}
	});
	const [createPayment, createPaymentResults] = useMutation(CREATE_PAYMENT, {
		update: (cache, {data}) => {
			cache.writeQuery({
				query: GET_PAYMENT,
				data: {
					__typename: "PaymentType",
					payment: data.createPayment.payment,
				},
				variables: {paymentId: data.createPayment.payment.id}
			})
		}
	});
	const [createRegistrationCart, createRegistrationCartResponse] = useMutation(CREATE_REGISTRATION_CART, {
		variables: {parent: currentParent?.user.id},
		update: (cache, {data}) => {
			cache.writeQuery({
				query: GET_REGISTRATION_CART,
				variables: {parent: currentParent.user.id},
				data: {registrationCart: data.createRegistrationCart.registrationCart}
			});
		},
		onError: (error) => console.error(error.message),
	});
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
		// console.log(enrollmentResponse);
		const {data: {enrollments}} = enrollmentResponse;
		const isSameEnrollment = ({enrollment, course, student}) =>
			(enrollment.student.user.id === student && enrollment.course.id === course);

		const enrollmentsToCreate = classRegistrations
			.filter(({course, student}) =>
				(!enrollments.some((enrollment) => isSameEnrollment({enrollment, course, student}))))
			.map(({course, student}) => ({course, student}));
		const existingEnrollments = classRegistrations
			.filter(({course, student}) =>
				(enrollments.some((enrollment) => isSameEnrollment({enrollment, course, student}))))
			.map(registration => ({
				...registration,
				id: enrollments.find(enrollment =>
					(registration.course === enrollment.course.id &&
						registration.student === enrollment.student.user.id)).id
			}));

		const newEnrollmentIDs = await createEnrollments({
			variables: {
				enrollments: enrollmentsToCreate,
			}
		});

		const registrations = [
			...newEnrollmentIDs.data.createEnrollments.enrollments.map(enrollment => ({
				enrollment: enrollment.id,
				numSessions: classRegistrations.find(({course, student}) =>
					isSameEnrollment({enrollment, course, student})).sessions
			})),
			...existingEnrollments.map(enrollment => ({
				enrollment: enrollment.id,
				numSessions: enrollment.sessions,
			}))
		];

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
		console.log(classRegistrations)

		//clean out parent registration cart
		await createRegistrationCart({
			variables: {
				parent: currentParent.user.id,
				registrationPreferences: "",
			}
		});

		history.push(`/registration/receipt/${payment.data.createPayment.payment.id}`)
	};

	if (error || enrollmentResponse.error) {
		// console.log(error)
		// console.log(enrollmentResponse.error.message)
		console.error(error?.message, enrollmentResponse.error.message);
		return <div>There has been an error! : {error?.message} {enrollmentResponse.error.message}</div>
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
								data-cy={`${method.label}-checkbox`}
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
				<ResponsiveButton
					variant="contained"
					color="primary"
					disabled={priceQuote.total === "-" || priceQuote < 0}
					onClick={handlePayment}
					data-cy="pay-action"
				>
					Pay
				</ResponsiveButton>
			</Grid>
		</Grid>
	</>)
}