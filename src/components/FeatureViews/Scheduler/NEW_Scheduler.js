import React, {useContext, useEffect, useState} from "react";
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import {CalendarToday, Face, List, NavigateBefore, NavigateNext, Schedule, Today} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {SchedulerContext} from "./SchedulerContext";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {BootstrapInput} from "./SchedulerUtils";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {fullName} from "../../../utils";
import {useHistory} from 'react-router-dom'
import Grid from "@material-ui/core/Grid";
import {omouBlue} from "../../../theme/muiTheme";
import AdvancedSessionFilters from "./AdvancedSessionFilters";

const useStyles = makeStyles((theme) => ({
	sessionPopover: {
		padding: theme.spacing(3),
		height: "100%",
		cursor: 'pointer'
	},
	popover: {
		pointerEvents: 'none',
	},
	sessionInfo: {
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginTop: theme.spacing(1),
	}
}));

const CustomToolbar = (toolbar) => {
    const {
        schedulerState: { timeFrame },
        updateSchedulerState,
    } = useContext(SchedulerContext);

    const setView = (timeFrame, pastDate, delta) =>
        ({
            day: new Date(
                pastDate.getFullYear(),
                pastDate.getMonth(),
                pastDate.getDate() + delta
            ),
            week: new Date(
                pastDate.getFullYear(),
                pastDate.getMonth(),
                pastDate.getDate() + delta * 7
            ),
            month: new Date(
                pastDate.getFullYear(),
                pastDate.getMonth() + delta,
                pastDate.getDate()
            ),
        }[timeFrame]);

    const goToBack = () => {
        const newDate = setView(timeFrame, toolbar.date, -1);
        toolbar.onNavigate('prev', newDate);
        updateSchedulerState((prevState) => ({
            ...prevState,
            timeShift: prevState.timeShift - 1,
        }));
    };

    const goToNext = () => {
        const newDate = setView(timeFrame, toolbar.date, 1);
        toolbar.onNavigate('next', newDate);
        updateSchedulerState((prevState) => ({
            ...prevState,
            timeShift: prevState.timeShift + 1,
        }));
    };

    const goToCurrent = () => {
        const now = new Date();
        toolbar.date.setMonth(now.getMonth());
        toolbar.date.setYear(now.getFullYear());
        toolbar.onNavigate('current', now);
        updateSchedulerState((prevState) => ({
            ...prevState,
            timeShift: 0,
        }));
    };

    const handleViewChange = ({ target }) => {
        toolbar.onView(target.value);
        updateSchedulerState((prevState) => ({
            ...prevState,
            timeFrame: target.value,
        }));
    };

	const handleGridClick = () => {
		toolbar.onView(timeFrame)
	}

	const handleAgendaClick = () => {
		toolbar.onView("agenda");
	}

	const label = () => {
		const date = moment(toolbar.date);
		return (
			<span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
		);
	};

	const isAgendaView = toolbar.view === "agenda";

	return (
		<Grid
			container
			alignItems="center"
			direction="row"
		>
			<Grid item>
				<IconButton onClick={handleGridClick}>
					<CalendarToday style={{color: !isAgendaView && omouBlue}}/>
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton onClick={handleAgendaClick}>
					<List style={{color: isAgendaView && omouBlue}}/>
				</IconButton>
			</Grid>
			<Grid item>
				<AdvancedSessionFilters/>
			</Grid>
			<Grid item>
				<IconButton onClick={goToBack}>
					<NavigateBefore/>
				</IconButton>
			</Grid>
			<Grid item style={{textAlign: "center"}}>
				<Typography variant="h3">
					{label()}
				</Typography>
			</Grid>
			<Grid item>
				<IconButton onClick={goToNext}>
					<NavigateNext/>
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton onClick={goToCurrent}>
					<Today/>
				</IconButton>
				<FormControl>
					<Select
						input={
							<BootstrapInput
								id='filter-calendar-type'
								name='courseFilter'
							/>
						}
						value={timeFrame || 'month'}
						onChange={handleViewChange}
					>
						<MenuItem value='day'>Day</MenuItem>
						<MenuItem value='week'>Week</MenuItem>
						<MenuItem value='month'>Month</MenuItem>
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	);
};

const EventPopoverWrapper = ({children, popover}) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const history = useHistory();

	const handleClick = () => {
		history.push(`/scheduler/session/${popover.props.session.id}`);
	}

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<>
			<div
				aria-owns={open ? 'mouse-over-popover' : undefined}
				aria-haspopup="true"
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
				onClick={handleClick}
			>
				{children}
			</div>
			<Popover
				id="mouse-over-popover"
				open={open}
				anchorEl={anchorEl}
				onClose={handlePopoverClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'center',
					horizontal: 'left',
				}}
				className={classes.popover}
				disableRestoreFocus
			>
				{popover}
			</Popover>
		</>
	);
}

const SessionPopover = ({session: {start, end, title, instructor}}) => {
	const classes = useStyles();

	const timeText = (time) => moment(time).format("h:mma")
	return (<div className={classes.sessionPopover}>
		<Typography variant="h3">{title}</Typography>
		<div className={classes.sessionInfo}>
			<Schedule style={{marginRight: "8px"}}/>
			<Typography variant="p">
				{`${timeText(start)} - ${timeText(end)}`}
			</Typography>
		</div>
		<div className={classes.sessionInfo}>
			<Face style={{marginRight: "8px"}}/>
			<Typography variant="p">
				{fullName(instructor)}
			</Typography>
		</div>
	</div>)
}

const eventStyleGetter = ({instructor}) => {
	const palette = [
		'#F503B2',
		'#F47FD4',
		'#FCA8E4',
		'#FFC5EF',
		'#DD0000',
		'#EA2632',
		'#EB5757',
		'#FF9191',
		'#2F80ED',
		'#2D9CDB',
		'#56CCF2',
		'#9B51E0',
		'#46D943',
		'#219653',
		'#27AE60',
		'#6FCF97',
		'#F78017',
		'#F2994A',
		'#FEBF87',
		'#FFE3CA',
		'#FFC103',
		'#F2C94C',
		'#F4D77D',
		'#FFEDB5',
		'#72FFFF',
		'#43D9D9',
		'#92E2DE',
		'#BAF7F3',
		'#1F82A1',
		'#588FA0',
		'#88ACB7',
		'#BEDAE2',
		'#96007E',
		'#B96AAC',
		'#CD9BC5',
		'#CD9BC5',
	];
	const hashCode = (string) => {
		let hash = 0;
		for (let i = 0; i < string.length; i += 1) {
			hash += string.charCodeAt(i);
		}
		return hash;
	};
	const colorizer = (string) => {
		return palette[hashCode(string) % 40 - 2];
	};

	return {
		style: {
			backgroundColor: colorizer(fullName(instructor))
		}
	}
}

const localizer = momentLocalizer(moment);

const BigCalendar = (props) => {
	return (
		<Calendar
			popup
			localizer={localizer}
			events={props.eventList}
			timeslots={4}
			components={{
				toolbar: CustomToolbar,
				eventWrapper: (props) =>
					(<EventPopoverWrapper
						{...props}
						popover={
							<SessionPopover session={props.event}/>
						}
					/>)
			}}
			startAccessor="start"
			endAccessor="end"
			onSelectEvent={props.onSelectEvent}
			style={{height: 800}}
			eventPropGetter={eventStyleGetter}
		/>)
};

const GET_SESSIONS = gql`
	query GetSessionsQuery($timeFrame: String, $timeShift: Int) { 
		sessions(timeFrame: $timeFrame, timeShift: $timeShift){
			id
			endDatetime
			startDatetime
			title
			instructor {
			  user {
				id
				firstName
				lastName
			  }
			}
			course {
			  enrollmentSet {
				student {
				  user {
					id
					firstName
					lastName
				  }
				}
				id
			  }
			  title
			  id
			}
		}
	}
`

export default function NEWScheduler() {
	const [schedulerState, setSchedulerState] = useState({
		timeFrame: null,
		timeShift: null,
		instructorOptions: [],
		selectedInstructors: [],
	});
	const [sessionsInView, setSessionsInView] = useState([]);

    useEffect(() => {
        setSchedulerState({
            timeFrame: 'month',
            timeShift: 0,
        });
    }, []);

    useEffect(() => {
        const { timeFrame, timeShift } = schedulerState;
        if (timeFrame && timeShift) {
            setSchedulerState({
                timeFrame,
                timeShift,
            });
        }
    }, [schedulerState.timeFrame, schedulerState.timeShift]);

	const uniqueValuesById = (objectList) => {
		const result = [];
		const map = new Map();
		for (const item of objectList) {
			if (!map.has(item.id)) {
				map.set(item.id, true);    // set any value to Map
				result.push(item);
			}
		}
		return result;
	};

	const createOptions = (objectList, labelFunc) => objectList.map((object) => ({
		value: object.id,
		label: labelFunc(object),
	}))

	const {data, loading, error} = useQuery(GET_SESSIONS, {
		variables: {
			timeFrame: schedulerState.timeFrame,
			timeShift: schedulerState.timeShift,
		},
		onCompleted: (data) => {
			const {sessions} = data;
			const parsedBigCalendarSessions = sessions.map(({id, endDatetime, startDatetime, title, instructor}) => ({
				id,
				title,
				start: new Date(startDatetime),
				end: new Date(endDatetime),
				instructor: instructor.user,
			}));
			setSessionsInView(parsedBigCalendarSessions);

			const instructors = sessions.map(session => session.instructor.user);
			const uniqueInstructors = uniqueValuesById(instructors);
			const instructorOptions = createOptions(uniqueInstructors, (instructor) => fullName(instructor))
			setSchedulerState((prevState) => ({
				...prevState,
				instructorOptions,
			}))
		}
	});

    const updateSchedulerState = (newState) => setSchedulerState(newState);

    return (
		<SchedulerContext.Provider
			value={{schedulerState, updateSchedulerState}}
		>
			<Typography variant="h1" align="left">Scheduler</Typography>
			<BigCalendar eventList={sessionsInView}/>
		</SchedulerContext.Provider>
    );
}
