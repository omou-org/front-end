import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import {useSearchSession} from "actions/searchActions";
import * as hooks from "actions/hooks";
import Typography from "@material-ui/core/Typography";
import TodayCard from "./TodayCard";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Loading from "components/Loading";
import './Dashboard.scss';

const Today = () => {
    const sessionSearchResult = useSelector(({Search}) => Search.sessions);
    const sessionArray = sessionSearchResult.results ;
    
    const instructorStatus = hooks.useInstructor();
    const courseStatus = hooks.useCourse();
    const sessionStatus = useSearchSession(1, "today", "timeAsc");

    if (hooks.isLoading(instructorStatus, courseStatus, sessionStatus)) {
        return (
            <Loading
                loadingText="SESSIONS ARE LOADING"
                small />
        );
    }

    if (sessionArray.length === 0) {
        return (
            <Card className="today-card">
                <CardContent>
                    <Typography>
                        No sessions today!
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    // return (
    //     <TodayCard/>
    // )

 
    return sessionArray.map((session) => (
            <TodayCard 
                key={session}
                session={session}
                />
    ));
};

export default Today;