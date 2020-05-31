/**
 * this contains a library of all of our graphQL fragments that are meant to be shared
 *
 */

import gql from "graphql-tag";

export const simpleUser = gql`
    fragment SimpleUser on UserType {
        id
        firstName
        lastName
    }
`;
