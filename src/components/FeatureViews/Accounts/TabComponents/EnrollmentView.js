import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

import EnrollmentSessionRow from './EnrollmentSessionRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import NoListAlert from '../../../OmouComponents/NoListAlert';
import PaymentTable from './PaymentTable';
import Switch from '@material-ui/core/Switch';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { LabelBadge } from '../../../../theme/ThemedComponents/Badge/LabelBadge';
import { initializeRegistration } from 'actions/registrationActions';
import { ResponsiveButton } from '../../../../theme/ThemedComponents/Button/ResponsiveButton';
import AddSessions from 'components/OmouComponents/AddSessions';
import Loading from 'components/OmouComponents/Loading';
import Notes from 'components/FeatureViews/Notes/Notes';
import { fullName } from '../../../../utils';

const GET_ENROLLMENT = gql`
    query EnrollmentViewQuery($enrollmentId: ID!) {
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

export const GET_SESSIONS = gql`
    query GetSessions($courseId: ID!) {
        sessions(courseId: $courseId) {
            course {
                availabilityList {
                    startTime
                    endTime
                }
                id
                hourlyTuition
            }
            id
            startDatetime
            endDatetime
        }
    }
`;

const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
};
const dateOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
};

const CourseSessionStatus = () => {
    const dispatch = useDispatch();
    const { enrollmentId } = useParams();

    const {
        data: enrollmentData,
        loading: enrollmentLoading,
        error: enrollmentError,
    } = useQuery(GET_ENROLLMENT, {
        variables: { enrollmentId },
    });

    const {
        data: sessionsData,
        loading: sessionsLoading,
        error: sessionsError,
    } = useQuery(GET_SESSIONS, {
        variables: { courseId: enrollmentData?.enrollment.course.id },
        skip: enrollmentLoading || enrollmentError,
    });
    const useStyles = makeStyles({
        MuiIndicator: {
            height: '1px',
        },
        wrapper: {
            flexDirection: 'row',
        },
    });
    const classes = useStyles();

    const [activeTab, setActiveTab] = useState(0);
    const [highlightSession, setHighlightSession] = useState(false);
    const [unenrollWarningOpen, setUnenrollWarningOpen] = useState(false);

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
            //TODO: migrate unenroll to graph ql
            // if (toUnenroll) {
            //     deleteEnrollment(enrollment)(dispatch);
            //     goToRoute(`/accounts/student/${studentID}`);
            // }
        }
        // [dispatch, enrollment, goToRoute, studentID]
    );

    useEffect(() => {
        dispatch(initializeRegistration());
    }, [dispatch]);

    if (enrollmentLoading || sessionsLoading) {
        return <Loading />;
    }
    if (enrollmentError || sessionsError) {
        return (
            <Typography>
                There's been an error! Error:{' '}
                {enrollmentError.message || sessionsError.message}
            </Typography>
        );
    }
    sessionsData.sessions.sort((a, b) =>
        a.startDatetime > b.startDatetime
            ? 1
            : b.startDatetime > a.startDatetime
            ? -1
            : 0
    );
    const {
        course,
        enrollmentnoteSet,
        enrollmentBalance,
        paymentList,
        student,
        id,
    } = enrollmentData.enrollment;

    const mainContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <>
                        <Grid
                            className='accounts-table-heading'
                            container
                            item
                            xs={12}
                        >
                            <Grid item xs={1} />
                            <Grid item xs={2}>
                                <Typography align='left' className='table-text'>
                                    Session Date
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align='left' className='table-text'>
                                    Day
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography align='left' className='table-text'>
                                    Time
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography align='left' className='table-text'>
                                    Tuition
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography
                                    align='center'
                                    className='table-text'
                                >
                                    Status
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={1}
                            data-cy='enrollment-sessions'
                        >
                            {sessionsData.sessions.length !== 0 ? (
                                sessionsData.sessions.map((session) => {
                                    return (
                                        <EnrollmentSessionRow
                                            session={session}
                                            enrollmentData={enrollmentData}
                                            highlightSession={highlightSession}
                                        />
                                    );
                                })
                            ) : (
                                <NoListAlert list='Course' />
                            )}
                        </Grid>
                    </>
                );
            case 1:
                return <Notes ownerID={id} ownerType='enrollment' />;
            case 2:
                return (
                    <PaymentTable
                        courseID={course.id}
                        enrollmentID={id}
                        paymentList={paymentList}
                        type='enrollment'
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Grid item xs={12} container>
            <Grid className='course-session-status' container>
                <Grid item xs={12}>
                    <hr />
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        align='left'
                        className='course-session-title'
                        variant='h1'
                    >
                        {course.title}
                    </Typography>
                </Grid>
                <Grid item md={12}>
                    <Grid
                        alignItems='center'
                        className='session-actions'
                        container
                        direction='row'
                        justify='flex-start'
                        spacing={2}
                    >
                        <Grid item>
                            <AddSessions
                                componentOption='button'
                                enrollment={enrollmentData}
                                parentOfCurrentStudent={student.parent}
                            />
                        </Grid>
                        <Grid item>
                            <ResponsiveButton
                                className='button unenroll'
                                onClick={openUnenrollDialog}
                            >
                                Unenroll Course
                            </ResponsiveButton>
                        </Grid>
                    </Grid>
                    <Grid className='participants' item xs={12}>
                        <Typography align='left'>
                            Student:{' '}
                            <Link to={`/accounts/student/${student.is}`}>
                                {fullName(student.user)}
                            </Link>
                        </Typography>
                        <Typography align='left'>
                            Instructor:{' '}
                            <Link
                                to={`/accounts/instructor/${course.instructor_id}`}
                            >
                                {fullName(course.instructor.user)}
                            </Link>
                        </Typography>
                        <Typography align='left'>
                            Enrollment Balance Left: ${enrollmentBalance}
                        </Typography>
                    </Grid>
                    {activeTab === 0 && (
                        <Grid alignItems='flex-start' container item xs={3}>
                            <Grid item>
                                <FormControl component='fieldset'>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={highlightSession}
                                                    color='primary'
                                                    onChange={
                                                        handleHighlightSwitch
                                                    }
                                                    value='upcoming-session'
                                                />
                                            }
                                            label='Highlight Upcoming Session'
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Tabs
                    classes={{ indicator: classes.MuiIndicator }}
                    className='enrollment-tabs'
                    onChange={handleTabChange}
                    value={activeTab}
                >
                    <Tab label={<> Registration </>} />
                    <Tab
                        classes={{ wrapper: classes.wrapper }}
                        label={
                            Object.values(enrollmentnoteSet).some(
                                ({ important }) => important
                            ) ? (
                                <>
                                    Notes
                                    <LabelBadge
                                        style={{ marginLeft: '8px' }}
                                        variant='round-count'
                                    >
                                        1
                                    </LabelBadge>
                                </>
                            ) : (
                                <> Notes </>
                            )
                        }
                    />
                    <Tab label={<> Payments </>} />
                </Tabs>
                <br />
                {mainContent()}
            </Grid>
            <Dialog
                aria-labelledby='warn-unenroll'
                onClose={closeUnenrollDialog(false)}
                open={unenrollWarningOpen}
            >
                <DialogTitle disableTypography id='warn-unenroll'>
                    Unenroll in {course.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to unenroll in <b>{course.title}</b> for{' '}
                        <b>{fullName(student.user)}</b>. Performing this action
                        will credit <b>${enrollmentBalance}</b> back to the
                        parent's account balance. Are you sure you want to
                        unenroll?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ResponsiveButton
                        variant='outlined'
                        color='secondary'
                        onClick={closeUnenrollDialog(true)}
                    >
                        Yes, unenroll
                    </ResponsiveButton>
                    <ResponsiveButton
                        variant='outlined'
                        color='primary'
                        onClick={closeUnenrollDialog(false)}
                    >
                        Cancel
                    </ResponsiveButton>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

CourseSessionStatus.propTypes = {};

export default CourseSessionStatus;
