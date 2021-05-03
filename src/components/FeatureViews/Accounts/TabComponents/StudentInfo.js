/* eslint-disable indent */
import React, {useMemo} from 'react';
import {Link, useParams} from 'react-router-dom';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import Loading from 'components/OmouComponents/Loading';
import LoadingError from './LoadingCourseError';
import ProfileCard from '../ProfileCard';
import {useQuery} from '@apollo/client';
import {useSelector} from 'react-redux';
import {AddItemButton} from '../../../OmouComponents/AddItemButton';

const GET_STUDENTS = gql`
    query GetStudents($id: ID) {
        parent(userId: $id) {
            studentPrimaryParent {
                ...StudentInfo
            }
            studentSecondaryParent {
                ...StudentInfo
            }
        }
    }

    fragment StudentInfo on StudentType {
        phoneNumber
        user {
            id
            firstName
            lastName
            email
        }
    }
`;

const StudentInfo = () => {
    const { accountType } = useSelector(({ auth }) => auth);
    const { accountID } = useParams();
    const { data, loading, error } = useQuery(GET_STUDENTS, {
        variables: { id: accountID },
    });

    const studentList = useMemo(
        () =>
            data?.parent.studentPrimaryParent
                .concat(data?.parent.studentSecondaryParent)
                .map(({ user, phoneNumber }) => ({
                    name: `${user.firstName} ${user.lastName}`,
                    phoneNumber: phoneNumber,
                    accountType: 'student',
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                })),
        [data]
    );

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <LoadingError error='students' />;
    }

    return (
        <Grid
            alignItems='center'
            container
            direction='row'
            md={10}
            spacing={5}
            xs={10}
        >
            {studentList.map((student) => (
                <ProfileCard
                    key={student.user.id}
                    route={`/accounts/student/${student.user.id}`}
                    studentInvite={['PARENT', 'ADMIN'].includes(accountType)}
                    user={student}
                />
            ))}
            <Grid item sm={4} xs={12}>
                <AddItemButton
                    height={150}
                    width={300}
                    component={Link}
                    to={`/form/student/add/?parentId=${accountID}`}
                >
                    + Add Student
                </AddItemButton>
            </Grid>
        </Grid>
    );
};

StudentInfo.propTypes = {};

export default StudentInfo;
