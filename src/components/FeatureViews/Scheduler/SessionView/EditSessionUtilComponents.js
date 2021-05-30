import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, makeStyles, MenuItem, Select } from '@material-ui/core';
import { highlightColor, omouBlue } from '../../../../theme/muiTheme';
import { BootstrapInput } from '../../Courses/CourseManagementContainer';
import Loading from '../../../OmouComponents/Loading';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { CancelOutlined, QueryBuilder } from '@material-ui/icons';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    margin: {
        minWidth: '12.8125em',
        [theme.breakpoints.down('md')]: {
            minWidth: '10em',
        },
    },
    menuSelect: {
        '&:hover': { backgroundColor: highlightColor, color: '#28ABD5' },
        '&:focus': highlightColor,
        display: 'flex',
    },
    menuSelected: {
        backgroundColor: `${highlightColor} !important`,
    },
    dropdown: {
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
    dayPicker: {
        margin: '0px',
        padding: '0px',
        width: '11em',
        float: 'left',
    },
}));

export const EditSessionDropDown = ({
    noValueLabel,
    itemLabel,
    itemId,
    queryList,
    setState,
    value,
}) => {
    const classes = useStyles();
    const handleChange = (event) => setState(event.target.value);

    if (!queryList) return <Loading />;

    return (
        <FormControl className={classes.margin}>
            <Select
                labelId='omou-dropdown'
                id='omou-dropdown'
                displayEmpty
                value={value}
                onChange={handleChange}
                classes={{ select: classes.menuSelect }}
                input={<BootstrapInput />}
                MenuProps={{
                    classes: { list: classes.dropdown },
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                }}
            >
                <MenuItem
                    ListItemClasses={{ selected: classes.menuSelected }}
                    value=''
                >
                    {noValueLabel}
                </MenuItem>
                {queryList.map((value, i) => (
                    <MenuItem
                        key={i}
                        className={classes.menuSelect}
                        value={itemId(value)}
                        ListItemClasses={{
                            selected: classes.menuSelected,
                        }}
                    >
                        {itemLabel(value)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

EditSessionDropDown.propTypes = {
    noValueLabel: PropTypes.any,
    itemLabel: PropTypes.any,
    itemId: PropTypes.any,
    queryList: PropTypes.any,
    setState: PropTypes.func,
    value: PropTypes.any,
};

export const EditMultiSessionFields = ({
    getCourseAvailability,
    availability,
    removeCourseAvailability,
    setGetCurrentTimeChange,
}) => {
    const classes = useStyles();
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        setDay(availability.dayOfWeek);
        setStartTime(
            moment('2021-01-01T' + availability.startTime).format(
                'YYYY-MM-DD[T]HH:mm'
            )
        );
        setEndTime(
            moment('2021-01-01T' + availability.endTime).format(
                'YYYY-MM-DD[T]HH:mm'
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setCourseAvailability = (updatedState) => {
        console.log({
            dayOfWeek: day || availability.dayOfWeek,
            startTime: startTime || availability.startTime,
            endTime: endTime || availability.endTime,
            id: availability.id,
            ...updatedState,
        });
        getCourseAvailability({
            dayOfWeek: day || availability.dayOfWeek,
            startTime: startTime || availability.startTime,
            endTime: endTime || availability.endTime,
            id: availability.id,
            ...updatedState,
        });
        setGetCurrentTimeChange({
            day,
            startTime,
            endTime
        });
    };

    const handleTimeChange = (setValue, startOrEndTime) => (e) => {
        setValue(e.format('YYYY-MM-DD[T]HH:mm'));
        setCourseAvailability({
            [startOrEndTime]: e.format('YYYY-MM-DD[T]HH:mm'),
        });
    };

    const handleDayChange = (e) => {
        setDay(e.target.value);
        setCourseAvailability({ day: e.target.value });
    };

    const handleRemoveCourseAvailability = useCallback(
        (availabilityId) => {
            removeCourseAvailability(availabilityId);
        },
        [removeCourseAvailability]
    );

    return (
        <Grid container style={{ marginBottom: '10px' }}>
            <Grid item xs={2} lg={3} xl={2}>
                <FormControl className={classes.dayPicker}>
                    <Select
                        native
                        inputProps={{
                            name: 'age',
                            id: 'age-native-simple',
                        }}
                        displayEmpty='true'
                        defaultValue='Day'
                        value={day}
                        onChange={handleDayChange}
                    >
                        <option value='none'>Day</option>
                        <option value='SUNDAY'>Sunday</option>
                        <option value='MONDAY'>Monday</option>
                        <option value='TUESDAY'>Wednesday</option>
                        <option value='WEDNESDAY'>Thursday</option>
                        <option value='THURSDAY'>Friday</option>
                        <option value='FRIDAY'>Saturday</option>
                        <option value='SATURDAY'>Sunday</option>
                    </Select>
                </FormControl>
                <span>at</span>
            </Grid>
            <Grid item xs={2} lg={3} xl={2}>
                <KeyboardTimePicker
                    keyboardIcon={<QueryBuilder />}
                    style={{ float: 'left', width: '11em' }}
                    value={startTime}
                    onChange={handleTimeChange(setStartTime, 'startTime')}
                />
                <span>-</span>
            </Grid>
            <Grid item xs={2}>
                <KeyboardTimePicker
                    keyboardIcon={<QueryBuilder />}
                    style={{ float: 'left' }}
                    value={endTime}
                    onChange={handleTimeChange(setEndTime, 'endTime')}
                />
            </Grid>
            <Grid item xs={2}>
                <IconButton
                    onClick={(e) => {
                        e.preventDefault();
                        handleRemoveCourseAvailability(availability.id);
                    }}
                >
                    <CancelOutlined />
                </IconButton>
            </Grid>
        </Grid>
    );
};

EditMultiSessionFields.propTypes = {
    getCourseAvailability: PropTypes.func,
    availability: PropTypes.any,
    removeCourseAvailability: PropTypes.func,
    setGetCurrentTimeChange: PropTypes.func,
};
