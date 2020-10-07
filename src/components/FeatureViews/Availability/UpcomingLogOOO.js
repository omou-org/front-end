import React from 'react';
import gql from 'graphql-tag';
import {
    Typography,
    Grid,
    Divider,
    List,
    ListItemText,
    ListItem,
    Paper,
} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import Loading from '../../OmouComponents/Loading';
import { makeStyles } from '@material-ui/core/styles';
import { skyBlue, omouBlue } from '../../../theme/muiTheme';

import moment from 'moment';

export const GET_UPCOMING_INSTRUCTOR_OOO = gql`
    query getInstructorOOO($instructorID: ID!) {
        instructorOoo(instructorId: $instructorID) {
            id
            description
            endDatetime
            startDatetime
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        overflow: 'auto',
        maxHeight: 200,
        height: 200,
    },
    noOOOInformation: {
        backgroundColor: skyBlue,
        height: theme.spacing(10),
    },
}));

const NoOOOInformation = () => {
    const classes = useStyles();
    return (
        <Grid container className={classes.noOOOInformation}>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={8}>
                    <Typography
                        style={{
                            color: omouBlue,
                            fontWeight: 'bold',
                        }}
                    >
                        No OOO information available during this time
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

export const UpcomingOOO = () => {
    const AuthUser = useSelector(({ auth }) => auth);
    const { data, loading, error } = useQuery(GET_UPCOMING_INSTRUCTOR_OOO, {
        variables: { instructorID: AuthUser.user.id },
    });

    const classes = useStyles();

    const currentDate = moment().utc().format();

    if (loading) return <Loading small />;

    if (error) return console.error(error);

    const LogOfCurrentUpcomingInstructorOOO = data.instructorOoo.filter(
        (event) => moment(event.endDatetime).isSameOrAfter(currentDate, 'day')
    );

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h4" align="left">
                    Upcoming
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <List className={classes.root}>
                    {LogOfCurrentUpcomingInstructorOOO.map(
                        ({ id, description, startDatetime, endDatetime }) => (
                            <React.Fragment key={id}>
                                <ListItem container>
                                    <ListItemText
                                        primary={description}
                                        secondary={`${moment(startDatetime).format('L')} - ${moment(endDatetime).format('L')}`}
                                    />
                                </ListItem>
                            </React.Fragment>
                        )
                    )}
                </List>
            </Grid>
        </Grid>
    );
};

export const LogOOO = () => {
    const currentDate = moment().utc().format();
    const AuthUser = useSelector(({ auth }) => auth);
    const { data, loading, error } = useQuery(GET_UPCOMING_INSTRUCTOR_OOO, {
        variables: { instructorID: AuthUser.user.id },
    });

    const classes = useStyles();
    if (loading) return <Loading small />;

    if (error) return console.error(error);

    const logOfInstructorOOO = data.instructorOoo.filter((event) =>
        moment(event.endDatetime).isBefore(currentDate, 'day')
    );

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h4" align="left">
                    Log
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <List className={classes.root}>
                    {logOfInstructorOOO.length !== 0 ? (
                        logOfInstructorOOO.map(
                            ({
                                id,
                                description,
                                startDatetime,
                                endDatetime,
                            }) => (
                                    <React.Fragment key={id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={description}
                                                secondary={
                                                    `${moment(startDatetime).format('L')} - ${moment(endDatetime).format('L')}`
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                )
                        )
                    ) : (
                            <>
                                <NoOOOInformation />
                            </>
                        )}
                </List>
            </Grid>
        </Grid>
    );
};
