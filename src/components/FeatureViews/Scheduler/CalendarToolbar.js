import React, { useState, useEffect } from "react";
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import ChevronLeftOutlined from "@material-ui/icons/ChevronLeftOutlined";
import ChevronRightOutlined from "@material-ui/icons/ChevronRightOutlined";
import { makeStyles, Grid, IconButton, FormControl, Select, MenuItem, Typography } from "@material-ui/core"
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { BootstrapInput } from "./SchedulerUtils";
import TodayIcon from "@material-ui/icons/Today";
import Tooltip from "@material-ui/core/Tooltip";
import { GET_ALL_EVENTS } from "./CalendarQuery";
import { useQuery } from "@apollo/react-hooks";
import { useDispatch, useSelector } from "react-redux";
import * as types from "../../../actions/actionTypes";

import { useSessionStorage } from "../../../utils"


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
    },
    dropdownStyle: {
        borderRadius: "10px",
    },
})






export const CustomToolbar = (toolbar) => {
    const authUser = useSelector(({ auth }) => auth);


    const prevState =
        JSON.parse(sessionStorage.getItem('schedulerState')) || {};

    const [timeShift, setTimeShift] = useSessionStorage("timeShift", prevState.timeShift || 0)
    const [timeFrame, setTimeFrame] = useSessionStorage("timeFrame", prevState.viewOption || "day")
    const [viewOption, setViewOption] = useSessionStorage("viewOption", 'tutoring');
    const [instructorId, setInstructorId] = useState(authUser.accountType === 'ADMIN' ? null : authUser.user.id)
    const dispatch = useDispatch();



    const classes = useStyles()



    // timeFrame [month,day,week]
    //timeShift [0,1,2,3...]
    //viewOption [all,tutoring,class]




    const { loading, data, error } = useQuery(GET_ALL_EVENTS, {
        variables: {
            instructorId: instructorId,
            timeFrame: timeFrame,
            timeShift: timeShift,
            viewOption: viewOption
        },
        onCompleted: ({ sessions }) => {

            dispatch({
                type: types.GET_CALENDAR_EVENTS,
                payload: { sessions }
            })
        },
        onError: (error) => {
            return error
        }
    });

    useEffect(() => {
        toolbar.onView(timeFrame)
        setTimeShift(timeShift)
    }, [])




    const handleViewOptionChange = ({ target }) => {
        setViewOption(target.value);
    }


    const changeView = (value) => {
        toolbar.onView(value)
        setTimeFrame(value)
    }

    const handleFilterChange = ({ target }) => {
        toolbar.onView(target.value);
        changeView(target.value)
    }
    const goToBack = () => {
        setTimeShift(prevState => prevState - 1)
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        setTimeShift(prevState => prevState + 1)
        toolbar.onNavigate('NEXT');
    };

    const goToToday = () => {
        setTimeShift(0)
        toolbar.onNavigate('TODAY');
    };



    const label = () => {

        switch (toolbar.view) {
            case 'month':
                let label = String(toolbar.label).slice(0, -4)
                return (
                    <span>{label}</span>
                )

            case 'day':
                let date = toolbar.date
                return (
                    <span>{moment(date).format('MMMM Do')}</span>
                )

            default:
                return (
                    <span>{toolbar.label}</span>
                );
        }
    }









    return (

        <Grid
            container
            direction="row"
            className={classes.toolbarContainer}>
            <Grid
                className="scheduler-header"
                container
                item xs={4}>
                <Grid item >
                    <IconButton
                        onClick={() => changeView('month')}
                    >
                        <DateRangeOutlinedIcon />
                    </IconButton>

                </Grid>
                <Grid item >
                    <IconButton
                        onClick={() => changeView('agenda')}
                    >
                        <FormatListBulletedOutlinedIcon /></IconButton>
                </Grid>


                <Grid item xs={6}>
                    <FormControl className="filter-select">
                        <Select input={
                            <BootstrapInput id="filter-calendar-type"
                                name="courseFilter" />
                        }
                            MenuProps={{
                                "classes": {
                                    "paper": classes.dropdownStyle,
                                },
                            }}
                            onChange={handleViewOptionChange}
                            value={viewOption}>
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="class">
                                Class
										</MenuItem>
                            <MenuItem value="tutoring">
                                Tutoring
										</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid
                item
                xs={4}
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item>
                    <IconButton aria-label="prev-month"
                        className="prev-month" onClick={goToBack}>
                        <ChevronLeftOutlined />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography variant="h6">
                        {label()}
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton aria-label="next-month"
                        className="next-month" onClick={goToNext}>
                        <ChevronRightOutlined />
                    </IconButton>
                </Grid>
            </Grid>

            <Grid item xs={2} />
            <Grid item xs={2}>
                <Grid className="scheduler-header-last" container
                    direction="row" justify="flex-end">
                    <Grid item xs={3}>
                        <Tooltip title="Go to Today">
                            <IconButton aria-label="current-date-button"
                                className="current-date-button"
                                onClick={goToToday}>
                                <TodayIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={9}>
                        <FormControl className="filter-select">
                            <Select input={
                                <BootstrapInput id="filter-calendar-type"
                                    name="courseFilter" />
                            }
                                MenuProps={{
                                    "classes": {
                                        "paper": classes.dropdownStyle,
                                    },
                                }}
                                onChange={handleFilterChange}
                                value={timeFrame}
                            >
                                <MenuItem value="day">
                                    Day
										</MenuItem>
                                <MenuItem value="week">
                                    Week
										</MenuItem>
                                <MenuItem value="month">
                                    Month
										</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

        </Grid >
    );
};


