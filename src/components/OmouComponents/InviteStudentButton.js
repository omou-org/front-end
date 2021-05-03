import React, { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const INVITE_STUDENT = gql`
    mutation InviteStudent($email: String!) {
        inviteStudent(email: $email) {
            errorMessage
            status
        }
    }
`;

export default function InviteStudentButton() {
    const [invite] = useMutation(INVITE_STUDENT, {
        ignoreResults: true,
    });
    const inviteStudent = useCallback(
        (event) => {
            event.stopPropagation();
            invite({
                variables: {
                    email: user?.email,
                },
            });
        },
        [invite, user]
    );
    return (
        <Button className={classes.inviteButton} onClick={inviteStudent}>
            Invite
        </Button>
    );
}
