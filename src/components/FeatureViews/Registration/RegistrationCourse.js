import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import CalendarIcon from '@material-ui/icons/CalendarTodayRounded';
import Chip from '@material-ui/core/Chip';
import ClassIcon from '@material-ui/icons/Class';
import ConfirmIcon from '@material-ui/icons/CheckCircle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import UnconfirmIcon from '@material-ui/icons/Cancel';
import Moment from 'react-moment';
import { makeStyles } from '@material-ui/core/styles';

import './registration.scss';
import { Link, useRouteMatch } from 'react-router-dom';
import Loading from 'components/OmouComponents/Loading';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import RegistrationActions from './RegistrationActions';
import RegistrationCourseEnrollments from './RegistrationCourseEnrollments';
import UserAvatar from '../Accounts/UserAvatar';
import { weeklySessionsParser } from 'components/Form/FormUtils';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { SIMPLE_COURSE_DATA } from '../../../queries/queryFragments';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent.js';
import { fullName, gradeLvl, USER_TYPES } from 'utils';
import CourseAvailabilites from '../../OmouComponents/CourseAvailabilities';
export const GET_COURSE_DETAILS = gql`
    query CourseDetails($courseId: ID!) {
        course(courseId: $courseId) {
            endDate
            startDate
            activeAvailabilityList {
                dayOfWeek
                endTime
                startTime
            }
            description
            academicLevel
            maxCapacity
            instructor {
                user {
                    id
                    firstName
                    lastName
                }
            }
            isConfirmed
            ...SimpleCourse
        }
        courseNotes(courseId: $courseId) {
            body
            complete
            id
            important
            timestamp
            title
        }
    }
    ${SIMPLE_COURSE_DATA}
`;

const RegistrationCourse = () => {
    const useStyles = makeStyles({
        MuiIndicator: {
            height: '1px',
        },
        wrapper: {
            flexDirection: 'row',
        },
    });
    const classes = useStyles();

    const {
        params: { courseID },
    } = useRouteMatch();
    const isAdmin =
        useSelector(({ auth }) => auth.accountType) === USER_TYPES.admin;

    const [activeTab, setActiveTab] = useState(0);

    const { data, loading, error } = useQuery(GET_COURSE_DETAILS, {
        variables: { courseId: courseID },
    });

    const handleTabChange = useCallback((_, newTab) => {
        setActiveTab(newTab);
    }, []);

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return (
            <Typography>
                There's been an error! Error: {error.message}
            </Typography>
        );
    }
    const {
        course: {
            title,
            endDate,
            startDate,
            activeAvailabilityList,
            description,
            academicLevel,
            maxCapacity,
            instructor,
            isConfirmed,
        },
        courseNotes,
    } = data;

    const instructorName = fullName(instructor.user);

    return (
        <Grid className='registrationCourse' item xs={12}>
            <Grid container justify='space-between'>
                <Grid item sm={3}></Grid>
                <Grid item sm={2} />
            </Grid>
            <Divider className='top-divider' />
            <Grid item lg={12}>
                <RegistrationActions courseTitle={title} />
            </Grid>
            <div className='course-heading'>
                <Typography align='left' variant='h1'>
                    {title}
                </Typography>
                {isAdmin && (
                    <ResponsiveButton
                        className='button'
                        variant='outlined'
                        component={Link}
                        to={`/form/course_details/${courseID}/edit`}
                    >
                        edit course
                    </ResponsiveButton>
                )}
                <div className='date'>
                    <CalendarIcon align='left' className='icon' />
                    <Typography align='left' className='sessions-text'>
                        <Moment format='MMM D YYYY' date={startDate} />
                        {' - '}
                        <Moment format='MMM D YYYY' date={endDate} /> (
                        {weeklySessionsParser(startDate, endDate)} sessions)
                    </Typography>
                </div>
                <div className='info-section'>
                    <div className='course-info-header'>
                        <ClassIcon className='icon' />
                        <Typography align='left' className='text'>
                            Course Information
                        </Typography>
                    </div>
                    <div className='course-info-details'>
                        {instructor && (
                            <>
                                {isConfirmed ? (
                                    <ConfirmIcon className='confirmed course-icon' />
                                ) : (
                                    <UnconfirmIcon className='unconfirmed course-icon' />
                                )}
                                <Chip
                                    avatar={
                                        <UserAvatar
                                            fontSize={20}
                                            name={instructorName}
                                            size={38}
                                        />
                                    }
                                    className='chip'
                                    component={Link}
                                    label={instructorName}
                                    to={`/accounts/instructor/${instructor.user.id}`}
                                />
                            </>
                        )}
                        <Typography align='left' className='text'>
                            <CourseAvailabilites
                                availabilityList={activeAvailabilityList}
                            />
                        </Typography>
                        <Typography align='left' className='text'>
                            <Moment format='dddd' date={startDate} />
                        </Typography>
                        <Typography align='left' className='text'>
                            Grade {gradeLvl(academicLevel)}
                        </Typography>
                    </div>
                </div>
                <Typography align='left' className='description text'>
                    {description}
                </Typography>
                <AccessControlComponent
                    permittedAccountTypes={[
                        USER_TYPES.admin,
                        USER_TYPES.instructor,
                        USER_TYPES.receptionist,
                    ]}
                >
                    <Tabs
                        className='registration-course-tabs'
                        classes={{ indicator: classes.MuiIndicator }}
                        onChange={handleTabChange}
                        value={activeTab}
                    >
                        <Tab label='Registration' />
                    </Tabs>
                    {activeTab === 0 && (
                        <RegistrationCourseEnrollments
                            courseID={courseID}
                            maxCapacity={maxCapacity}
                            courseTitle={title}
                        />
                    )}
                </AccessControlComponent>
            </div>
        </Grid>
    );
};

export default RegistrationCourse;
