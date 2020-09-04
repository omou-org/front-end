import React, { useState, useEffect } from "react";
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import ChevronLeftOutlined from "@material-ui/icons/ChevronLeftOutlined";
import ChevronRightOutlined from "@material-ui/icons/ChevronRightOutlined";
import { makeStyles, Grid, IconButton, Button, FormControl, Select, MenuItem, Typography } from "@material-ui/core"
import moment from 'moment';
import { Calendar, momentLocalizer, } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import { BootstrapInput, handleToolTip, sessionArray } from "./SchedulerUtils";
import CustomPopever from "./CalendarPopover"
import TodayIcon from "@material-ui/icons/Today";
import Tooltip from "@material-ui/core/Tooltip";



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


const localizer = momentLocalizer(moment)

const palette =
    ["#F503B2", "#F47FD4", "#FCA8E4", "#FFC5EF",
        "#DD0000", "#EA2632", "#EB5757", "#FF9191",
        "#2F80ED", "#2D9CDB", "#56CCF2", "#9B51E0",
        "#46D943", "#219653", "#27AE60", "#6FCF97",
        "#F78017", "#F2994A", "#FEBF87", "#FFE3CA",
        "#FFC103", "#F2C94C", "#F4D77D", "#FFEDB5",
        "#72FFFF", "#43D9D9", "#92E2DE", "#BAF7F3",
        "#1F82A1", "#588FA0", "#88ACB7", "#BEDAE2",
        "#96007E", "#B96AAC", "#CD9BC5", "#CD9BC5"]

const hashCode = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
        hash += string.charCodeAt(i);
    }
    return hash;
}
const colorizer = (string) => {
    return palette[hashCode(string) % 40]
}

const eventStyleGetter = (event) => ({
    style: {
        backgroundColor: colorizer(event.instructor)
    }

});


const CustomToolbar = (toolbar) => {
    const [classType, setClassType] = useState("");
    const [viewState, setViewState] = useState('month');
    // create prev state 
    // create courseFilter
    // instructorFilter
    // timeShift
    // viewOption
    const prevState =
        JSON.parse(sessionStorage.getItem('schedulerState')) || {};
    const [courseFilter, setCourseFilter] = useState(prevState.courseFilter);
    const [timeShift, setTimeShift] = useState(prevState.timeShift)
    const [viewOption, setViewOption] = useState(prevState.viewOption || toolbar.view)
    const [courseType, setCourseType] = useState(prevState.courseType);


    const classes = useStyles()

    const handleCourseTypeChange = () => {
        //Needs to handle when we change views from all, tutor and class
    }

    const changeView = (value) => {
        toolbar.onView(value)
        setViewOption(value)
    }

    const handleFilterChange = ({ target }) => {
        toolbar.onView(target.value);
        changeView(target.value)
    }
    const goToBack = () => {
        toolbar.date.setMonth(toolbar.date.getMonth() - 1);
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {

        toolbar.date.setMonth(toolbar.date.getMonth() + 1);
        toolbar.onNavigate('NEXT');
    };

    const goToToday = () => {
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
                            // onChange={handleCourseTypeChange}
                            value={courseType}>
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
                                value={viewOption}
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




export const SchedulerV3 = (props) => {

    const classes = useStyles()
    return (
        <div className={classes.calendarContainer}>
            <Grid item xs={12} container>
                <BackgroundPaper className="scheduler" elevation={2}>
                    <Typography align="left" className="scheduler-title" variant="h3">
                        Scheduler
				</Typography>
                    <br />

                    <Calendar
                        popup
                        localizer={localizer}
                        events={[]}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            toolbar: CustomToolbar,
                            eventWrapper: CustomPopever,

                        }}
                    />
                </BackgroundPaper>
            </Grid>
        </div>
    )
}
