import React, { useCallback, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import DayAvailabilityEntry from './DayAvailabilityEntry';
import { TimeAvailabilityContext } from './TimeAvailabilityContext';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import Loading from '../../OmouComponents/Loading';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';
import Moment from 'react-moment';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { GET_INSTRUCTOR_AVAILABILITY } from '../../../queries/AccountsQuery/AccountsQuery';

const CREATE_INSTRUCTOR_AVAILABILITIES = gql`
    mutation CreateInstructorAvailabilities(
        $availabilities: [InstructorAvailabilityInput]!
    ) {
        __typename
        createInstructorAvailabilities(availabilities: $availabilities) {
            instructorAvailabilities {
                endTime
                startTime
                id
                dayOfWeek
            }
        }
    }
`;

const DELETE_INSTRUCTOR_AVAILABILITY = gql`
    mutation DeleteInstructorAvailabilities($availabilities: [ID]!) {
        __typename
        deleteInstructorAvailabilities(availabilities: $availabilities) {
            deleted
        }
    }
`;

const dateToIndex = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};
const indexToDate = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
};

export default function TimeAvailabilityContainer() {
    const [autoApprove, setAutoApprove] = useState(false);
    const [availabilitiesByDayOfWeek, setAvailability] = useState([
        { dayOfWeek: 'SUNDAY', availabilities: {} },
        { dayOfWeek: 'MONDAY', availabilities: {} },
        { dayOfWeek: 'TUESDAY', availabilities: {} },
        { dayOfWeek: 'WEDNESDAY', availabilities: {} },
        { dayOfWeek: 'THURSDAY', availabilities: {} },
        { dayOfWeek: 'FRIDAY', availabilities: {} },
        { dayOfWeek: 'SATURDAY', availabilities: {} },
    ]);
    const [openSaveAvailability, setOpenSaveAvailability] = useState(false);
    const [updatedAvailability, setUpdatedAvailability] = useState([]);
    const AuthUser = useSelector(({ auth }) => auth);
    const { data, loading } = useQuery(GET_INSTRUCTOR_AVAILABILITY, {
        variables: { instructorId: AuthUser.user.id },
    });
    const [deleteAvailabilities, deleteResults] = useMutation(
        DELETE_INSTRUCTOR_AVAILABILITY,
        {
            onCompleted: () => setOpenSaveAvailability(true),
        }
    );
    const [addAvailabilities, createResults] = useMutation(
        CREATE_INSTRUCTOR_AVAILABILITIES,
        {
            onCompleted: () => setOpenSaveAvailability(true),
            update: (cache, { data }) => {
                const {
                    createInstructorAvailabilities: {
                        instructorAvailabilities,
                    },
                } = data;
                setUpdatedAvailability(instructorAvailabilities);
            },
        }
    );

    useEffect(() => {
        if (!loading) {
            const { instructorAvailability } = data;
            if (instructorAvailability.length > 0) {
                setAvailability((prevState) => {
                    let newState = JSON.parse(JSON.stringify(prevState));
                    instructorAvailability.forEach((availability) => {
                        const availabilityIndex =
                            dateToIndex[availability.dayOfWeek];
                        newState[availabilityIndex] = {
                            dayOfWeek: availability.dayOfWeek,
                            availabilities: {
                                ...newState[availabilityIndex].availabilities,
                                [availability.id]: {
                                    ...availability,
                                    startTime: moment(
                                        availability.startTime,
                                        'hh:mm:ss'
                                    ),
                                    endTime: moment(
                                        availability.endTime,
                                        'hh:mm:ss'
                                    ),
                                },
                            },
                        };
                    });
                    return newState;
                });
            }
        }
    }, [data]);

    const handleAutoApprove = useCallback(() => {
        setAutoApprove(!autoApprove);
    }, [setAutoApprove, autoApprove]);

    const updateAvailability = (
        startTime,
        endTime,
        dayOfWeekIndex,
        availabilityId,
        toDelete,
        toDisable
    ) => {
        setAvailability((prevAvailability) => {
            let updatedAvailability = [...prevAvailability];
            const dateToUpdateAvailability = prevAvailability[dayOfWeekIndex];
            const newAvailabilities = (availabilityId, toDelete) => {
                if (toDelete) {
                    return {
                        ...dateToUpdateAvailability.availabilities,
                        [availabilityId]: {
                            ...dateToUpdateAvailability.availabilities[
                                availabilityId
                            ],
                            toDelete: true,
                            toDisable: toDisable,
                        },
                    };
                } else {
                    return {
                        ...dateToUpdateAvailability.availabilities,
                        [availabilityId]: {
                            startTime: moment(startTime),
                            endTime: moment(endTime),
                            id: availabilityId,
                            dayOfWeek: indexToDate[dayOfWeekIndex],
                            edited: true,
                        },
                    };
                }
            };

            const newTempAvailabilityId =
                availabilityId ||
                `${
                    Object.keys(dateToUpdateAvailability.availabilities).length
                }_new`;
            updatedAvailability[dayOfWeekIndex] = {
                ...dateToUpdateAvailability,
                availabilities: newAvailabilities(
                    newTempAvailabilityId,
                    toDelete
                ),
            };

            return updatedAvailability;
        });
    };

    const handleAvailability = () => {
        const availabilitiesPayload = [].concat
            .apply(
                [],
                availabilitiesByDayOfWeek.map((availability) =>
                    Object.values(availability.availabilities)
                )
            )
            .filter(
                (availability) => availability?.edited || availability?.toDelete
            )
            .map((availability) => ({
                instructor: AuthUser.user.id,
                dayOfWeek: availability.dayOfWeek,
                startTime: availability.startTime.format('H:mm'),
                endTime: availability.endTime.format('H:mm'),
                id: availability.id,
                toDelete: availability.toDelete || false,
            }));
        const availabilitiesToDelete = availabilitiesPayload
            .filter(({ toDelete, id }) => toDelete || id.indexOf('new') < 0)
            .map((availability) => availability.id);
        const availabilitiesToAdd = availabilitiesPayload
            .filter(({ toDelete }) => !toDelete)
            .map(({ instructor, dayOfWeek, startTime, endTime }) => ({
                instructor,
                dayOfWeek,
                startTime,
                endTime,
            }));

        addAvailabilities({
            variables: { availabilities: availabilitiesToAdd },
        });
        deleteAvailabilities({
            variables: { availabilities: availabilitiesToDelete },
        });
    };

    if (loading) return <Loading small />;

    return (
        <TimeAvailabilityContext.Provider
            value={{ availabilitiesByDayOfWeek, updateAvailability }}
        >
            <Grid item container justify='space-between' direction='row'>
                <Grid
                    item
                    container
                    justify='flex-start'
                    direction='column'
                    xs={9}
                >
                    <Grid item>
                        <Typography variant='h4' align='left'>
                            Tutoring Hours
                        </Typography>
                    </Grid>
                    <Grid item style={{ textAlign: 'left' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={autoApprove}
                                    onChange={handleAutoApprove}
                                    name='autoApprove'
                                    color='primary'
                                />
                            }
                            label='Auto Approve Upcoming Requests'
                        />
                    </Grid>
                    <Grid item>
                        <Typography
                            style={{ fontStyle: 'italic', fontSize: '.8em' }}
                            align='left'
                        >
                            By checking this box, I consent to auto-accept
                            upcoming requests that match with my availability.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <ResponsiveButton
                        variant='outlined'
                        style={{ marginRight: '10px' }}
                    >
                        reset all
                    </ResponsiveButton>
                    <ResponsiveButton
                        variant='outlined'
                        onClick={handleAvailability}
                    >
                        update
                    </ResponsiveButton>
                </Grid>
            </Grid>
            <Grid item xs={12} container>
                <Table>
                    {availabilitiesByDayOfWeek.map(
                        ({ dayOfWeek, availabilities }, index) => (
                            <DayAvailabilityEntry
                                key={index}
                                availabilities={availabilities}
                                dayOfWeek={dayOfWeek}
                                dayIndex={index}
                            />
                        )
                    )}
                </Table>
            </Grid>
            <Dialog
                open={openSaveAvailability}
                onClose={() => setOpenSaveAvailability(false)}
            >
                <DialogTitle disableTypography>
                    Successfully updated availability hours!
                </DialogTitle>
                <DialogContent>
                    Here is a summary of your updated hours:
                    <Table>
                        {updatedAvailability.map((availability) => (
                            <TableRow key={availability.id}>
                                <TableCell>{availability.dayOfWeek}</TableCell>
                                <TableCell>
                                    <Moment
                                        date={availability.startTime}
                                        format='h:mm A'
                                        parse='HH:mm:ss'
                                    />
                                </TableCell>
                                <TableCell>
                                    <Moment
                                        date={availability.endTime}
                                        format='h:mm A'
                                        parse='HH:mm:ss'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </DialogContent>
            </Dialog>
        </TimeAvailabilityContext.Provider>
    );
}
