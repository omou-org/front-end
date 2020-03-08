import React, {useState} from "react";
import IconButton from "@material-ui/core/es/IconButton";
import FilterIcon from "@material-ui/icons/FilterList";
import Menu from "@material-ui/core/es/Menu";
import {withStyles} from '@material-ui/core/styles';
import blue from "@material-ui/core/es/colors/blue";
import ReactSelect from "react-select";
import MenuItem from "@material-ui/core/es/MenuItem";
import Tooltip from "@material-ui/core/es/Tooltip";

const styles = theme => ({
    colorSwitchBase: {
        color: blue[300],
        '&$colorChecked': {
            color: blue[500],
            '& + $colorBar': {
                backgroundColor: blue[500],
            }
        }
    },
    colorBar: {},
    colorChecked: {},
});

function SessionFilters({ onInstructorSelect, InstructorValue, InstructorOptions, CourseValue, onCourseSelect, CourseOptions }) {
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
            <MenuItem selected> Select Filter</MenuItem>
            <ReactSelect
                className={"instructor-session-filter"}
                placeholder={"Filter Instructor..."}
                value={InstructorValue}
                options={InstructorOptions}
                onChange={onInstructorSelect}
                clearable
                isMulti
            />
            <ReactSelect
                className={"instructor-session-filter"}
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