import React, { useEffect, useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { omouBlue } from '../../../../theme/muiTheme';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Loading from '../../../OmouComponents/Loading';
import { Divider } from '@material-ui/core';

const StyledTableRow = withStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        marginTop: '10px;',
    },
    settingCol: {
        width: '30%',
    },
});

const CREATE_PARENT_NOTIFICATION_SETTINGS = gql`
    mutation createParentNotificationSetting(
        $parent: ID!
        $paymentReminderEmail: Boolean
        $paymentReminderSms: Boolean
        $scheduleUpdatesSms: Boolean
        $sessionReminderEmail: Boolean
        $sessionReminderSms: Boolean
    ) {
        __typename
        createParentNotificationSetting(
            parent: $parent
            paymentReminderEmail: $paymentReminderEmail
            paymentReminderSms: $paymentReminderSms
            scheduleUpdatesSms: $scheduleUpdatesSms
            sessionReminderEmail: $sessionReminderEmail
            sessionReminderSms: $sessionReminderSms
        ) {
            settings {
                paymentReminderEmail
                paymentReminderSms
                scheduleUpdatesSms
                sessionReminderEmail
                sessionReminderSms
            }
        }
    }
`;

const CREATE_INSTRUCTOR_NOTIFICATION_SETTINGS = gql`
    mutation createInstructorNotificationSetting(
        $instructor: ID!
        $scheduleUpdatesSms: Boolean
        $sessionReminderEmail: Boolean
        $sessionReminderSms: Boolean
        $courseRequestSms: Boolean
    ) {
        __typename
        createInstructorNotificationSetting(
            instructor: $instructor
            scheduleUpdatesSms: $scheduleUpdatesSms
            sessionReminderEmail: $sessionReminderEmail
            sessionReminderSms: $sessionReminderSms
            courseRequestsSms: $courseRequestSms
        ) {
            settings {
                courseRequestsSms
                scheduleUpdatesSms
                sessionReminderEmail
                sessionReminderSms
            }
        }
    }
`;

const GET_INSTRUCTOR_NOTIFICATION_SETTINGS = gql`
    query GetInstructorNotificationSettings($instructorId: ID!) {
        instructorNotificationSettings(instructorId: $instructorId) {
            courseRequestsSms
            scheduleUpdatesSms
            sessionReminderEmail
            sessionReminderSms
        }
    }
`;

const GET_PARENT_NOTIFICATION_SETTINGS = gql`
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

const createNotificationSetting = (name, description, email, sms) => ({
    name,
    description,
    email,
    sms,
    optional: false,
});

const createOptInSetting = (name, description, optIn) => ({
    name,
    description,
    optIn,
    optional: true,
});

export default function NotificationSettings({ user }) {
    const { userInfo } = user;
    const classes = useStyles();
    const [notificationRows, setNotificationRows] = useState([]);
    const [optInNotifRows, setOptInNotifRows] = useState([]);
    const isParent = userInfo.accountType === 'PARENT';
    const isInstructor = userInfo.accountType === 'INSTRUCTOR';
    const instructorSettingResponse = useQuery(
        GET_INSTRUCTOR_NOTIFICATION_SETTINGS,
        {
            variables: { instructorId: userInfo.user.id },
            skip: !isInstructor,
        }
    );
    const parentSettingResponse = useQuery(GET_PARENT_NOTIFICATION_SETTINGS, {
        variables: { parentId: userInfo.user.id },
        skip: !isParent,
    });

    const [
        createParentNotification,
        createParentNotificationResults,
    ] = useMutation(CREATE_PARENT_NOTIFICATION_SETTINGS, {
        update: (cache, { data }) => {
            cache.writeQuery({
                data: {
                    parentNotificationSettings:
                        data.createParentNotificationSetting.settings,
                },
                query: GET_PARENT_NOTIFICATION_SETTINGS,
                variables: { parentId: userInfo.user.id },
            });
        },
    });
    const [
        createInstructorNotification,
        createInstructorNotificationResults,
    ] = useMutation(CREATE_INSTRUCTOR_NOTIFICATION_SETTINGS, {
        update: (cache, { data }) => {
            cache.writeQuery({
                data: {
                    instructorNotificationSettings:
                        data.createInstructorNotificationSetting.settings,
                },
                query: GET_INSTRUCTOR_NOTIFICATION_SETTINGS,
                variables: { instructorId: userInfo.user.id },
            });
        },
    });

    // initialize settings
    useEffect(() => {
        let userSettings;
        if (
            instructorSettingResponse.loading === false ||
            parentSettingResponse.loading === false
        ) {
            const {
                data: { instructorNotificationSettings } = {},
            } = instructorSettingResponse;
            const {
                data: { parentNotificationSettings } = {},
            } = parentSettingResponse;

            if (isParent) {
                userSettings = parentNotificationSettings;
            }
            if (isInstructor) {
                userSettings = instructorNotificationSettings;
            }
        }
        setNotificationRows([
            createNotificationSetting(
                'Session Reminder',
                'Get notified when a session is coming up.',
                {
                    settingName: 'sessionReminderEmail',
                    checked: userSettings?.sessionReminderEmail || false,
                },
                {
                    settingName: 'sessionReminderSms',
                    checked: userSettings?.sessionReminderSms || false,
                }
            ),
            createNotificationSetting(
                'Missed Session Notification',
                'Get notified when your student did not attend a session',
                {
                    settingName: 'missedSessionNotificationEmail',
                    checked:
                        userSettings?.missedSessionReminderEmail || false
                },
                {
                    settingName: 'missedSessionNotificationSms',
                    checked:
                        userSettings?.missedSessionReminderSMS || false
                }
            ),
            ...(userInfo.accountType === 'PARENT'
                ? [
                      createNotificationSetting(
                          'Payment Reminder',
                          'Get notified when a payment is coming up.',
                          {
                              settingName: 'paymentReminderEmail',
                              checked:
                                  userSettings?.paymentReminderEmail || false,
                          },
                          {
                              settingName: 'paymentReminderSms',
                              checked:
                                  userSettings?.paymentReminderSms || false,
                          }
                      ),
                  ]
                : []),
        ]);
        setOptInNotifRows([
            createOptInSetting(
                'SMS Schedule Updates',
                'Get notified for schedule changes by SMS',
                {
                    settingName: 'scheduleUpdatesSms',
                    checked: userSettings?.scheduleUpdatesSms || false,
                }
            ),
            createOptInSetting(
                'SMS Course Requests',
                'Get notified for cancellations by SMS',
                {
                    settingName: 'courseRequestsSms',
                    checked: userSettings?.courseRequestsSms || false,
                }
            ),
        ]);
    }, [
        setNotificationRows,
        setOptInNotifRows,
        createNotificationSetting,
        createOptInSetting,
        instructorSettingResponse.loading,
        parentSettingResponse.loading,
    ]);

    const handleSettingChange = (setting, setFunction, index) => (_) => {
        let notificationSettings = {};
        setFunction((prevState) => {
            let newState = JSON.parse(JSON.stringify(prevState));
            newState[index] = {
                ...newState[index],
                [setting]: {
                    ...newState[index][setting],
                    checked: !newState[index][setting].checked,
                },
            };
            notificationRows.forEach(({ email, sms }) => {
                notificationSettings[email.settingName] = email.checked;
                notificationSettings[sms.settingName] = sms.checked;
            });
            optInNotifRows.forEach(({ optIn }) => {
                notificationSettings[optIn.settingName] = optIn.checked;
            });
            const updatedSettingName = prevState[index][setting].settingName;
            notificationSettings[updatedSettingName] = !!newState[index][
                setting
            ].checked;
            return newState;
        });

        if (userInfo.accountType === 'PARENT') {
            notificationSettings.parent = userInfo.user.id;
            createParentNotification({ variables: notificationSettings });
        } else {
            notificationSettings.instructor = userInfo.user.id;
            createInstructorNotification({ variables: notificationSettings });
        }
    };

    if (instructorSettingResponse.loading || parentSettingResponse.loading)
        return <Loading />;

    return (
        <>
            <Grid
                container
                style={{
                    padding: '1%',
                    marginTop: '30px',
                }}
            >
                <Typography style={{ color: omouBlue, fontWeight: 600 }}>
                    Notification Settings
                </Typography>
            </Grid>
            <TableContainer>
                <Table className={classes.table} aria-label='simple table'>
                    <TableBody>
                        <StyledTableRow>
                            <TableCell />
                            <TableCell align='center'>Text Message</TableCell>
                            <TableCell align='center'>Email</TableCell>
                            <TableCell />
                        </StyledTableRow>
                        {notificationRows.map((row, index) => (
                            <StyledTableRow key={row.name}>
                                <TableCell
                                    component='th'
                                    scope='row'
                                    className={classes.settingCol}
                                >
                                    <Typography
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        }}
                                        display='block'
                                    >
                                        {row.name}
                                    </Typography>
                                    <span>{row.description}</span>
                                </TableCell>
                                <TableCell align='center'>
                                    <Checkbox
                                        checked={row.sms.checked}
                                        color='primary'
                                        inputProps={{
                                            'aria-label': 'primary checkbox',
                                        }}
                                        onChange={handleSettingChange(
                                            'sms',
                                            setNotificationRows,
                                            index
                                        )}
                                    />
                                </TableCell>
                                <TableCell align='center'>
                                    <Checkbox
                                        checked={row.email.checked}
                                        color='primary'
                                        inputProps={{
                                            'aria-label': 'primary checkbox',
                                        }}
                                        onChange={handleSettingChange(
                                            'email',
                                            setNotificationRows,
                                            index
                                        )}
                                    />
                                </TableCell>
                                <TableCell />
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid
                container
                style={{
                    backgroundColor: '#F5F5F5',
                    padding: '1%',
                    marginTop: '2%',
                }}
            >
                <Typography style={{ color: omouBlue, fontWeight: 600 }}>
                    Opt-in SMS Notifications
                </Typography>
            </Grid>
            <TableContainer>
                <Table className={classes.table} aria-label='simple table'>
                    <TableBody>
                        {optInNotifRows.map((row, index) => (
                            <StyledTableRow key={row.name}>
                                <TableCell
                                    component='th'
                                    scope='row'
                                    className={classes.settingCol}
                                >
                                    <Typography
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        }}
                                        display='block'
                                    >
                                        {row.name}
                                    </Typography>
                                    <span>{row.description}</span>
                                </TableCell>
                                <TableCell
                                    align='center'
                                    style={{ width: '28%' }}
                                >
                                    <Switch
                                        checked={row.optIn.checked}
                                        color='primary'
                                        inputProps={{
                                            'aria-label': 'primary checkbox',
                                        }}
                                        onChange={handleSettingChange(
                                            'optIn',
                                            setOptInNotifRows,
                                            index
                                        )}
                                    />
                                </TableCell>
                                <TableCell />
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
