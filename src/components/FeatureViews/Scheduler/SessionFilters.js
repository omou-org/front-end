import React, {useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import FilterIcon from "@material-ui/icons/FilterList";
import Menu from "@material-ui/core/Menu";
import {withStyles} from "@material-ui/core/styles";
import ReactSelect from "react-select";
import {MenuItem, Tooltip} from "@material-ui/core";

const styles = {
	root: {
		width: 230,
	},
};

function SessionFilters({
							onInstructorSelect,
							InstructorValue,
							InstructorOptions,
							CourseValue,
							onCourseSelect,
							CourseOptions,
						}) {
	let [anchorEl, setAnchorEl] = useState(null);
	let [open, setOpen] = useState(false);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
		setOpen(!open);
	};

	return (
		<>
			<Tooltip title={"Session Filters"}>
				<IconButton
					aria-label={"more"}
					aria-controls={"long-menu"}
					aria-haspopup="true"
					onClick={handleClick}
				>
					<FilterIcon/>
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
					style={{backgroundColor: "#FAFAFA"}}
				>
					{" "}
					Select Filter
				</MenuItem>
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
		</>
	);
}

export default withStyles(styles)(SessionFilters);
