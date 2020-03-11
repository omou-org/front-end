import React, { useState } from "react";
import IconButton from "@material-ui/core/es/IconButton";
import FilterIcon from "@material-ui/icons/FilterList";
import Menu from "@material-ui/core/es/Menu";
import { withStyles } from '@material-ui/core/styles';
import blue from "@material-ui/core/es/colors/blue";
import ReactSelect from "react-select";
import { Tooltip, Typography, MenuItem, Paper } from "@material-ui/core";


const styles = {
    root: {
        width: 230,
    },
};

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        width: state.selectProps.width,
        color: state.selectProps.menuColor,
        padding: 20,
    }),

    control: (_, { selectProps: { width } }) => ({
        width: width
    }),

    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
    }
}


function SessionFilters({ onInstructorSelect, InstructorValue, InstructorOptions, CourseValue, onCourseSelect, CourseOptions, }) {
    let [anchorEl, setAnchorEl] = useState(null);
    let [open, setOpen] = useState(false);


    const handleClick = event => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    return (<>
        <Tooltip title={"Session Filters"}>
            <IconButton
                aria-label={"more"}
                aria-controls={"long-menu"}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <FilterIcon />
            </IconButton>
        </Tooltip>
        <Menu
            id={"long-menu"}
            anchorEl={anchorEl}
            keepMounted
            open={open}
            className={"session-filter"}
            onClose={handleClick}
        >
            <MenuItem
                className={"select-filter-header"}
                disabled={true}
                style={{ "backgroundColor": "#FAFAFA" }}
            > Select Filter</MenuItem>
            <ReactSelect
                className={"session-filter-select"}
                // styles={customStyles}
                placeholder={"Filter Instructor..."}
                value={InstructorValue}
                options={InstructorOptions}
                onChange={onInstructorSelect}
                clearable
                isMulti
            />
            <ReactSelect
                className={"session-filter-select"}
                // styles={customStyles}
                placeholder={"Filter Course..."}
                value={CourseValue}
                options={CourseOptions}
                onChange={onCourseSelect}
                clearable
                isMulti
            />
        </Menu>

    </>)
}

export default withStyles(styles)(SessionFilters);