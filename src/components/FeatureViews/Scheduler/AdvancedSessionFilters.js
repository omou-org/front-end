import React, {useContext} from "react";
import {SchedulerContext} from "./SchedulerContext";
import IconButton from "@material-ui/core/IconButton";
import {FilterList} from "@material-ui/icons";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Select from 'react-select'
import makeStyles from "@material-ui/core/styles/makeStyles";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
	sessionPopover: {
		padding: theme.spacing(3),
	},
	sessionInfo: {
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginTop: theme.spacing(1),
	}
}));

const AdvancedSessionFilters = () => {
	const {
		schedulerState: {
			instructorOptions = [],
			selectedInstructors = [],
			courseOptions = [],
			selectedCourses = [],
			studentOptions = [],
			selectedStudents = [],
		},
		updateSchedulerState
	} = useContext(SchedulerContext);
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleFilter = (filterType) => (event) => {
		updateSchedulerState((prevState) => ({
			...prevState,
			[filterType]: event || [],
		}));
	}

	const open = Boolean(anchorEl);
	const id = open ? 'advanced-session-filters-popover' : undefined;

	const numActiveFilters = selectedStudents.length + selectedCourses.length + selectedInstructors.length;

	return (
		<div>
			<IconButton
				aria-describedby={id}
				variant="contained"
				onClick={handleClick}
			>
				<Badge
					badgeContent={numActiveFilters}
					color="primary"
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
				>
					<FilterList/>
				</Badge>

			</IconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<div className={classes.sessionPopover}>
					<Typography variant="h3">
						Session Filters
					</Typography>
					<Select
						isMulti
						name="instructors"
						value={selectedInstructors}
						options={instructorOptions}
						onChange={handleFilter("selectedInstructors")}
						placeholder="Select Instructors"
					/>
					<Select
						isMulti
						name="courses"
						value={selectedCourses}
						options={courseOptions}
						onChange={handleFilter("selectedCourses")}
						placeholder="Select Courses"
					/>
					<Select
						isMulti
						name="students"
						value={selectedStudents}
						options={studentOptions}
						onChange={handleFilter("selectedStudents")}
						placeholder="Select Students"
					/>
				</div>

			</Popover>
		</div>
	);
}

export default AdvancedSessionFilters;