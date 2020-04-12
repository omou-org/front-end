import React, {useMemo} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as hooks from "actions/hooks";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TodayCard from "./TodayCard";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Loading from "components/Loading";
import './Dashboard.scss';

const Today = () => {
    const user = useSelector(({auth}) => auth.first_name) || [];
    const TodayList = useSelector(({Search}) => Search) || [];
    
    const sessionList = useMemo(() =>
        TodayList.sessions);

    const sessionStatus = hooks.useSessionSearchQuery(sessionList);

    

    // const sessionList = useMemo(() =>
    //     today.map(({sessions}) => sessions), [today]);
    // console.log(sessionList);

    // console.log(today, sessionList);

    // const courseList = useMemo(() => 
    //     today.map(({courses}) => courses), [today]);

    // const courseStatus = hooks.useCourse(courseList);
    // const todayStatus = hooks.useSearchParams();
    // console.log(todayStatus + ' today');
    // console.log(courseStatus + ' course')

    // if (hooks.isLoading(todayStatus, courseStatus)) {}

    // const sessionStatus = hooks.useSessionSearchQuery(sessionList);
    // console.log(sessionStatus);
    // console.log(hooks.isLoading(sessionStatus))

    if (hooks.isLoading(sessionStatus)) {
        return (
            <Loading
                loadingText="SESSIONS ARE LOADING"
                small />
        );
    }

    if (sessionList.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography>
                        No sessions today!
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return( 
    <Paper className="Paper">
        <Typography className="hello-user">
            Hello {user}!
        </Typography>
        <br/>
        <TodayCard/>
    </Paper>
    )
};

export default Today;