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

    const handleTabChange = useCallback((_, newTab) => {
        setActiveTab(newTab);
    }, []);

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
    const isTutoring = true;

    const ActiveTabView = ({ ActiveTab }) => {
        const TutoringSummaryTabView = isTutoring
            ? [
                  <EnrollmentSummaryTab
                      sessions={sessionsData.sessions}
                      enrollment={enrollmentData}
                  />,
              ]
            : [];

        return [
            ...TutoringSummaryTabView,
            <EnrollmentProgress />,
            <InvoiceTable
                invoiceList={enrollmentData.enrollment.paymentList}
            />,
            <Notes ownerID={enrollmentId} ownerType='enrollment' />,
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
        <Grid container>
            <Grid item xs={12}>
                <Typography
                    align='left'
                    className='course-session-title'
                    variant='h1'
                >
                    {course.title}
                </Typography>
            </Grid>
            <EnrollmentDetails enrollment={enrollmentData.enrollment} />
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
            <br />
            <ActiveTabView ActiveTab={activeTab} />
        </Grid>
    );
};

CourseSessionStatus.propTypes = {};

export default CourseSessionStatus;
