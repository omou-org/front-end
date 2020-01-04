import React, {useState} from "react";
import IconButton from "@material-ui/core/es/IconButton";
import FilterIcon from "@material-ui/icons/FilterList";
import Menu from "@material-ui/core/es/Menu";
import { withStyles } from '@material-ui/core/styles';
import blue from "@material-ui/core/es/colors/blue";
import ReactSelect from "react-select";

const styles = theme => ({
    colorSwitchBase: {
        color: blue[300],
        '&$colorChecked':{
            color: blue[500],
            '& + $colorBar': {
                backgroundColor: blue[500],
            }
        }
    },
    colorBar: {},
    colorChecked: {},
});

function SessionFilters({onInstructorSelect, InstructorValue, InstructorOptions }){
    let [anchorEl, setAnchorEl ] = useState(null);
    let [open, setOpen] = useState(false);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };
    
    return (<>
        <IconButton
            aria-label={"more"}
            aria-controls={"long-menu"}
            aria-haspopup="true"
            onClick={handleClick}
        >
            <FilterIcon/>
        </IconButton>
        <Menu
            id={"long-menu"}
            anchorEl={anchorEl}
            keepMounted
            open={open}
            className={"session-filter"}
            onClose={handleClick}
        >
            <ReactSelect
                className={"instructor-session-filter"}
                placeholder={"Filter Instructor..."}
                value={InstructorValue}
                options={InstructorOptions}
                onChange={ onInstructorSelect }
                clearable
                isMulti
            />
        </Menu>
    </>)
}

export default withStyles(styles)(SessionFilters);