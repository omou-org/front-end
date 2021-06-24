import React from 'react';
import { Grid, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Select } from 'mui-rff';

import { BootstrapInput } from '../Courses/CourseManagementContainer';
import { ToggleButton, DatePicker } from '../../Form/FieldComponents/Fields';

import { highlightColor } from '../../../theme/muiTheme';
import Eyebrow from '../../OmouComponents/Eyebrow';

const useStyles = makeStyles((theme) => ({
    contentSpacing: {
        marginTop: theme.spacing(2),
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
        <Grid container direction='row' justify='flex-start'>
            <Grid
                item
                xs={2}
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
                xs={2}
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

            <Grid item xs={12} className={classes.contentSpacing}>
                <Eyebrow
                    title={'DAY(S) OF REOCCURANCE'}
                    subText='Select at least 1 day of meeting that will reoccur on weekly basis'
                />
            </Grid>

            <Grid
                item
                container
                justify='space-between'
                direction='row'
                xs={10}
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
            <Grid item xs={1}></Grid>
            <Grid item container xs={2} className={classes.contentSpacing}>
                <h3>Duration Of meeting</h3>
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
        </Grid>
    );
};

export default SelectInstructorStep;

SelectInstructorStep.propTypes = {};
