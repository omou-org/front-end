import React from 'react';
import { makeStyles, Grid, FormControl, Select, MenuItem } from '@material-ui/core';
import { cloudy, omouBlue, highlightColor } from '../../../theme/muiTheme';
import { BootstrapInput } from '../Courses/CourseManagementContainer';
import { fullName } from 'utils';
import Loading from '../../OmouComponents/Loading';

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
}));

export const EditSessionDropDown = ({
    initialValue,
    queryList,
    setState,
    value,
}) => {
    const classes = useStyles();
    const handleChange = (event) => setState(event.target.value);

    
    if(!queryList) return <Loading />

    return (
        <Grid container>
            <Grid item>
                <FormControl className={classes.margin}>
                    <Select
                        labelId='course-management-sort-tab'
                        id='course-management-sort-tab'
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
                            {initialValue}
                        </MenuItem>
                        {
                            queryList.map((values, i) => (
                                <MenuItem
                                    key={i}
                                    className={classes.menuSelect}
                                    value={values.id || values.user.id}
                                    ListItemClasses={{
                                        selected: classes.menuSelected,
                                    }}
                                >
                                    {initialValue === 'All Instructors' ? fullName(values.user) : values.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};