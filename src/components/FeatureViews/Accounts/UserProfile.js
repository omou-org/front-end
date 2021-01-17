import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BioIcon from '@material-ui/icons/PersonOutlined';
import ContactIcon from '@material-ui/icons/ContactPhoneOutlined';
import CoursesIcon from '@material-ui/icons/SchoolOutlined';
import CurrentSessionsIcon from '@material-ui/icons/AssignmentOutlined';
import NoteIcon from '@material-ui/icons/NoteOutlined';
import PastSessionsIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import PaymentIcon from '@material-ui/icons/CreditCardOutlined';
import ScheduleIcon from '@material-ui/icons/CalendarTodayOutlined';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import { LabelBadge } from '../../../theme/ThemedComponents/Badge/LabelBadge';
import NotificationIcon from '@material-ui/icons/NotificationImportant';
import './Accounts.scss';

import BackButton from 'components/OmouComponents/BackButton';
import ComponentViewer from './ComponentViewer.js';
import Loading from 'components/OmouComponents/Loading';

import { useAccountNotes } from 'actions/userActions';

import SettingsIcon from '@material-ui/icons/Settings';
import { USER_TYPES } from '../../../utils';

import UserProfileInfo from './UserProfileInfo';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const userTabs = {
    instructor: [
        {
            icon: <ScheduleIcon className="TabIcon" />,
            tab_heading: 'Schedule',
            access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
            tab_id: 0,
        },
        {
            icon: <CoursesIcon className="TabIcon" />,
            tab_heading: 'Courses',
            access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
            tab_id: 1,
        },
        {
            icon: <BioIcon className="TabIcon" />,
            tab_heading: 'Bio',
            access_permissions: [
                USER_TYPES.receptionist,
                USER_TYPES.admin,
                USER_TYPES.instructor,
                USER_TYPES.parent,
            ],
            tab_id: 2,
        },
        {
            icon: <NoteIcon className="TabIcon" />,
            tab_heading: 'Notes',
            access_permissions: [
                USER_TYPES.receptionist,
                USER_TYPES.admin,
                USER_TYPES.instructor,
            ],
            tab_id: 7,
        },
        {
            icon: <SettingsIcon className="SettingsIcon" />,
            tab_heading: 'Notification Settings',
            access_permissions: [USER_TYPES.instructor],
            tab_id: 11,
        },
    ],
    parent: [
        {
            icon: <CurrentSessionsIcon className="TabIcon" />,
            tab_heading: 'Student Info',
            access_permissions: [
                USER_TYPES.receptionist,
                USER_TYPES.admin,
                USER_TYPES.parent,
            ],
            tab_id: 8,
        },
        {
            icon: <PaymentIcon className="TabIcon" />,
            tab_heading: 'Payment History',
            access_permissions: [
                USER_TYPES.receptionist,
                USER_TYPES.admin,
                USER_TYPES.parent,
            ],
            tab_id: 5,
        },
        {
            icon: <NotificationIcon className="TabIcon" />,
            tab_heading: 'Notes',
            access_permissions: [
                USER_TYPES.receptionist,
                USER_TYPES.admin,
                USER_TYPES.parent,
            ],
            tab_id: 7,
        },
        {
            icon: <SettingsIcon className="SettingsIcon" />,
            tab_heading: 'Notification Settings',
            access_permissions: [USER_TYPES.parent],
            tab_id: 11,
        },
    ],
    student: [
        {
            icon: <CurrentSessionsIcon className="TabIcon" />,
            tab_heading: 'Current Course(s)',
            access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
            tab_id: 3,
        },
        {
            icon: <PastSessionsIcon className="TabIcon" />,
            access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
            tab_heading: 'Past Course(s)',
            tab_id: 4,
        },
        {
            icon: <ContactIcon className="TabIcon" />,
            access_permissions: [
                USER_TYPES.receptionist,
                USER_TYPES.admin,
                USER_TYPES.student,
                USER_TYPES.parent,
            ],
            tab_heading: 'Parent Contact',
            tab_id: 6,
        },
        {
            icon: <NoteIcon className="TabIcon" />,
            access_permissions: [
                USER_TYPES.receptionist,
                USER_TYPES.admin,
                USER_TYPES.student,
                USER_TYPES.parent,
            ],
            tab_heading: 'Notes',
            tab_id: 7,
        },
    ],
    admin: [
        {
            icon: '',
            tab_heading: 'Action Log',
            access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
            tab_id: 10,
        },
        {
            icon: '',
            tab_heading: 'Notes',
            access_permissions: [USER_TYPES.receptionist, USER_TYPES.admin],
            tab_id: 7,
        },
    ],
};

const GET_ACCOUNT_NOTES = `
	notes(userId: $ownerID) {
		id
		body
		complete
		important
		timestamp
		title
	}`;

const QUERIES = {
    student: gql`query StudentInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on StudentType {
			birthDate
			grade
			phoneNumber
			user {
			  id
			  firstName
			  lastName
			  email
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	}
	`,
    parent: gql`
	query ParentInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on ParentType {
			balance
			accountType
			phoneNumber
			user {
			  email
			  id
			  firstName
			  lastName
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`,
    instructor: gql`query InstructorInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on InstructorType {
			userUuid
			phoneNumber
			birthDate
			accountType
			biography
		  	experience
			language
			 subjects {
			  name
			}
			user {
			  lastName
			  firstName
			  id
			  email
			}
			instructoravailabilitySet {
			  dayOfWeek
			  endDatetime
			  startDatetime
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`,
    admin: gql`
	  query AdminInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on AdminType {
			birthDate
			phoneNumber
			adminType
			accountType
			user {
			  firstName
			  lastName
			  id
			  email
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`,
};

const useStyles = makeStyles({
    MuiIndicator: {
        height: '1px',
    },
});

const UserProfile = () => {
    const { accountType, accountID } = useParams();
    const [tabIndex, setTabIndex] = useState(0);
    const [displayTabs, setDisplayTabs] = useState(userTabs[accountType]);

    const AuthUser = useSelector(({ auth }) => auth);

    // check if user is viewing a differnt profile
    const classes = useStyles();
    //

    // reset to first tab when profile changes
    useEffect(() => {
        setTabIndex(0);
    }, [accountType, accountID]);

    // reset tab list when profile type changes
    useEffect(() => {
        setDisplayTabs(userTabs[accountType]);
    }, [accountType]);

    const { loading, error, data } = useQuery(QUERIES[accountType], {
        variables: { ownerID: accountID },
    });

    if (loading) return <Loading />;

    if (error) return <Redirect to="/PageNotFound" />;

    const { notes } = data;
    const numImportantNotes = notes.filter((note) => note.important).length;
    const importantNotesBadge =
        numImportantNotes > 0 ? numImportantNotes : null;

    const handleTabChange = (_, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    const tabsInViewforAccountType = (tab, accountType) =>
        tab.access_permissions.includes(accountType);

    const tabs = () => {
        return (
            <>
                <Tabs
                    classes={{ indicator: classes.MuiIndicator }}
                    onChange={handleTabChange}
                    value={tabIndex}
                >
                    {displayTabs
                        .filter((tab) =>
                            tabsInViewforAccountType(tab, AuthUser.accountType)
                        )
                        .map((currentTab) =>
                            currentTab.tab_id === 7 ? (
                                <Tab
                                    key={currentTab.tab_id}
                                    label={
                                        <span>
                                            {currentTab.tab_heading}{' '}
                                            {currentTab.icon}
                                            {importantNotesBadge}
                                        </span>
                                    }
                                />
                            ) : (
                                <Tab
                                    key={currentTab.tab_id}
                                    label={<>{currentTab.tab_heading}</>}
                                />
                            )
                        )}
                </Tabs>
                <ComponentViewer
                    inView={
                        displayTabs.filter((tab) =>
                            tabsInViewforAccountType(tab, AuthUser.accountType)
                        )[tabIndex]?.tab_id
                    }
                    user={data}
                    id={accountID}
                />
            </>
        );
    };

    return (
        <div className="UserProfile">
            <BackButton warn={false} />
            <hr />
            <UserProfileInfo user={data.userInfo} />
            {tabs()}
        </div>
    );
};

UserProfile.propTypes = {};

export default UserProfile;
