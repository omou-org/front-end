import React from 'react';
import Typography from '@material-ui/core/Typography';
import TodayCard from './TodayCard';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Loading from 'components/OmouComponents/Loading';
import './Dashboard.scss';
import Grid from '@material-ui/core/Grid';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';

const Today = (filter) => {
    const TODAY_SESSION_QUERY = gql`
        query todaySessionQuery($filter: String = "") {
            sessionSearch(query: $filter, time: "today", sort: "timeAsc") {
                results {
                    id
                    course {
                        title
                        availabilityList {
                            startTime
                        }
                        maxCapacity
                        id
                        enrollmentSet {
                            id
                        }
                        courseCategory {
                            id
                            name
                        }
                        instructor {
                            user {
                                firstName
                                lastName
                                id
                            }
                        }
                    }
                }
            }
        }
    `;

    const { data, loading, error } = useQuery(TODAY_SESSION_QUERY, {
        variables: filter,
    });

    if (loading) {
        return <Loading loadingText='SESSIONS ARE LOADING' small />;
    }

    if (error) {
        console.error(error);
        return <>There has been an error: {error.message}</>;
    }

    const sessionArray = data.sessionSearch.results;

    if (!sessionArray || sessionArray.length === 0) {
        return (
            <Card className='today-card'>
                <CardContent>
                    <Typography>No sessions today!</Typography>
                </CardContent>
            </Card>
        );
    } else if (sessionArray) {
        return (
            <>
                {sessionArray.map((session) => (
                    <Grid item md={6} lg={3}>
                        <TodayCard key={session} session={session} />
                    </Grid>
                ))}
            </>
        );
    }
};

export default Today;
