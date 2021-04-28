import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import gql from 'graphql-tag';
import {
    Tooltip,
    Typography,
    withStyles,
    makeStyles,
    Button,
    Divider,
} from '@material-ui/core';
import { stringToColor } from '../Accounts/accountUtils';
import { darkBlue, darkGrey, statusRed } from '../../../theme/muiTheme';

import SessionDetails from './SessionDetails';

import 'date-fns';

import SessionControls from './SessionControls'

const useStyles = makeStyles((theme) => ({
    current_session: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '1em',
        marginTop: '1em',
        marginBottom: '1em',
    },
    course_icon: {
        width: '.75em',
        height: '.75em',
    },
    divider: {
        backgroundColor: 'black',
    },
    new_sessions_typography: {
        color: darkBlue,
        fontWeight: 500,
        lineHeight: '1em',
        fontSize: '1rem',
        float: 'left',
    },
    subtitle: {
        color: darkGrey,
        float: 'left',
        fontWeight: 500,
    },
    save_button: {
        backgroundColor: '#289FC3',
        color: 'white',
        borderRadius: 5,
        fontSize: '.875rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
        lineHeight: '1rem',
        height: '2.5em',
        width: '6.875em'
    },
    type_of_edit: {
        backgroundColor: darkBlue,
        borderRadius: 2,
        padding: '.25em 0.765625em !important',
        marginTop: '.25em',
        marginBottom: '.925em'
    },
    mini_titles_format: {
        letterSpacing: '0.02em',
        fontWeight: 500,
        lineHeight: '1em',
        color: darkGrey,
        marginBottom: '.5em',
        fontVariant: 'small-caps'
    }
}));

const GET_SESSION = gql`
    query SessionViewQuery($sessionId: ID!) {
        session(sessionId: $sessionId) {
            id
            startDatetime
            title
            instructor {
                user {
                    id
                    firstName
                    lastName
                }
            }
            course {
                id
                isConfirmed
                room
                availabilityList {
                    dayOfWeek
                    startTime
                    endTime
                }
                startDate
                endDate
                courseCategory {
                    id
                    name
                }
                instructor {
                    user {
                        id
                        firstName
                        lastName
                    }
                    subjects {
                        name
                    }
                }
                enrollmentSet {
                    student {
                        user {
                            id
                            firstName
                            lastName
                        }
                    }
                }
            }
            endDatetime
            startDatetime
        }
        courseCategories {
            name
            id
        }
        instructors {
            user {
              firstName
              id
              lastName
            }
        }
    }
`;

const CHECK_SCHEDULE_CONFLICTS = gql`
query checkScheduleConflicts(
    $date: String! 
    $startTime: String!
    $endTime: String!
    $instructorId: ID!
    ) {
    validateSessionSchedule(date: $date, endTime: $endTime, instructorId: $instructorId, startTime: $startTime) {
      reason
      status
    }
  }
`

const styles = (username) => ({
    backgroundColor: stringToColor(username),
    color: 'white',
    width: '3vw',
    height: '3vw',
    fontSize: 15,
    marginRight: 10,
});

const SessionContainer = () => {
    const { session_id, editType } = useParams();

    return(
        <>
        <SessionDetails />
        <SessionControls />
        </>
    )

}

export default SessionContainer;
