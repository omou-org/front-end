import './TabComponents.scss';
import * as hooks from 'actions/hooks';
import Grid from '@material-ui/core/Grid';
import Loading from 'components/OmouComponents/Loading';
import ProfileCard from '../ProfileCard';
import PropTypes from 'prop-types';
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import LoadingError from './LoadingCourseError';
import { fullName } from '../../../../utils';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GET_STUDENT_PARENTS } from 'queries/AccountsQuery/AccountsQuery';

// I click into a student account - Take the ID from param
//

const ParentContact = () => {
    const { accountID } = useParams();

    const { data, loading, error } = useQuery(GET_STUDENT_PARENTS, {
        variables: { userID: accountID },
    });

    if (loading) return <Loading loadingText='PARENT LOADING' small />;
    if (error) return <LoadingError error='parent' />;

    // Needs to take ID and check if its a parent
    const { student } = data;

    const parent = {
        name: fullName(student.primaryParent.user),
        phoneNumber: student.primaryParent.user?.parent.phoneNumber,
        accountType: student.primaryParent.accountType.toLowerCase(),
        user: {
            id: student.primaryParent.user?.id,
            email: student.primaryParent.user?.email,
        },
    };

    return (
        <Grid item md={12}>
            <Grid container spacing={2}>
                <Grid item md={12} xs={10}>
                    <ProfileCard
                        route={`/accounts/parent/${student.primaryParent.user.id}`}
                        user={parent}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

ParentContact.propTypes = {
    parent_id: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
};

export default ParentContact;
