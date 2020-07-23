import React, { useCallback, useEffect, useMemo, useRef, createRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import listViewPlugin from "@fullcalendar/list";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";

import ChevronLeftOutlined from "@material-ui/icons/ChevronLeftOutlined";
import ChevronRightOutlined from "@material-ui/icons/ChevronRightOutlined";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TodayIcon from "@material-ui/icons/Today";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import ListIcon from "@material-ui/icons/List"
import CalendarIcon from "@material-ui/icons/CalendarToday";
import Loading from "../../OmouComponents/Loading"
import moment from "moment"
import { Calendar, OptionsInput } from '@fullcalendar/core'


import "./scheduler.scss";
import * as calendarActions from "actions/calendarActions";
import * as hooks from "actions/hooks";
import { BootstrapInput, handleToolTip, sessionArray } from "./SchedulerUtils";
import { arr_diff } from "../../Form/FormUtils";
import SessionFilters from "./SessionFilters";
import { stringToColor } from "../Accounts/accountUtils";
import { uniques } from "utils";
import { secondaryFontColor } from "../../../theme/muiTheme";
import BackButton from "../../OmouComponents/BackButton";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import { useLazyQuery } from "@apollo/react-hooks";

import { GET_ALL_EVENTS } from "./SchedulerQueries";

const useStyles = makeStyles((theme) => ({
    "bootstrapFormLabel": {
        "fontSize": "18px",
    },
    "courseFilter": {
        "paddingRight": "10px",
    },
    "dropdownStyle": {
        "borderRadius": "10px",
    },
    "margin": {
        "margin": theme.spacing(1),
    },
    "root": {
        "display": "flex",
        "flexWrap": "wrap",
    },
}));

const calendarViewToFilterVal = {
    "dayGridMonth": "month",
    "timeGridDay": "day",
    "timeGridWeek": "week",
};



const Scheduler = (props) => {
    const classes = useStyles();
    const history = useHistory();


    const prevState =
        JSON.parse(sessionStorage.getItem("schedulerState")) || {};
    const [courseType, setCourseType] =
        useState(prevState.courseType || "tutoring");
    const [courseFilter, setCourseFilter] = useState(prevState.courseFilter);
    const [instructorFilter, setInstructorFilter] =
        useState(prevState.instructorFilter);
    const [timeShift, setTimeShift] = useState(prevState.timeShift || 0);
    const timeView = props?.location?.state ? "timeGridDay" : prevState.view || "timeGridDay";
    const [view, setView] = useState(timeView);



    hooks.useCourse();
    hooks.useInstructor();
    hooks.useOutOfOffice();
    calendarActions.useSessions(
        calendarViewToFilterVal[view], timeShift, courseType
    );




    const calendarRef = useRef();
    const calendarApi = calendarRef.current && calendarRef.current.getApi();

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


    const currentDate = calendarApi && calendarApi.view.title


    const changeView = (value) => {
        calendarApi.changeView(value);
        calendarApi.today();
        setView(value);
        setTimeShift(0);
    };

    const handleViewChange = ({ target }) => {
        const gridValue = {
            "day": "timeGridDay",
            "week": "timeGridWeek",
            "month": "dayGridMonth",
        };
        const listValue = {
            "day": "listDay",
            "week": "listWeek",
            "month": "listMonth"
        };
        const viewType = view.toLowerCase().includes("grid") ? gridValue : listValue;
        changeView(viewType[target.value]);
    };

    const goToNext = () => {
        calendarApi.next();
        setTimeShift((prevShift) => prevShift + 1);
    };

    const goToPrev = () => {
        calendarApi.prev();
        setTimeShift((prevShift) => prevShift - 1);
    };

    const goToToday = () => {
        calendarApi.today();
        setTimeShift(0);
    };

    const handleCourseTypeChange = useCallback(({ target }) => {
        setCourseType(target.value);
    }, []);

    useEffect(() => {
        if (calendarApi) {
            const storedState =
                JSON.parse(sessionStorage.getItem("schedulerState")) || {};

            const oldView = storedState.view;
            if (oldView) {
                changeView(oldView);
            }
            // if time is earlier, go back, otherwise go forward
            goToToday();
            for (let oldTimeShift = storedState.timeShift; oldTimeShift > 0;
                oldTimeShift--) {
                goToNext();
            }
            for (let oldTimeShift = storedState.timeShift; oldTimeShift < 0;
                oldTimeShift++) {
                goToPrev();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarApi]);



    const [getSessions, { loading, data }] = useLazyQuery(GET_ALL_EVENTS);
    useEffect(() => {
        getSessions({
            variables: {
                timeFrame: "month",
                timeShift: 0
            }
        });
    }, [getSessions]);

    useEffect(() => {
        sessionStorage.setItem("schedulerState", JSON.stringify({
            courseFilter,
            courseType,
            instructorFilter,
            timeShift,
            view,
        }));
    }, [courseType, courseFilter, instructorFilter, timeShift, view]);



    if (loading || data === undefined) return <Loading />

    const { sessions } = data

    const currentSession = sessions.map(({ course: { instructor, ...courseValues }, endDatetime, startDatetime, id }) => {

        return {
            "color": colorizer(instructor.user.firstName),
            "courseID": courseValues.id,
            "description": courseValues.description,
            "end": moment(endDatetime).format("YYYY-MM-DDTHH:mm"),
            "id": id,
            // "instructor": `${course.instructor.user.firstName} ${course.instructor.user.lastName}`,
            // "instructor_id": course.instructor.user.id,
            "isConfirmed": courseValues.isConfirmed,
            "resourceId": courseValues
                ? courseValues.room
                : 1,
            "start": moment(startDatetime).format("YYYY-MM-DDTHH:mm"),
            "title": courseValues.title,
            "type": courseValues.courseType,
        }
    })





    const viewType = () => {
        const currentView = view.toLowerCase();
        if (currentView.includes("month")) {
            return "month";
        } else if (currentView.includes("week")) {
            return "week";
        } else if (currentView.includes("day")) {
            return "day"
        }
        return "day";
    };





    return (
        <Grid item xs={12} container>
            <BackgroundPaper className="scheduler" elevation={2}>
                <Grid item xs={12}>
                    <BackButton />
                    <hr />
                </Grid>
                <Typography align="left" className="scheduler-title" variant="h3">
                    Scheduler
				</Typography>
                <br />
                <Grid className="scheduler-header scheduler-wrapper" container item xs={12}>
                    <Grid item xs={4}>
                        <Grid className="scheduler-header-firstSet"
                            container direction="row">
                            <Grid item>
                                <IconButton
                                    onClick={() => console.log("hit")}
                                >
                                    <CalendarIcon
                                        style={{ color: view.toLowerCase().includes("grid") && secondaryFontColor }}
                                    />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    onClick={() => console.log("hit")}
                                >
                                    <ListIcon
                                        style={{ color: view === "listWeek" && secondaryFontColor }}
                                    />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <SessionFilters
                                    CourseValue={courseFilter}

                                    InstructorValue={instructorFilter}
                                    onCourseSelect={setCourseFilter}
                                    onInstructorSelect={setInstructorFilter} />
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
                                        onChange={handleCourseTypeChange}
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
                                className="prev-month" onClick={goToPrev}>
                                <ChevronLeftOutlined />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                {currentDate}
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
                                        onChange={handleViewChange}
                                        value={viewType()}
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
                </Grid>
                <Grid className="omou-calendar" item xs={12}>
                    <FullCalendar contentHeight="400"
                        defaultView="dayGridMonth"
                        displayEventTime
                        //eventClick={goToSessionView}
                        eventColor="none"
                        eventLimit={4}
                        eventMouseEnter={handleToolTip}
                        events={[...currentSession]}
                        header={false}
                        minTime="07:00:00"
                        nowIndicator
                        plugins={
                            [
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin,
                                listViewPlugin,
                                resourceTimelinePlugin,
                            ]}
                        ref={calendarRef}
                        resourceAreaWidth="20%"
                        resourceOrder="title"
                        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                        themeSystem="standard"
                        timeZone="local"
                        titleFormat={{
                            "day": "numeric",
                            "month": "long",
                        }}
                        views={{
                            "dayGrid": {
                                "titleFormat": { "month": "long" },
                            },
                        }} />
                </Grid>
            </BackgroundPaper>
        </Grid>
    );

};



export default Scheduler;
