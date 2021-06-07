import React, { useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import gql from 'graphql-tag';
import { Form as ReactForm, useFormState } from 'react-final-form';

const GET_STUDENTS = gql`
    query GetStudents {
        parents {
            studentList {
                user {
                    lastName
                    firstName
                }
            }
        }
    }
`;

const RequestScheduler = () => {
    return (
        <>
            <Grid container>
                <Grid item>
                    <Typography variant='h1'>
                        Submit Tutoring Request
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
};

export default RequestScheduler;
