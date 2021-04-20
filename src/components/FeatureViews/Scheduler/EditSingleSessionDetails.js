import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { FormControl } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const CourseFilterDropdown = ({
    initialValue,
    filterList,
    setState,
    filter,
    filterKey,
}) => {
    const classes = useStyles();
    const handleChange = (event) => setState(event.target.value);
    const filterOptionsMapper = {
        instructors: (option) => ({
            value: option.instructor.user.id,
            label: fullName(option.instructor.user),
        }),
        subjects: (option) => ({
            value: option.courseCategory.id,
            label: option.courseCategory.name,
        }),
        grades: (option) => ({
            value: option.value.toUpperCase(),
            label: option.label,
        }),
        students: (option) => ({
            value: option.value,
            label: option.label,
        }),

    }[filterKey];

    const ChosenFiltersOption = filterList.map(filterOptionsMapper);
    return (
        <Grid container>
            <Grid item>
                <FormControl className={classes.margin}>
                    <Select
                        labelId='course-management-sort-tab'
                        id='course-management-sort-tab'
                        displayEmpty
                        value={filter}
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
                            {initialValue}
                        </MenuItem>
                        {ChosenFiltersOption.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                className={classes.menuSelect}
                                ListItemClasses={{ selected: classes.menuSelected }}
                            >
                                {filterKey === 'students' ? (
                                    <UserAvatarCircle label={option.label} />
                                ) : (
                                    ''
                                )}
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item>
                <KeyboardDatePicker />
            </Grid>
            <Grid item>
                <KeyboardTimePicker />
            </Grid>
            <Grid item>
                <KeyboardTimePicker />
            </Grid>
        </Grid>
    );
};