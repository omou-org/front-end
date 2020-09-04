import React, { useState, useEffect } from "react";
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import { makeStyles, Grid, Button, FormControl, Select, MenuItem } from "@material-ui/core"
import moment from 'moment';



const useStyles = makeStyles({
    root: {

    },
    toolbarContainer: {

    },
    labelDate: {
        alighContent: "center"
    },
    calendarContainer: {
        padding: 50
    }
})



export const CustomToolbar = (toolbar) => {
    const [classType, setClassType] = useState("");
    const [viewState, setViewState] = useState('month');
    // create prev state 
    // create courseFilter
    // instructorFilter
    // timeShift
    // viewOption
    const now = new Date();
    const prevState =
        JSON.parse(sessionStorage.getItem('schedulerState')) || {};
    const [courseFilter, setCourseFilter] = useState(prevState.courseFilter);
    const [timeShift, setTimeShift] = useState(prevState.timeShift)
    const [viewOption, setViewOption] = useState(prevState.viewOption || toolbar.view)
    const [courseType, setCourseType] = useState(prevState.courseType);


    const classes = useStyles()

    console.log(toolbar)


    const changeView = (value) => {
        toolbar.onView(value)
        setViewOption(value)
    }

    const handleFilterChange = ({ target }) => {
        toolbar.onView(target.value);
        setViewState(target.value)
    }
    const goToBack = () => {
        toolbar.date.setMonth(toolbar.date.getMonth() - 1);
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {

        toolbar.date.setMonth(toolbar.date.getMonth() + 1);
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        const now = new Date();
        toolbar.date.setMonth(now.getMonth());
        toolbar.date.setYear(now.getFullYear());
        toolbar.onNavigate('CURRENT');
    };



    const label = () => {

        return (
            <span>{toolbar.label}</span>
        );
    };



    useEffect(() => {
        sessionStorage.setItem('schedulerState', JSON.stringify({
            courseFilter,
            timeShift,
            viewOption,
            courseType,

        }))
    }, [courseFilter, timeShift, viewOption, courseType])



    return (

        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={classes.toolbarContainer}>
            <Grid item className={"actionButtons"}>
                <Button
                    onClick={() => changeView('month')}
                ><DateRangeOutlinedIcon /> </Button>
                <Button
                    onClick={() => changeView('agenda')}
                ><FormatListBulletedOutlinedIcon /></Button>
                <Button><FilterListOutlinedIcon /></Button>
                <FormControl id="simple-select">
                    <Select
                        labelId="simple-select"
                        value={viewOption}
                        onChange={handleFilterChange}
                    >
                        <MenuItem value={'All'}>All</MenuItem>
                        <MenuItem value={'Class'}>Class</MenuItem>
                        <MenuItem value={'Tutor'}>Tutor</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item align="center">
                <Button className={['btn-back']} onClick={goToBack}>&#8249;</Button>
                {label()}
                <Button className={['btn-next']} onClick={goToNext}>&#8250;</Button>
            </Grid>


            <Grid item >
                <Button className={['btn-current']} onClick={goToCurrent}>today</Button>

            </Grid>

            <Grid>
                <FormControl className="filter-select">
                    <Select
                        onChange={handleFilterChange}
                    >
                        <MenuItem value="day">Day</MenuItem>
                        <MenuItem value="week">Week</MenuItem>
                        <MenuItem value="month">Month</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

        </Grid >
    );
};