import React from 'react';
import { Grid, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Select } from 'mui-rff';

import { BootstrapInput } from '../Courses/CourseManagementContainer';
import { DatePicker, ToggleButton } from '../../Form/FieldComponents/Fields';

import { highlightColor } from '../../../theme/muiTheme';
import Eyebrow from '../../OmouComponents/Eyebrow';
import TutoringInstructorAndDateTimeSelector from './TutoringInstructorAndDateTimeSelector';

const useStyles = makeStyles((theme) => ({
    contentSpacing: {
        marginBottom: theme.spacing(2),
    },
    dropdown: {
        border: '1px solid #43B5D9',
        borderRadius: '5px',
    },
    selectDuration: {
        textAlign: 'left',
    },
    menuSelect: {
        '&:hover': { backgroundColor: highlightColor, color: '#28ABD5' },
        '&:focus': highlightColor,
        display: 'flex',
    },
    instructorSelectContainer: {
        border: '3px solid #EEEEEE',
        borderRadius: '10px',
        padding: '16px !important',
    },
}));

const SelectInstructorStep = () => {
    const classes = useStyles();

    const checkboxData = [
        { label: 'Monday', value: false },
        { label: 'Tuesday', value: false },
        { label: 'Wednesday', value: false },
        { label: 'Thursday', value: false },
        { label: 'Friday', value: false },
        { label: 'Saturday', value: false },
        { label: 'Sunday', value: false },
    ];

    return (
        <Grid container direction='column' justify='flex-start' spacing={1}>
            <Grid item container spacing={2}>
                <Grid
                    item
                    className={classes.contentSpacing}
                    style={{ textAlign: 'left' }}
                >
                    <DatePicker
                        style={{ width: '200px' }}
                        tutoring={true}
                        name='startDate'
                        label='Start Date'
                        format='MM/DD/YYYY'
                    />
                </Grid>
                <Grid
                    item
                    className={classes.contentSpacing}
                    style={{ textAlign: 'left' }}
                >
                    <DatePicker
                        style={{ width: '200px' }}
                        tutoring={true}
                        name='endDate'
                        label='End Date'
                        format='MM/DD/YYYY'
                    />
                </Grid>
            </Grid>

            <Grid item className={classes.contentSpacing}>
                <Eyebrow
                    title={'Day(s) of Reoccurance'}
                    subText='Select at least 1 day of meeting that will reoccur on weekly basis'
                />
                <Grid
                    item
                    container
                    justify='space-between'
                    direction='row'
                    spacing={2}
                >
                    {checkboxData.map((date, i) => (
                        <Grid key={i} item>
                            <ToggleButton
                                name={date.label}
                                initialValues={checkboxData}
                                // onChange={(e) => console.log(e)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item container xs={2} className={classes.contentSpacing}>
                <Eyebrow title={'Duration of Meeting'} subText={'.'} />
                <Select
                    name='duration'
                    input={<BootstrapInput />}
                    className={classes.selectDuration}
                    classes={{ select: classes.menuSelect }}
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
                    <MenuItem value='.5'>30 min</MenuItem>
                    <MenuItem value='1'>1 hour</MenuItem>
                    <MenuItem value='1.5'>1.5 hours</MenuItem>
                    <MenuItem value='2'>2 hours</MenuItem>
                </Select>
            </Grid>

            <Grid
                item
                container
                direction='row'
                justify='center'
                alignItems='center'
                className={classes.instructorSelectContainer}
            >
                <Grid
                    item
                    xs={4}
                    style={{ marginBottom: '5px', padding: '10px' }}
                >
                    <Eyebrow
                        title='Available instructors'
                        subText='Select 1 instructor who is available'
                    />
                </Grid>
                <Grid
                    item
                    xs={8}
                    style={{ marginBottom: '5px', padding: '10px' }}
                >
                    <Eyebrow
                        title='Available times'
                        subText='Select duration of session and pick each available time '
                    />
                </Grid>
                <Grid container direction='row'>
                    {/* Pass query of available instructors.

                        Props passed in should be
                        - Instructor Name
                        - Bio

                    */}
                    <TutoringInstructorAndDateTimeSelector />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SelectInstructorStep;

SelectInstructorStep.propTypes = {};
