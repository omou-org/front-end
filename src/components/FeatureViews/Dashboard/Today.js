import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import * as hooks from "actions/hooks";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TodayCard from "./TodayCard";
import './Dashboard.scss';

const Today = () => {
    const user = useSelector(({auth}) => auth.first_name);
    const today = useSelector(({SearchResults}) => SearchResults) || [];
    const courseList = useMemo(() => 
        today.map(({courses}) => courses), [today]);

    const courseStatus = hooks.useCourse(courseList);
    const todayStatus = hooks.useSearchParams({time: "today"});
    console.log(todayStatus + ' today');
    console.log(courseStatus + ' course')

    if (hooks.isLoading(todayStatus, courseStatus)) {}

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