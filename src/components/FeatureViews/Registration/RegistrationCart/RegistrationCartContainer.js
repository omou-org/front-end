import React, {useEffect, useState} from "react";
import {useValidateRegisteringParent} from "../../../OmouComponents/RegistrationUtils";
import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/react-hooks";
import Loading from "../../../OmouComponents/Loading";
import BackgroundPaper from "../../../OmouComponents/BackgroundPaper";
import {ResponsiveButton} from "../../../../theme/ThemedComponents/Button/ResponsiveButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {RegistrationContext} from "./RegistrationContext";
import StudentRegistrationEntry from "./StudentRegistrationsEntry";
import PaymentBoard from "./PaymentBoard";
import RegistrationActions from "../RegistrationActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {omouBlue, skyBlue} from "../../../../theme/muiTheme";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as types from "../../../../actions/actionTypes";
import {GET_REGISTRATION_CART} from "../SelectParentDialog";

const GET_COURSES_AND_STUDENTS_TO_REGISTER = gql`
  query GetCoursesToRegister($courseIds: [ID]!, $userIds: [ID]!) {
    userInfos(userIds: $userIds) {
      ... on StudentType {
        user {
          firstName
          lastName
          email
          id
        }
      }
    }
    courses(courseIds: $courseIds) {
      id
      title
      startDate
      endDate
      hourlyTuition
      availabilityList {
        dayOfWeek
        endTime
        startTime
      }
      academicLevelPretty
      courseCategory {
        id
        name
      }
      instructor {
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const CREATE_REGISTRATION_CART = gql`
    mutation CreateRegisteringCart($parent: ID!, $registrationPreferences:String) {
        createRegistrationCart(parent: $parent,
            registrationPreferences: $registrationPreferences) {
            registrationCart {
                id
                registrationPreferences
            }
        }
    }
`;

const RegistrationCartContainer = () => {
    const {currentParent, ...registrationCartState} = useSelector(
        (state) => state.Registration,
    );
    const dispatch = useDispatch();

    const [registrationCart, setRegistrationCart] = useState({});
    const [reviewConfirmationCheck, setReviewConfirmationCheck] = useState(false);
    const [reviewError, setReviewError] = useState(false);
    const [parentRegistrationConfirmation, setParentConfirmation] = useState(
        false,
    );
    const {parentIsLoggedIn} = useValidateRegisteringParent();
    // create list of students to fetch
    const studentIds =
        (Object.keys(registrationCartState).length > 0 &&
            Object.keys(registrationCartState)) ||
        currentParent.studentIdList;
    // create list of courses to fetch
    const courseIds =
        Object.values(registrationCartState).filter((reg) => reg).length > 0 &&
        Object.values(registrationCartState)
            .flat()
            .filter((registration) => registration)
            .map(({course}) => course.id);

    const {data, loading, error} = useQuery(
        GET_COURSES_AND_STUDENTS_TO_REGISTER,
        {
            "variables": {
                "userIds": studentIds,
                courseIds,
            },
            "skip": !courseIds,
        },
    );
    const [createRegistrationCart, createRegistrationCartResponse] = useMutation(
        CREATE_REGISTRATION_CART,
        {
            "variables": {"parent": currentParent?.user.id},
            "onCompleted": () => {
                setParentConfirmation(true);
            },
            "update": (cache, {data}) => {
                cache.writeQuery({
                    "query": GET_REGISTRATION_CART,
                    "variables": {"parent": currentParent.user.id},
                    "data": {
                        "registrationCart": data.createRegistrationCart.registrationCart,
                    },
                });
            },
            "onError": (error) => console.error(error.message),
        },
    );

    useEffect(() => {
        dispatch({
            "type": types.INIT_COURSE_REGISTRATION,
            "payload": {},
        });
    }, [dispatch]);

    useEffect(() => {
        const numOfRegistrations = Object.values(registrationCartState)
            .filter((registration) => registration).length;
        if (!loading && numOfRegistrations > 0 && Object.keys(registrationCart).length === 0) {
            const courseData = data.courses;
            setRegistrationCart(() => {
                const registrationCart = {};
                studentIds.forEach((studentId) => {
                    registrationCart[studentId] = registrationCartState[studentId].map((registration) => ({
                        ...registration,
                        "course": courseData.find((course) => course.id === registration.course.id),
                        "checked": true,
                    }));
                });
                return registrationCart;
            });
        }
    }, [setRegistrationCart, loading, registrationCartState]);

    const updateSession = (newSessionNum, checked, studentId, courseId) => {
        setRegistrationCart((prevRegistrationCart) => {
            const registrationToEditIndex = prevRegistrationCart[studentId]
                .map((registration) => Number(registration.course.id))
                .indexOf(Number(courseId));

            const updatedRegistrationList = prevRegistrationCart[studentId];

            if (!checked) {
                updatedRegistrationList.splice(registrationToEditIndex, 1);
            } else {
                updatedRegistrationList[registrationToEditIndex] = {
                    ...updatedRegistrationList[registrationToEditIndex],
                    "numSessions": newSessionNum,
                    checked,
                };
            }

            return {
                [studentId]: updatedRegistrationList,
                ...prevRegistrationCart,
            };
        });
    };

    const handleAcknowledgement = () => {
        setReviewConfirmationCheck(!reviewConfirmationCheck);
        setReviewError(false);
    };

    const handleParentRegistrationSubmit = () => {
        if (!reviewConfirmationCheck) {
            setReviewError(true);
        } else {
            createRegistrationCart({
                "variables": {
                    "registrationPreferences": JSON.stringify(registrationCartState),
                },
            });
        }
    };

    if (loading || !data) {
        return <Loading small />;
    }
    if (error) {
        return <div>There's been an error: {error.message}</div>;
    }
    const studentData = data.userInfos;

    return (
        <RegistrationContext.Provider
            value={{
                registrationCart,
                currentParent,
                updateSession,
            }}>
            <BackgroundPaper>
                <Grid container>
                    <RegistrationActions />
                </Grid>
                <hr />
                <Typography align="left" variant="h2">Registration Cart</Typography>
                <Typography
                    align="left"
                    data-cy="payment-title"
                    gutterBottom
                    style={{"fontSize": "2em"}}>
                    Pay for Course(s)
                </Typography>
                <Grid container item>
                    <Grid container direction="row" spacing={5}>
                        {
                            Object.entries(registrationCart)
                                .map(([studentId, registration]) =>
                                    (<StudentRegistrationEntry
                                        key={studentId}
                                        registrationList={registration}
                                        student={studentData.find((student) => student.user.id === studentId)} />))
                        }
                    </Grid>
                    <Grid alignItems={parentIsLoggedIn && "flex-end"} container
                        direction={parentIsLoggedIn ? "column" : "row"}
                        item
                        justify={parentIsLoggedIn ? "flex-end" : "space-between"}
                        spacing={parentIsLoggedIn && 4}
                        style={{"marginTop": "50px"}}>
                        {parentIsLoggedIn ?
                            <>
                                <Grid item xs={5}>
                                    <FormControl error={reviewError} required>
                                        <FormLabel style={{"textAlign": "left"}}>Acknowledge</FormLabel>
                                        <FormControlLabel
                                            control={<Checkbox checked={reviewConfirmationCheck}
                                                color="primary"
                                                name="checkedA"
                                                onChange={handleAcknowledgement} />}
                                            label="By checking this box, you confirmed that you have reviewed
											the registrations above."
                                            style={{
                                                "color": omouBlue,
                                                "textAlign": "left",
                                                "fontSize": ".7em",
                                                "fontStyle": "italics",
                                            }} />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <ResponsiveButton
                                        color="primary"
                                        onClick={handleParentRegistrationSubmit}
                                        variant="contained">
                                        save registration cart
                                    </ResponsiveButton>
                                </Grid>
                            </> :
                            <PaymentBoard />}
                    </Grid>
                </Grid>
                <Dialog
                    onClose={() => setParentConfirmation(false)}
                    open={parentRegistrationConfirmation}>
                    <DialogTitle>
                        <Grid
                            alignItems="center"
                            container
                            direction="row"
                            justify="center">
                            <Grid item>
                                <CheckCircleIcon color="primary" style={{"fontSize": "3em"}} />
                            </Grid>
                            <Grid item>
                                <Typography
                                    align="center"
                                    color="primary"
                                    style={{
                                        "fontSize": "1.2em",
                                        "fontWeight": 500,
                                        "padding": "15px",
                                    }}>
                                    Request Saved
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <Typography align="center">
                            Your request has been submitted!
                        </Typography>
                        <Typography align="center">
                            Here’s the next step to complete the enrollment process:
                        </Typography>

                        <Box
                            style={{
                                "backgroundColor": skyBlue,
                                "padding": "8%",
                                "margin": "3%",
                            }}>
                            <Typography align="center" style={{"fontWeight": 550}}>
                                Pay in-person at Summit Tutoring or pay over phone (408)839-3239
                            </Typography>
                        </Box>
                        <Typography align="center">
                            Review all invoices on your Payment page.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <ResponsiveButton
                            component={Link}
                            to="/registration"
                            variant="outlined">
                            done
                        </ResponsiveButton>
                        <ResponsiveButton
                            color="primary"
                            component={Link}
                            to="/my-payments"
                            variant="contained">
                            view invoice
                        </ResponsiveButton>
                    </DialogActions>
                </Dialog>
            </BackgroundPaper>
        </RegistrationContext.Provider>
    );
};

export default RegistrationCartContainer;
