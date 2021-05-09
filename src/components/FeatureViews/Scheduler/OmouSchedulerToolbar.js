import React, {useContext} from 'react';
import {SchedulerContext} from './SchedulerContext';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import {CalendarToday, List, NavigateBefore, NavigateNext, Today,} from '@material-ui/icons';
import {omouBlue} from '../../../theme/muiTheme';
import AdvancedSessionFilters from './SessionView/AdvancedSessionFilters';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {BootstrapInput} from './SchedulerUtils';
import MenuItem from '@material-ui/core/MenuItem';

export const OmouSchedulerToolbar = (toolbar) => {
    const {
        schedulerState: {timeFrame},
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
        toolbar.onView(timeFrame);
    };

    const handleAgendaClick = () => {
        toolbar.onView('agenda');
    };

    const label = () => {
        const date = moment(toolbar.date);
        return (
            <span>
                {date.format('MMMM')}
                <span> {date.format('YYYY')}</span>
            </span>
        );
    };

    const isAgendaView = toolbar.view === 'agenda';

    return (
        <Grid
            container
            alignItems='center'
            direction='row'
            justify='space-between'
        >
            <Grid item xs={4} container>
                <Grid item>
                    <IconButton onClick={handleGridClick}>
                        <CalendarToday
                            style={{ color: !isAgendaView && omouBlue }}
                        />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton onClick={handleAgendaClick}>
                        <List style={{ color: isAgendaView && omouBlue }} />
                    </IconButton>
                </Grid>
                <Grid item>
                    <AdvancedSessionFilters />
                </Grid>
            </Grid>
            <Grid item xs={4} container alignItems='center' justify='center'>
                <Grid item>
                    <IconButton onClick={goToBack}>
                        <NavigateBefore />
                    </IconButton>
                </Grid>
                <Grid item style={{ textAlign: 'center' }}>
                    <Typography variant='h3'>{label()}</Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={goToNext}>
                        <NavigateNext />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item xs={4} container justify='flex-end'>
                <Grid item>
                    <IconButton onClick={goToCurrent}>
                        <Today />
                    </IconButton>
                </Grid>
                <Grid item>
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
        </Grid>
    );
};
