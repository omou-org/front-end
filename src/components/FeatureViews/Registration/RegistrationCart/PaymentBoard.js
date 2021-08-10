import React, { useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RegistrationContext } from './RegistrationContext';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { ResponsiveButton } from '../../../../theme/ThemedComponents/Button/ResponsiveButton';
import Loading from '../../../OmouComponents/Loading';
import { GET_PAYMENT } from '../../Invoices/InvoiceReceipt';
import { GET_STUDENTS_AND_ENROLLMENTS } from '../CourseList';
import { GET_REGISTRATION_CART } from '../SelectParentDialog';
import { CREATE_REGISTRATION_CART } from './RegistrationCartContainer';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { GET_ENROLLMENT_DETAILS } from '../RegistrationCourseEnrollments';
import { GET_ALL_COURSES } from '../RegistrationLanding';
import TableBody from '@material-ui/core/TableBody';

const GET_PRICE_QUOTE = gql`
    query GetPriceQuote(
        $method: String!
        $disabledDiscounts: [ID]
        $priceAdjustment: Float
        $classes: [ClassQuote]
        $tutoring: [TutoringQuote]
        $parent: ID!
    ) {
        priceQuote(
            method: $method
            disabledDiscounts: $disabledDiscounts
            priceAdjustment: $priceAdjustment
            classes: $classes
            tutoring: $tutoring
            parent: $parent
        ) {
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

const CREATE_ENROLLMENTS = gql`
    mutation CreateEnrollments($enrollments: [EnrollmentInput]!) {
        __typename
        createEnrollments(enrollments: $enrollments) {
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
    }
`;

const CREATE_PAYMENT = gql`
    mutation CreateInvoice(
        $method: String!
        $parent: ID!
        $classes: [ClassQuote]!
        $disabledDiscounts: [ID]
        $priceAdjustment: Float
        $registrations: [EnrollmentQuote]!
        $paymentStatus: PaymentChoiceEnum!
    ) {
        __typename
        createInvoice(
            method: $method
            parent: $parent
            classes: $classes
            disabledDiscounts: $disabledDiscounts
            priceAdjustment: $priceAdjustment
            registrations: $registrations
            paymentStatus: $paymentStatus
        ) {
            stripeCheckoutId
            stripeConnectedAccount
            invoice {
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
    }
`;

const GET_PARENT_ENROLLMENTS = gql`
    query GetParentEnrollments($studentIds: [ID]!) {
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
    }
`;

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const paymentOptions = [
    {
        label: 'Credit Card',
        value: 'credit_card',
    },
    {
        label: 'Cash',
        value: 'cash',
    },
    {
        label: 'Check',
        value: 'check',
    },
    {
        label: 'International Credit Card',
        value: 'intl_credit_card',
    },
];

const STRIPE_API_KEY = process.env.REACT_APP_STRIPE_KEY;

const PaymentBoard = () => {
    const { registrationCart, currentParent } = useContext(RegistrationContext);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const history = useHistory();

    const classRegistrations = []
        .concat(Object.values(registrationCart).flat())
        .filter(
            (registration) => registration.course.id && registration.checked
        )
        .map(({ course, numSessions, student }) => ({
            course: course.id,
            sessions: numSessions,
            student,
        }));

    const [priceAdjustment, setPriceAdjustment] = useState(0);
    const { data, error } = useQuery(GET_PRICE_QUOTE, {
        variables: {
            method: paymentMethod,
            classes: classRegistrations,
            parent: currentParent.user.id,
            disabledDiscounts: [],
            priceAdjustment,
        },
        skip: paymentMethod === null,
    });
    const classes = useRowStyles();

    const enrollmentResponse = useQuery(GET_PARENT_ENROLLMENTS, {
        variables: { studentIds: currentParent.studentIdList },
    });
    const [createEnrollments] = useMutation(CREATE_ENROLLMENTS, {
        update: (cache, { data }) => {
            const existingEnrollmentsFromGetParent = cache.readQuery({
                query: GET_PARENT_ENROLLMENTS,
                variables: { studentIds: currentParent.studentIdList },
            }).enrollments;

            cache.writeQuery({
                query: GET_PARENT_ENROLLMENTS,
                data: {
                    __typename: 'EnrollmentType',
                    enrollments: [
                        ...existingEnrollmentsFromGetParent,
                        ...data.createEnrollments.enrollments,
                    ],
                },
                variables: { studentIds: currentParent.studentIdList },
            });
            const cachedCourses = cache.readQuery({
                query: GET_ALL_COURSES,
            }).courses;
            var updatedCourses = JSON.parse(JSON.stringify(cachedCourses));

            const newEnrollments = data.createEnrollments.enrollments.map(
                (enrollment) => ({
                    __typename: 'EnrollmentType',
                    id: enrollment.id,
                    course: enrollment.course,
                    student: enrollment.student,
                })
            );

            newEnrollments.forEach((newEnrollment) => {
                let matchingIndex = cachedCourses.findIndex(
                    (course) => course.id === newEnrollment.course.id
                );

                updatedCourses[matchingIndex] = {
                    ...cachedCourses[matchingIndex],
                    enrollmentSet: [
                        ...cachedCourses[matchingIndex].enrollmentSet,
                        { ...newEnrollment },
                    ],
                };
            });

            cache.writeQuery({
                query: GET_ALL_COURSES,
                data: {
                    courses: cachedCourses,
                },
            });

            const { userInfos, enrollments } = cache.readQuery({
                query: GET_STUDENTS_AND_ENROLLMENTS,
                variables: {
                    userIds: currentParent.studentIdList,
                },
            });

            const newQueryEnrollments = data.createEnrollments.enrollments.map(
                (enrollment) => ({
                    id: enrollment.id,
                    course: {
                        id: enrollment.course.id,
                    },
                })
            );

            cache.writeQuery({
                query: GET_STUDENTS_AND_ENROLLMENTS,
                data: {
                    userInfos,
                    enrollments: [...enrollments, ...newQueryEnrollments],
                },
            });

            // get unique list of course ids from enrollments
            const enrolledCourseIds = [
                ...new Set(
                    data.createEnrollments.enrollments.map(
                        (enrollment) => enrollment.course.id
                    )
                ),
            ];
            // read enrollment details for all cached enrolled courses
            const existingCourseEnrollmentsMatrix = enrolledCourseIds.reduce(
                (courseEnrollmentMatrix, courseId) => {
                    try {
                        courseEnrollmentMatrix[courseId] = cache.readQuery({
                            query: GET_ENROLLMENT_DETAILS,
                            variables: { courseId },
                        }).enrollments;
                    } catch {
                        courseEnrollmentMatrix[courseId] = [];
                    }
                    return courseEnrollmentMatrix;
                },
                {}
            );
            // organize enrollments by courses
            const newCourseEnrollmentsMatrix =
                data.createEnrollments.enrollments.reduce(
                    (courseEnrollmentMatrix, enrollment) => {
                        if (
                            Object.keys(courseEnrollmentMatrix).includes(
                                enrollment.course.id
                            )
                        ) {
                            const prevNewCourseEnrollments =
                                courseEnrollmentMatrix[enrollment.course.id];
                            courseEnrollmentMatrix[enrollment.course.id] = [
                                ...prevNewCourseEnrollments,
                                enrollment,
                            ];
                        } else {
                            courseEnrollmentMatrix[enrollment.course.id] = [
                                enrollment,
                            ];
                        }
                        return courseEnrollmentMatrix;
                    },
                    {}
                );
            // write query for each course
            const createEnrollmentList = (enrollmentMatrix, courseId) => {
                const anyCourseEnrollments =
                    Object.keys(enrollmentMatrix).includes(courseId);
                return anyCourseEnrollments ? enrollmentMatrix[courseId] : [];
            };
            enrolledCourseIds.forEach((courseId) => {
                cache.writeQuery({
                    query: GET_ENROLLMENT_DETAILS,
                    variables: { courseId },
                    data: {
                        enrollments: [
                            ...createEnrollmentList(
                                existingCourseEnrollmentsMatrix,
                                courseId
                            ),
                            ...createEnrollmentList(
                                newCourseEnrollmentsMatrix,
                                courseId
                            ),
                        ],
                    },
                });
            });
        },
        onError: (error) => {
            console.log(error);
        },
    });
    const [createPayment] = useMutation(CREATE_PAYMENT, {
        onCompleted: ({ createInvoice }) => {
            console.log(STRIPE_API_KEY, process.env['REACT_APP_STRIPE_KEY ']);

            // eslint-disable-next-line no-undef
            const stripe = Stripe(STRIPE_API_KEY, {
                stripeAccount: createInvoice.stripeConnectedAccount,
            });
            stripe.redirectToCheckout({
                sessionId: createInvoice.stripeCheckoutId,
            });
        },
        update: (cache, { data }) => {
            cache.writeQuery({
                data: {
                    __typename: 'InvoiceType',
                    invoice: data.createInvoice.invoice,
                },
                query: GET_PAYMENT,
                variables: { paymentId: data.createInvoice.invoice.id },
            });
        },
    });
    const [createRegistrationCart] = useMutation(CREATE_REGISTRATION_CART, {
        onError: ({ message }) => console.error(message),
        update: (cache, { data }) => {
            cache.writeQuery({
                query: GET_REGISTRATION_CART,
                variables: { parent: currentParent.user.id },
                data: {
                    registrationCart:
                        data.createRegistrationCart.registrationCart,
                },
            });
        },
        variables: { parent: currentParent?.user.id },
    });

    const handleMethodChange = useCallback((_, value) => {
        setPaymentMethod(value);
    }, []);

    const handlePriceAdjustmentValueChange = useCallback(
        ({ target: { value } }) => {
            setPriceAdjustment(value);
        },
        []
    );

    const handlePayment = async () => {
        const {
            data: { enrollments },
        } = enrollmentResponse;
        const isSameEnrollment = ({ enrollment, course, student }) =>
            enrollment.student.user.id === student &&
            enrollment.course.id === course;

        const enrollmentsToCreate = classRegistrations
            .filter(
                ({ course, student }) =>
                    !enrollments.some((enrollment) =>
                        isSameEnrollment({
                            course,
                            enrollment,
                            student,
                        })
                    )
            )
            .map(({ course, student }) => ({
                course,
                student,
            }));
        const existingEnrollments = classRegistrations
            .filter(({ course, student }) =>
                enrollments.some((enrollment) =>
                    isSameEnrollment({
                        course,
                        enrollment,
                        student,
                    })
                )
            )
            .map((registration) => ({
                ...registration,
                id: enrollments.find(
                    (enrollment) =>
                        registration.course === enrollment.course.id &&
                        registration.student === enrollment.student.user.id
                ).id,
            }));

        const areThereNewEnrollments = enrollmentsToCreate.length > 0;
        const newEnrollments = areThereNewEnrollments
            ? await createEnrollments({
                  variables: {
                      enrollments: enrollmentsToCreate,
                  },
              })
            : [];

        const actualNewEnrollments = Array.isArray(newEnrollments)
            ? newEnrollments
            : newEnrollments.data.createEnrollments.enrollments;

        const registrations = [
            ...actualNewEnrollments.map((enrollment) => ({
                enrollment: enrollment.id,
                numSessions: classRegistrations.find(({ course, student }) =>
                    isSameEnrollment({
                        course,
                        enrollment,
                        student,
                    })
                ).sessions,
            })),
            ...existingEnrollments.map((enrollment) => ({
                enrollment: enrollment.id,
                numSessions: enrollment.sessions,
            })),
        ];

        const payment = await createPayment({
            variables: {
                parent: currentParent.user.id,
                method: paymentMethod,
                classes: classRegistrations,
                disabledDiscounts: [],
                priceAdjustment: Number(priceAdjustment),
                registrations,
                paymentStatus: 'PAID',
            },
        });

        // clean out parent registration cart
        await createRegistrationCart({
            variables: {
                parent: currentParent.user.id,
                registrationPreferences: '',
            },
        });
        history.push(
            `/registration/receipt/${payment.data.createInvoice.invoice.id}`
        );
    };

    if (error || enrollmentResponse.error) {
        console.error(error?.message, enrollmentResponse.error?.message);
        return (
            <div>
                There has been an error! : {error?.message}{' '}
                {enrollmentResponse.error?.message}
            </div>
        );
    }

    const priceQuote = data?.priceQuote || {
        subTotal: '-',
        priceAdjustment: '-',
        accountBalance: '-',
        total: '-',
        discounts: [],
    };

    if (enrollmentResponse.loading) return <Loading />;

    return (
        <>
            <Grid container item justify='space-between'>
                <Grid item>
                    <FormControl component='fieldset'>
                        <FormLabel component='legend'>
                            <Typography
                                align='left'
                                style={{ fontWeight: '600' }}
                            >
                                Payment Method
                            </Typography>
                        </FormLabel>
                        <RadioGroup
                            aria-label='gender'
                            name='gender1'
                            onChange={handleMethodChange}
                            value={paymentMethod}
                        >
                            {paymentOptions.map(({ label, value }) => (
                                <FormControlLabel
                                    color='primary'
                                    control={<Radio />}
                                    data-cy={`${label}-checkbox`}
                                    key={value}
                                    label={label}
                                    value={value}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Table>
                        <TableBody>
                            <TableRow className={classes.root}>
                                <TableCell>Sub-Total</TableCell>
                                <TableCell>$ {priceQuote.subTotal}</TableCell>
                            </TableRow>
                            <TableRow className={classes.root}>
                                <TableCell>Account Balance</TableCell>
                                <TableCell>
                                    $ {priceQuote.accountBalance}
                                </TableCell>
                            </TableRow>
                            <TableRow className={classes.root}>
                                <TableCell>Discounts</TableCell>
                                <TableCell> </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Price Adjustment</TableCell>
                                <TableCell style={{ width: '55%' }}>
                                    $ -{' '}
                                    <TextField
                                        inputProps={{
                                            style: {
                                                padding: 8,
                                                textAlign: 'center',
                                            },
                                        }}
                                        onChange={
                                            handlePriceAdjustmentValueChange
                                        }
                                        style={{ width: '30%' }}
                                        type='number'
                                        value={priceAdjustment}
                                        variant='outlined'
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow className={classes.root}>
                                <TableCell>Total</TableCell>
                                <TableCell>$ {priceQuote.total}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
            <Grid container item justify='flex-end'>
                <Grid item>
                    <ResponsiveButton
                        color='primary'
                        data-cy='pay-action'
                        disabled={
                            paymentMethod === null ||
                            priceQuote.total === '-' ||
                            priceQuote < 0
                        }
                        onClick={handlePayment}
                        variant='contained'
                    >
                        {paymentMethod === 'credit_card'
                            ? 'Pay Now'
                            : 'Pay Later'}
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </>
    );
};

export default PaymentBoard;
