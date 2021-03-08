/* eslint-disable indent */
import { Link, useParams } from 'react-router-dom';
import React, { useMemo } from 'react';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import Loading from 'components/OmouComponents/Loading';
import LoadingError from './LoadingCourseError';
import { makeStyles } from '@material-ui/core/styles';
import ProfileCard from '../ProfileCard';
import { useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { AddItemButton } from '../../../OmouComponents/AddItemButton';
import { PropTypes } from 'prop-types';
import { GET_STUDENTS_BY_PARENT } from '../../../../queries/AccountsQuery/AccountsQuery';

const useStyles = makeStyles({
    center: {
        margin: 'auto',
    },
    new: {
        backgroundColor: '#f5f5f5',
        border: '1.5px dashed #999999',
        cursor: 'pointer',
        height: '150px',
        position: 'relative',
    },
});

const StudentInfo = () => {
    const { accountType } = useSelector(({ auth }) => auth);
    const { accountID } = useParams();
    const { data, loading, error } = useQuery(GET_STUDENTS_BY_PARENT, {
        variables: { id: accountID },
    });

    const classes = useStyles();

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
                    to={`/form/student/add/${accountID}`}
                >
                    + Add Student
                </AddItemButton>
            </Grid>
        </Grid>
    );
};

StudentInfo.propTypes = {};

export default StudentInfo;
