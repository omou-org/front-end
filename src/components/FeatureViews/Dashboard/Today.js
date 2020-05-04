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
import Grid from '@material-ui/core/Grid';


const Today = () => {
    const sessionSearchResult = useSelector(({Search}) => Search.sessions);
    const sessionArray = sessionSearchResult.results ;
    
    const instructorStatus = hooks.useInstructor();
    const courseStatus = hooks.useCourse();
    const sessionStatus = useSearchSession("", 1, "today", "timeAsc");
    const categoryStatus = hooks.useCategory();

    console.log(sessionArray);

    if (hooks.isLoading(instructorStatus, courseStatus, sessionStatus, categoryStatus)) {
        return (
            <Loading
                loadingText="SESSIONS ARE LOADING"
                small />
        );
    }

    if (!sessionArray || sessionArray.length === 0) {
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
 
    else if (sessionArray) {
        return (
            <>
            {sessionArray.map((session)=> (
                <Grid item md={6} lg ={3}>
                <TodayCard
                    key={session}
                    session={session}
                    />
                </Grid>    
                    )
            )}
        </>
        )
    };
};

export default Today;