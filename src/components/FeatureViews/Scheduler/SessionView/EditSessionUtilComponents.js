import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, makeStyles, MenuItem, Select } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';
import { highlightColor, omouBlue, statusRed } from '../../../../theme/muiTheme';
import gql from 'graphql-tag';
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

const CHECK_SCHEDULE_CONFLICTS = gql`
    query checkScheduleConflicts(
        $date: String!
        $startTime: String!
        $endTime: String!
        $instructorId: ID!
    ) {
        validateSessionSchedule(
            date: $date
            endTime: $endTime
            instructorId: $instructorId
            startTime: $startTime
        ) {
            reason
            status
        }
    }
`;


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
    setSnackData,
    instructorValue
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

    const [
        checkScheduleConflicts,
    ] = useLazyQuery(CHECK_SCHEDULE_CONFLICTS, {
        onCompleted: ({ validateSessionSchedule }) => {
            const { status, reason } = validateSessionSchedule;
            if (!status) {
                const startSessionTime = moment(startTime).format('HH:mm');
                const endSessionTime = moment(endTime).format('HH:mm');
                const monthAndDate = moment(startTime).format('MMMM DD');
                setSnackData({
                    title: 'SESSION CONFLICTS',
            icon: (
                <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <ellipse
                        cx='13.6799'
                        cy='10.8707'
                        rx='5.28'
                        ry='8.4'
                        fill='white'
                    />
                    <path
                        d='M12.0187 0C5.39338 0 0 4.8622 0 10.8393C0 16.8164 5.39338 21.6786 12.0187 21.6786C13.2582 21.6771 14.4917 21.5 15.6844 21.1521L19.8383 23.8774C19.9517 23.9524 20.0826 23.9946 20.2173 23.9995C20.3519 24.0044 20.4854 23.972 20.6037 23.9055C20.7219 23.839 20.8207 23.7409 20.8896 23.6215C20.9585 23.5022 20.9949 23.3659 20.9951 23.2271V18.0165C21.935 17.0871 22.6851 15.9734 23.2011 14.7408C23.7171 13.5082 23.9887 12.1817 23.9998 10.8393C24.0374 4.8622 18.644 0 12.0187 0ZM11.2149 5.13318C11.2026 4.98261 11.2207 4.83105 11.2682 4.68807C11.3156 4.5451 11.3913 4.41384 11.4905 4.30259C11.5897 4.19134 11.7103 4.10252 11.8445 4.04177C11.9787 3.98102 12.1237 3.94965 12.2703 3.94965C12.4169 3.94965 12.5619 3.98102 12.6962 4.04177C12.8304 4.10252 12.9509 4.19134 13.0501 4.30259C13.1493 4.41384 13.225 4.5451 13.2725 4.68807C13.3199 4.83105 13.338 4.98261 13.3257 5.13318V12.6975C13.338 12.848 13.3199 12.9996 13.2725 13.1426C13.225 13.2855 13.1493 13.4168 13.0501 13.528C12.9509 13.6393 12.8304 13.7281 12.6962 13.7889C12.5619 13.8496 12.4169 13.881 12.2703 13.881C12.1237 13.881 11.9787 13.8496 11.8445 13.7889C11.7103 13.7281 11.5897 13.6393 11.4905 13.528C11.3913 13.4168 11.3156 13.2855 11.2682 13.1426C11.2207 12.9996 11.2026 12.848 11.2149 12.6975V5.13318ZM12.2741 18.5662C11.9963 18.5662 11.7247 18.4812 11.4937 18.3222C11.2627 18.1631 11.0826 17.937 10.9763 17.6724C10.87 17.4078 10.8422 17.1167 10.8964 16.8359C10.9506 16.555 11.0844 16.2971 11.2808 16.0946C11.4773 15.8921 11.7276 15.7542 12 15.6983C12.2725 15.6425 12.555 15.6711 12.8116 15.7807C13.0683 15.8903 13.2877 16.0759 13.442 16.314C13.5964 16.5521 13.6788 16.832 13.6788 17.1183C13.6768 17.501 13.5279 17.8673 13.2647 18.1371C13.0015 18.4069 12.6453 18.5584 12.2741 18.5584V18.5662Z'
                        fill='#FF6766'
                    />
                </svg>
            ),
            date: `${day}, ${monthAndDate} at ${startSessionTime} - ${endSessionTime}`,
            message: reason,
            messageColor: statusRed,
            duration: 6,
            vertical: 'bottom',
            horizontal: 'left',
            open: true,
                });
            }
        },
    });

    const setCourseAvailability = (updatedState) => {
        getCourseAvailability({
            dayOfWeek: day || availability.dayOfWeek,
            startTime: startTime || availability.startTime,
            endTime: endTime || availability.endTime,
            id: availability.id,
            ...updatedState,
        });
    };

    const handleTimeChange = (setValue, startOrEndTime) => async (e) => {
        setValue(e.format('YYYY-MM-DD[T]HH:mm'));
        setCourseAvailability({
            [startOrEndTime]: e.format('YYYY-MM-DD[T]HH:mm'),
        });
        await checkScheduleConflicts({
            variables: {
                instructorId: instructorValue,
                startTime: e.format('HH:mm') || availability.startTime,
                endTime: e.format('HH:mm') || availability.endTime,
                date: e.format('YYYY-MM-DD'),
            },
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
    setSnackData: PropTypes.func,
    instructorValue: PropTypes.string
};
