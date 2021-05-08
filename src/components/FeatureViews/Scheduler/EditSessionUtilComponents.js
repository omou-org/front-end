import React from 'react';
import {FormControl, makeStyles, MenuItem, Select} from '@material-ui/core';
import {highlightColor, omouBlue} from '../../../theme/muiTheme';
import {BootstrapInput} from '../Courses/CourseManagementContainer';
import Loading from '../../OmouComponents/Loading';
import PropTypes from "prop-types";

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
                                        noValueLabel,
                                        itemLabel,
                                        itemId,
                                        queryList,
                                        setState,
                                        value,
                                    }) => {
    const classes = useStyles();
    const handleChange = (event) => setState(event.target.value);

    if (!queryList) return <Loading/>;

    return (<FormControl className={classes.margin}>
        <Select
            labelId='omou-dropdown'
            id='omou-dropdown'
            displayEmpty
            value={value}
            onChange={handleChange}
            classes={{select: classes.menuSelect}}
            input={<BootstrapInput/>}
            MenuProps={{
                classes: {list: classes.dropdown},
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
                ListItemClasses={{selected: classes.menuSelected}}
                value=''
            >
                {noValueLabel}
            </MenuItem>
            {
                queryList.map((value, i) => (
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
                ))
            }
        </Select>
    </FormControl>);
};

EditSessionDropDown.propTypes = {
    noValueLabel: PropTypes.any,
    itemLabel: PropTypes.any,
    itemId: PropTypes.any,
    queryList: PropTypes.any,
    setState: PropTypes.func,
    value: PropTypes.any,
};