import gql from 'graphql-tag';

// PaymentHistory.js
export const GET_PARENT_PAYMENTS = gql`
    query ParentPayments($parentId: ID!) {
        invoices(parentId: $parentId) {
            id
            createdAt
            registrationSet {
                id
            }
            total
            method
        }
    }
`;

// SelectParentDialog.js
// PaymentBoard.js
// RegistrationCartContainer
export const GET_REGISTRATION_CART = gql`
    query GetRegisteringCart($parent: ID!) {
        registrationCart(parentId: $parent) {
            registrationPreferences
        }
    }
`;

// UnpaidSessions.js
export const UNPAID_SESSION_QUERY = gql`
    query unpaidSessionQuery {
        unpaidSessions {
            student {
                user {
                    firstName
                    lastName
                    id
                }
            }
            course {
                id
                title
                startTime
                endTime
                hourlyTuition
            }
            sessionsLeft
            lastPaidSessionDatetime
        }
    }
`;
