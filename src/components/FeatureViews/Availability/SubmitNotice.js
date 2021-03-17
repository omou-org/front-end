import React, { useContext, useState, forwardRef } from 'react';
import { OOOContext } from './OOOContext';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Button from '@material-ui/core/Button';
import { omouBlue, outlineGrey } from '../../../theme/muiTheme';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import Moment from 'react-moment';
import { KeyboardTimePicker } from '@material-ui/pickers/TimePicker';
import TimeIcon from '@material-ui/icons/Schedule';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import { TextField, Container } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import { DateRange } from 'react-date-range';
import { useSelector } from 'react-redux';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useImperativeHandle } from 'react';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

const useStyles = makeStyles({
    root: {
        marginTop: '2rem',
    },
    boldText: {
        fontSize: '20px',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    normalText: {
        fontWeight: 400,
    },
    selectDateText: {
        fontSize: '17px',
        paddingTop: '1%',
    },
    timePicker: {
        width: '80%',
    },
});

export const SubmitNotice = forwardRef((props, ref) => {
    const [openCalendar, setOpenCalendar] = useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [outAllDay, setOutAllDay] = useState(false);
    const [description, setDescription] = useState('');
    const { updateOOOFormState } = useContext(OOOContext);
    // AUTH selector
    const AuthUser = useSelector(({ auth }) => auth);
    const classes = useStyles();
    const handleUpdateForm = (updatedState) => {
        updateOOOFormState({
            startTime: startTime,
            endTime: endTime,
            description: description,
            startDate: moment(state[0].startDate),
            endDate: moment(state[0].endDate),
            outAllDay: outAllDay,
            ...updatedState,
        });
    };

    const handleTimeChange = (setStartOrEndTime, time) => (e) => {
        setStartOrEndTime(e);
        handleUpdateForm({ [time]: e });
    };

    const handleOutAllDay = () => {
        setOutAllDay(!outAllDay);
        handleUpdateForm({ outAllDay: !outAllDay });
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        handleUpdateForm({ description: e.target.value });
    };

    const handleDateRangeChange = (item) => {
        setState([item.selection]);
        handleUpdateForm({
            startDate: moment(item.selection.startDate),
            endDate: moment(item.selection.endDate),
        });
    };

    const checkIfDateBeforeToday = (startDate) => moment().isBefore(startDate);

    useImperativeHandle(ref, () => ({
        handleClearForm() {
            setStartTime(null);
            setEndTime(null);
            setDescription('');
            setOutAllDay(false);
        },
    }));

    const currentDate = new Date();

    return (
        <Container style={{ paddingLeft: '50px' }}>
            <Grid item xs={12} align='left'>
                <Typography className={classes.boldText}>
                    Instructor:
                    <span className={classes.normalText}>
                        {` ${AuthUser.user.firstName} ${AuthUser.user.lastName} `}
                    </span>
                </Typography>
            </Grid>

            <Grid item xs={12} lg={7}>
                <Typography className={classes.selectDateText} align='left'>
                    Select Date:
                </Typography>
            </Grid>
            <Grid container style={{ paddingTop: '2%' }}>
                <ButtonGroup variant='contained'>
                    <Button style={{ backgroundColor: omouBlue }}>
                        <CalendarIcon style={{ color: 'white' }} />
                    </Button>
                    <Button
                        style={{ fontWeight: 500, backgroundColor: 'white' }}
                        onClick={() => setOpenCalendar(true)}
                    >
                        <Moment date={state[0].startDate} format='MM/DD/YYYY' />
                    </Button>
                    <Button
                        style={{ fontWeight: 500, backgroundColor: 'white' }}
                        onClick={() => setOpenCalendar(true)}
                    >
                        <Moment date={state[0].endDate} format='MM/DD/YYYY' />
                    </Button>
                </ButtonGroup>
            </Grid>

            <Grid
                container
                align='left'
                alignContent='center'
                alignItems='center'
                style={{ marginTop: '3%' }}
            >
                <Grid item xs={4}>
                    <Grid item>
                        <Typography>Select OOO Start Time</Typography>
                    </Grid>
                    <KeyboardTimePicker
                        id='keyboardTimePickerOOO'
                        className={classes.timePicker}
                        disabled={outAllDay}
                        style={{
                            backgroundColor: outAllDay ? outlineGrey : 'white',
                        }}
                        keyboardIcon={<TimeIcon />}
                        value={startTime}
                        onChange={handleTimeChange(setStartTime, 'start')}
                        inputVariant='outlined'
                        data-cy='start-time-picker-OOO'
                    />
                </Grid>

                <Grid item xs={4}>
                    <Grid item>
                        <Typography>Select OOO End Time</Typography>
                    </Grid>
                    <Grid item>
                        <KeyboardTimePicker
                            className={classes.timePicker}
                            disabled={outAllDay}
                            style={{
                                backgroundColor: outAllDay
                                    ? outlineGrey
                                    : 'white',
                            }}
                            keyboardIcon={<TimeIcon />}
                            value={endTime}
                            onChange={handleTimeChange(setEndTime, 'end')}
                            inputVariant='outlined'
                            data-cy='end-time-picker-OOO'
                        />
                    </Grid>
                </Grid>
                <FormControlLabel
                    style={{ marginTop: '34px', marginLeft: '34px' }}
                    control={
                        <Checkbox
                            checked={outAllDay}
                            onChange={handleOutAllDay}
                            name='Out All Day'
                            color='primary'
                            data-cy='out-all-day-checkbox'
                        />
                    }
                    label='Out all day'
                />
            </Grid>

            <Grid
                container
                className={classes.root}
                style={{ marginTop: '3%' }}
            >
                <Grid item xs={2} align='left'>
                    <Typography className={classes.boldText}>
                        Description:
                    </Typography>
                </Grid>
                <Grid item xs={7}>
                    <TextField
                        multiline
                        fullWidth={true}
                        rows={4}
                        variant='outlined'
                        style={{ backgroundColor: 'white' }}
                        onChange={handleDescriptionChange}
                        value={description}
                        data-cy='instructor-OOO-description-input'
                    />
                </Grid>
            </Grid>

            <Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
                <DateRange
                    editableDateInputs={true}
                    onChange={handleDateRangeChange}
                    minDate={moment().toDate()}
                    shouldDisableDate={checkIfDateBeforeToday(currentDate)}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                />
                <DialogActions>
                    <ResponsiveButton
                        onClick={() => setOpenCalendar(false)}
                        color='primary'
                        variant='outlined'
                    >
                        Save & Close
                    </ResponsiveButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
});
