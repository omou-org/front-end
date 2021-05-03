import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {OOOContext} from './OOOContext';
import gql from 'graphql-tag';
import {useSelector} from 'react-redux';
import {useQuery} from '@apollo/client';
import Loading from '../../OmouComponents/Loading';

const GET_INSTRUCTOR_SESSIONS = gql`
    query GetInstructorSessions(
        $instructorId: ID!
        $startDate: String!
        $endDate: String!
    ) {
        __typename
        sessions(
            instructorId: $instructorId
            startDate: $startDate
            endDate: $endDate
        ) {
            id
            title
            endDatetime
            startDatetime
        }
    }
`;

export default function ConflictsDisplay() {
    const {OOOFormState} = useContext(OOOContext);
    const AuthUser = useSelector(({auth}) => auth);
    const {loading} = useQuery(GET_INSTRUCTOR_SESSIONS, {
        variables: {
            instructorId: AuthUser.user.id,
            startDate: OOOFormState.startDate.toDate().toISOString(),
            endDate: OOOFormState.endDate.toDate().toISOString(),
        },
    });

    if (loading) return <Loading small />;

    return (
        <Grid container direction='column'>
            <Grid item>
                <Typography variant='h5'>
                    Submit Out of Office Notice
                </Typography>
                <Typography>
                    {OOOFormState.startDate.format('MM/DD/YYYY')} -{' '}
                    {OOOFormState.endDate.format('MM/DD/YYYY')}
                </Typography>
            </Grid>
        </Grid>
    );
}
