import gql from 'graphql-tag';

// CourseClass.js
export const GET_ANNOUNCEMENTS = gql`
    query getAnnouncement($id: ID!) {
        announcements(courseId: $id) {
            subject
            id
            body
            createdAt
            updatedAt
            poster {
                firstName
                lastName
            }
        }
    }
`;

// NotificationSetting.js
export const GET_INSTRUCTOR_NOTIFICATION_SETTINGS = gql`
    query GetInstructorNotificationSettings($instructorId: ID!) {
        instructorNotificationSettings(instructorId: $instructorId) {
            courseRequestsSms
            scheduleUpdatesSms
            sessionReminderEmail
            sessionReminderSms
        }
    }
`;

export const GET_PARENT_NOTIFICATION_SETTINGS = gql`
    query GetParentNotificationSettings($parentId: ID!) {
        parentNotificationSettings(parentId: $parentId) {
            paymentReminderEmail
            paymentReminderSms
            scheduleUpdatesSms
            sessionReminderEmail
            sessionReminderSms
        }
    }
`;
