import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import NoListAlert from "../../../OmouComponents/NoListAlert";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import Paper from "@material-ui/core/Paper";
import PaymentIcon from "@material-ui/icons/CreditCardOutlined";
import PaymentTable from "./PaymentTable";
import RegistrationIcon from "@material-ui/icons/PortraitOutlined";
import SessionPaymentStatusChip from "components/OmouComponents/SessionPaymentStatusChip";
import Switch from "@material-ui/core/Switch";
import LoadingError from "./LoadingCourseError"
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import EnrollmentSessionRow from "./EnrollmentSessionRow";

import * as hooks from "actions/hooks";
import { upcomingSession, useGoToRoute } from "utils";
import { deleteEnrollment, initializeRegistration } from "actions/registrationActions";
import AddSessions from "components/OmouComponents/AddSessions";
import BackButton from "components/OmouComponents/BackButton";
import Loading from "components/OmouComponents/Loading";
import Notes from "components/FeatureViews/Notes/Notes";
import { useEnrollmentNotes } from "actions/userActions";
import { useSessionsWithConfig } from "actions/calendarActions";
import Moment from "react-moment";

const GET_ENROLLMENT = gql ` 
    query EnrollmentViewQuery ($enrollmentId: ID!) {
        enrollment(enrollmentId: $enrollmentId) {
          id
          enrollmentnoteSet {
            id
            important
          }
          sessionsLeft
          enrollmentBalance
          course {
            id
            title
            courseType
            instructor {
              user {
                firstName
                id
                lastName
              }
            }
          }
          paymentList {
            id
            createdAt
          }
          lastPaidSessionDatetime
          student {
            user {
              id
              firstName
              lastName
              parent {
                user {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    
      
      `;

      const GET_SESSIONS = gql ` 
    query GetSessions ($courseId: ID!) {
        sessions(courseId: $courseId) {
          course {
            startTime
            endTime
            id
            hourlyTuition
          }
          id
          startDatetime
          endDatetime
        }
      }
    `

   

const timeOptions = {
    "hour": "2-digit",
    "minute": "2-digit",
};
const dateOptions = {
    "day": "numeric",
    "month": "numeric",
    "year": "numeric",
};

const CourseSessionStatus = () => {
    const dispatch = useDispatch();
    const goToRoute = useGoToRoute();
    const { enrollmentId } = useParams();
    
    const {data: enrollmentData, loading: enrollmentLoading, error: enrollmentError} = useQuery(GET_ENROLLMENT, {
        variables: {enrollmentId}
    });

    const {data: sessionsData, loading: sessionsLoading, error: sessionsError} = useQuery(GET_SESSIONS, {
        variables: {courseId: enrollmentData?.enrollment.course.id},
        skip: enrollmentLoading || enrollmentError
    });


    const [activeTab, setActiveTab] = useState(0);
    const [highlightSession, setHighlightSession] = useState(false);
    const [unenrollWarningOpen, setUnenrollWarningOpen] = useState(false);


    // const upcomingSess = upcomingSession(sessions, courseID) || {};

    // const studentParent =
    //     usersList.StudentList[studentID] &&
    //     usersList.StudentList[studentID].parent_id;

    // const sessionDataParse = useCallback(
    //     ({ start_datetime, end_datetime, course, status, id, instructor }) => {
    //         if (start_datetime && end_datetime && course) {
    //             const startDate = new Date(start_datetime);
    //             const endDate = new Date(end_datetime);
    //             return {
    //                 "course_id": course,
    //                 "date": startDate,
    //                 "endTime": endDate,
    //                 id,
    //                 instructor,
    //                 "startTime": start_datetime,
    //                 status,
    //                 "tuition": course && courses[course].hourly_tuition,
    //             };
    //         }
    //         return {};
    //     },
    //     [courses]
    // );

    const handleTabChange = useCallback((_, newTab) => {
        setActiveTab(newTab);
    }, []);

    const handleHighlightSwitch = useCallback(() => {
        setHighlightSession((prevHighlight) => !prevHighlight);
    }, []);

    const openUnenrollDialog = useCallback(() => {
        setUnenrollWarningOpen(true);
    }, []);

    const closeUnenrollDialog = useCallback(
        (toUnenroll) => () => {
            setUnenrollWarningOpen(false);
            if (toUnenroll) {
                // deleteEnrollment(enrollment)(dispatch);
                // goToRoute(`/accounts/student/${studentID}`);
            }
        },
        // [dispatch, enrollment, goToRoute, studentID]
    );

    useEffect(() => {
        dispatch(initializeRegistration());
    }, [dispatch]);


       if (enrollmentLoading || sessionsLoading) {
        return <Loading/>
    }
    if (enrollmentError || sessionsError) {
        return <Typography>
            There's been an error! Error: {enrollmentError.message || sessionsError.message}
        </Typography>
    }
      console.log(enrollmentData)
      console.log(sessionsData)
    

    //   const courseid = enrollmentsData.enrollment.course.id;
    //   const courseid= 1;

    //    const GET_SESSIONS = gql ` 
    // query MyQuery {
    //     sessions(courseId: ${courseid}) {
    //       course {
    //         startTime
    //         endTime
    //         id
    //         hourlyTuition
    //       }
    //       id
    //     }
    //   }
    // `

    //   if (sessionsLoading) {
    //     return <Loading/>
    // }
    // if (sessionsError) {
    //     return <Typography>
    //         There's been an error! Error: {error.message}
    //     </Typography>
    // }
    //   console.log(sessionsData)
      


    // either doesn't exist or only has notes defined
   

// return (
//     <div>
//         hi
//     </div>
// )
const {course, enrollmentnoteSet, enrollmentBalance, paymentList, student, id} = enrollmentData.enrollment
console.log(sessionsData.sessions)

    const mainContent = () => {
        // const {course, enrollmentnoteSet, paymentList, student, id} = enrollmentData
        switch (activeTab) {
            case 0:
                return (
                    <>
                        <Grid className="accounts-table-heading" container item xs={12}>
                            <Grid item xs={1} />
                            <Grid item xs={2}>
                                <Typography align="left" className="table-text">
                                    Session Date
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align="left" className="table-text">
                                    Day
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography align="left" className="table-text">
                                    Time
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography align="left" className="table-text">
                                    Tuition
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align="center" className="table-text">
                                    Status
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                        <EnrollmentSessionRow 
                            sessionsData = {sessionsData}
                            enrollmentData = {enrollmentData}
                            highlightSession = {highlightSession}
                        />
                        </Grid>
                        {/* <Grid container spacing={1}>
                            {sessionsData.sessions.length !== 0 ?
                                sessionsData.sessions.map((session) => {
                                 
                                
                                    
                                
                                    return (
                                        <Grid className="accounts-table-row"
                                            component={Link}
                                            item
                                            key={id}
                                            to={
                                                course.course_type === "tutoring"
                                                    ? `/scheduler/view-session/${session.course.id}/${id}/${session.instructor}`
                                                    : `/registration/course/${session.course.id}`
                                            }
                                            xs={12}>
                                            <Paper className={`session-info
                                                ${highlightSession && " active"}
                                                ${
                                                session.id == session.id &&
                                                "upcoming-session"
                                                }`}
                                                component={Grid}
                                                container
                                                square>
                                                <Grid item xs={1} />
                                                <Grid item xs={2}>
                                                    <Typography align="left">
                                                        <Moment
                                                            date={session.startDate}
                                                            format="M/D/YYYY"
                                                        />
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography align="left">
                                                        <Typography align="left">
                                                            <Moment
                                                                date={session.startDate}
                                                                format="dddd"
                                                            />
                                                        </Typography>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography align="left">
                                                        <Moment
                                                            date={session.startTime}
                                                            format="h:mm A"
                                                        />
                                                        {" - "}
                                                        <Moment
                                                            date={session.endTime}
                                                            format="h:mm A"
                                                        />
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Typography align="left">${session.hourlyTuition}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    {/* MUST FIX STATUS */}
                                                    {/* <SessionPaymentStatusChip enrollment={enrollmentData.enrollment}
                                                        session={session}
                                                        setPos /> */}
                                                {/* </Grid>
                                            </Paper>
                                        </Grid> */} 
                                    {/* ); */}
                                            
                                {/* })
                            
                                : (
                                    <NoListAlert list="Course" />
                                )}
                        </Grid> */}
                    </>
                );
            case 1:
                return (
                    <Notes ownerID={id}
                        ownerType="enrollment" />
                );
            case 2:
                return (
                    <PaymentTable courseID={course.id}
                        enrollmentID={id}
                        paymentList={paymentList}
                        type="enrollment" />
                );
            default:
                return null;
        }
    };

    return (
        <Paper className="paper" elevation={2}>
            <Grid className="course-session-status" container>
                <Grid item xs={12}>
                    <BackButton />
                    <hr />
                </Grid>
                <Grid item xs={12}>
                    <Typography align="left"
                        className="course-session-title"
                        variant="h3">
                        {course.title}
                    </Typography>
                </Grid>
                <Grid item md={12}>
                    <Grid alignItems="center"
                        className="session-actions"
                        container
                        direction="row"
                        justify="flex-start"
                        spacing={2}>
                        <Grid item>
                            <AddSessions componentOption="button"
                                enrollment={enrollmentData}
                                parentOfCurrentStudent={student.parent} />
                        </Grid>
                        <Grid item>
                            <Button className="button unenroll" onClick={openUnenrollDialog}>
                                Unenroll Course
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid className="participants" item xs={12}>
                        <Typography align="left">
                            Student:{" "}
                            <Link to={`/accounts/student/${student.id}`}>
                                {student.user.firstName} {student.user.lastName}
                            </Link>
                        </Typography>
                        <Typography align="left">
                            Instructor:{" "}
                            <Link to={`/accounts/instructor/${course.instructor_id}`}>
                                {course.instructor.user.firstName} {course.instructor.user.lastName}
                            </Link>
                        </Typography>
                        <Typography align="left">
                            Enrollment Balance Left: ${enrollmentBalance}
                        </Typography>
                    </Grid>
                    {activeTab === 0 && (
                        <Grid alignItems="flex-start" container item xs={3}>
                            <Grid item>
                                <FormControl component="fieldset">
                                    <FormGroup>
                                        <FormControlLabel control={
                                            <Switch checked={highlightSession}
                                                color="primary"
                                                onChange={handleHighlightSwitch}
                                                value="upcoming-session" />
                                        }
                                            label="Highlight Upcoming Session" />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Tabs className="enrollment-tabs"
                    indicatorColor="primary"
                    onChange={handleTabChange}
                    value={activeTab}>
                    <Tab label={
                        <>
                            <RegistrationIcon className="NoteIcon" /> Registration
                        </>
                    } />
                    <Tab label={
                        Object.values(enrollmentnoteSet).some(
                            ({ important }) => important
                        ) ? (
                                <>
                                    <Avatar className="notificationCourse" />
                                    <NoteIcon className="TabIcon" /> Notes
                            </>
                            ) : (
                                <>
                                    <NoteIcon className="NoteIcon" /> Notes
                                </>
                            )
                    } />
                    <Tab label={
                        <>
                            <PaymentIcon className="TabIcon" /> Payments
                        </>
                    } />
                </Tabs>
                <br />
                {mainContent()}
            </Grid>
            <Dialog aria-labelledby="warn-unenroll"
                onClose={closeUnenrollDialog(false)}
                open={unenrollWarningOpen}>
                <DialogTitle id="warn-unenroll">Unenroll in {course.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to unenroll in <b>{course.title}</b> for{" "}
                        <b>{student.user.firstName} {student.user.lastName}</b>. Performing this
                        action will credit <b>${enrollmentBalance}</b> back to the parent's
                        account balance. Are you sure you want to unenroll?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={closeUnenrollDialog(true)}
                    >
                        Yes, unenroll
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={closeUnenrollDialog(false)}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper> 
     );
                
};

CourseSessionStatus.propTypes = {};

export default CourseSessionStatus;
