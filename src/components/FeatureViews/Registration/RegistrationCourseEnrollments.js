import React from 'react';
import PropTypes from 'prop-types';

import LinearProgress from '@material-ui/core/LinearProgress';
import Loading from 'components/OmouComponents/Loading';
import Typography from '@material-ui/core/Typography';
import ClassEnrollmentList from '../Courses/ClassEnrollmentList';

import 'theme/theme.scss';
import './registration.scss';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

export const DELETE_ENROLLMENT = gql`
    mutation DeleteEnrollment($enrollmentId: ID) {
        __typename
        deleteEnrollment(id: $enrollmentId) {
            id
            deleted
            parent
            parentBalance
        }
    }
`;

export const GET_ENROLLMENT_DETAILS = gql`
    query EnrollmentDetails($courseId: ID!) {
        enrollments(courseId: $courseId) {
            student {
                primaryParent {
                    user {
                        firstName
                        lastName
                        email
                        id
                    }
                    accountType
                    phoneNumber
                }
                user {
                    firstName
                    lastName
                    email
                    id
                }
                accountType
                phoneNumber
                studentschoolinfoSet {
                    textbook
                    teacher
                    name
                }
            }
            id
        }
    }
`;

const RegistrationCourseEnrollments = ({
    courseID,
    maxCapacity,
    courseTitle,
}) => {
    const { data, loading, error } = useQuery(GET_ENROLLMENT_DETAILS, {
        variables: { courseId: courseID },
    });

    // TODO: need to update when Session queries are live
    // const sessionStatus = useSessions("month", 0)
    // const currentMonthSessions = sessionArray(sessions);
    // const upcomingSess = upcomingSession(currentMonthSessions || [], courseID);

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

    const { enrollments } = data;

    return (
        <>
            <div className='course-status'>
                <div className='status'>
                    <div className='text'>
                        {enrollments.length} / {maxCapacity} Spaces Taken
                    </div>
                </div>
                <LinearProgress
                    color='primary'
                    value={(enrollments.length / maxCapacity) * 100}
                    valueBuffer={100}
                    variant='buffer'
                />
            </div>
            <ClassEnrollmentList
                enrollmentList={enrollments}
                courseID={courseID}
                enrollmentID={data.id}
                courseTitle={courseTitle}
            />
        </>
    );
};

RegistrationCourseEnrollments.propTypes = {
    courseID: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
};

export default RegistrationCourseEnrollments;
