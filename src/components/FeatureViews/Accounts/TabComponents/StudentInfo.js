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

  const classes = useStyles();

  const studentList = useMemo(
    () =>
      data?.parent.studentPrimaryParent
        .concat(data?.parent.studentSecondaryParent)
        .map(({ user, phoneNumber }) => ({
          "name": `${user.firstName} ${user.lastName}`,
          "phoneNumber": phoneNumber,
          "accountType": "student",
          "user": {
              "id":user.id,
              "email": user.email,
          }
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
      md={12}
      spacing={5}
      xs={10}
    >
      {studentList.map((student) => (
        <ProfileCard
          key={student.user_id}
          route={`/accounts/student/${student.user_id}`}
          studentInvite={['PARENT', 'ADMIN'].includes(accountType)}
          user={student}
        />
      ))}
      <Grid item sm={6} xs={12}>
        <AddItemButton
          height={240}
          width='inherit'
          component={Link}
          to={`/form/add_student/${accountID}`}
        >
          + Add New Student
        </AddItemButton>
      </Grid>
    </Grid>
  );
};

StudentInfo.propTypes = {};

export default StudentInfo;
