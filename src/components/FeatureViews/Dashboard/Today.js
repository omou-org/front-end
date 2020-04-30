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
    const categories = useSelector(({Course}) => Course.CourseCategories);
    const sessionArray = sessionSearchResult.results ;
    
    const instructorStatus = hooks.useInstructor();
    const courseStatus = hooks.useCourse();
    const sessionStatus = useSearchSession("", 1, "", "timeAsc");
    const categoryStatus = hooks.useCategory();

    if (hooks.isLoading(instructorStatus, courseStatus, sessionStatus, categoryStatus)) {
        return (
            <Loading
                loadingText="SESSIONS ARE LOADING"
                small />
        );
    }

    if (!sessionArray || sessionArray.length === 0) {
        return (
            <Card className="today-card" >
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
                <TodayCard
                    key={session}
                    session={session}
                    />)
            )}
        </>
        )
    };
};

export default Today;