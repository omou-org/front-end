import React from 'react';
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import HappyIcon from '@material-ui/icons/SentimentVerySatisfied';
import Typography from '@material-ui/core/Typography';
import Loading from 'components/OmouComponents/Loading';
import UnpaidSessionCard from './UnpaidSessionCard';
import './AdminPortal.scss';

const UnpaidSessions = () => {
    const UNPAID_SESSION_QUERY = gql`
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

    const { data, loading, error } = useQuery(UNPAID_SESSION_QUERY);

    if (loading) {
        return <Loading loadingText='UNPAID SESSIONS LOADING' small />;
    }

    if (error) {
        console.error(error);
        return <>There has been an error: {error.message}</>;
    }

    const UnpaidList = data.unpaidSessions;

    if (UnpaidList.length === 0) {
        return (
            <Card className='no-unpaid-sessions'>
                <CardContent>
                    <Typography variant='h5'>
                        No unpaid sessions to display!
                    </Typography>
                    <HappyIcon fontSize='large' />
                </CardContent>
            </Card>
        );
    }

    return UnpaidList.map((unpaidStudent) => (
        <UnpaidSessionCard key={unpaidStudent} unpaidStudent={unpaidStudent} />
    ));
};

export default UnpaidSessions;
