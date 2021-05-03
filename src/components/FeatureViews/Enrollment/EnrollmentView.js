import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { LabelBadge } from '../../../theme/ThemedComponents/Badge/LabelBadge';
import { initializeRegistration } from 'actions/registrationActions';
import Loading from 'components/OmouComponents/Loading';
import Notes from 'components/FeatureViews/Notes/Notes';
import InvoiceTable from '../Invoices/InvoiceTable';
import EnrollmentSummaryTab from './EnrollmentSummaryTab';
import EnrollmentDetails from './EnrollmentDetails';
import EnrollmentProgress from './EnrollmentProgress';
import { fullName } from '../../../utils';
import { slateGrey } from '../../../theme/muiTheme';
import EnrollmentActions from './EnrollmentActions';

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
                startDate
                endDate
                instructor {
                    user {
                        firstName
                        id
                        lastName
                    }
                }
                courseCategory {
                    name
                }
                availabilityList {
                    dayOfWeek
                    endTime
                    startTime
                }
            }
            paymentList {
                id
                total
                paymentStatus
                createdAt
                parent {
                    user {
                        firstName
                        lastName
                    }
                }
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
                grade
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
        enrollmentViewRoot: {
            marginTop: '10px',
        },
        StudentNameHeading: {
            color: slateGrey,
            textAlign: 'left',
        },
        enrollmentDetails: {
            marginTop: '39px',
            marginBottom: '40px',
        },
    });
    const classes = useStyles();

    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = useCallback((_, newTab) => {
        setActiveTab(newTab);
    }, []);

    useEffect(() => {
        dispatch(initializeRegistration());
    }, [dispatch]);

    if (enrollmentLoading || sessionsLoading) {
        return <Loading />;
    }
    if (enrollmentError || sessionsError)
        return (
            <Typography>
                {`There's been an error! Error: ${
                    enrollmentError.message || sessionsError.message
                }`}
            </Typography>
        );

    const isTutoring = true;

    const ActiveTabView = ({ ActiveTab }) => {
        const TutoringSummaryTabView = isTutoring
            ? [
                  <EnrollmentSummaryTab
                      key={1}
                      sessions={sessionsData.sessions}
                      enrollment={enrollmentData}
                  />,
              ]
            : [];

        return [
            ...TutoringSummaryTabView,
            <EnrollmentProgress key={2} />,
            <InvoiceTable
                key={3}
                invoiceList={enrollmentData.enrollment.paymentList}
            />,
            <Notes ownerID={enrollmentId} ownerType='enrollment' key={4} />,
        ][ActiveTab];
    };

    // sorting sessions by oldest to newest
    sessionsData.sessions
        .slice()
        .sort((a, b) =>
            a.startDatetime > b.startDatetime
                ? 1
                : b.startDatetime > a.startDatetime
                ? -1
                : 0
        );

    const enrollmentNoteTabLabel = (enrollmentnoteSet) =>
        Object.values(enrollmentnoteSet).some(({ important }) => important) ? (
            <>
                Notes
                <LabelBadge style={{ marginLeft: '8px' }} variant='round-count'>
                    1
                </LabelBadge>
            </>
        ) : (
            'Notes'
        );

    const { course, enrollmentnoteSet } = enrollmentData.enrollment;

    return (
        <Grid
            container
            direction='column'
            className={classes.enrollmentViewRoot}
        >
            <Grid container justify='space-between' alignItems='flex-start'>
                <Grid item xs={8}>
                    <Typography
                        className={classes.StudentNameHeading}
                        variant='h4'
                    >
                        {fullName(enrollmentData.enrollment.student.user)}
                    </Typography>
                    <Typography
                        align='left'
                        className='course-session-title'
                        variant='h1'
                    >
                        {course.title}
                    </Typography>
                </Grid>
                <Grid item>
                    <EnrollmentActions enrollment={enrollmentData.enrollment} />
                </Grid>
            </Grid>
            <Grid item className={classes.enrollmentDetails}>
                <EnrollmentDetails enrollment={enrollmentData.enrollment} />
            </Grid>
            <Grid item>
                <Tabs
                    classes={{ indicator: classes.MuiIndicator }}
                    className='enrollment-tabs'
                    onChange={handleTabChange}
                    value={activeTab}
                >
                    {isTutoring && <Tab label='Summary' />}
                    <Tab label='Progress' />
                    <Tab label='Invoices' />
                    <Tab
                        classes={{ wrapper: classes.wrapper }}
                        label={enrollmentNoteTabLabel(enrollmentnoteSet)}
                    />
                </Tabs>
            </Grid>
            <br />
            <ActiveTabView ActiveTab={activeTab} />
        </Grid>
    );
};

CourseSessionStatus.propTypes = {};

export default CourseSessionStatus;
