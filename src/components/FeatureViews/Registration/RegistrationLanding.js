import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";

import BackButton from "components/BackButton";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import SearchSelect from "react-select";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import * as hooks from "actions/hooks";
import {distinctObjectArray, gradeOptions} from "utils";
import CourseList from "./CourseList";
import Loading from "components/Loading";
import RegistrationActions from "./RegistrationActions";
import TutoringList from "./TutoringList";

const customStyles = {
	clearIndicator: (base, state) => ({
		...base,
		color: state.isFocused ? "blue" : "black",
		cursor: "pointer",
	}),
	option: (base) => ({
		...base,
		textAlign: "left",
	}),
};

const CustomClearText = () => "clear all";

const ClearIndicator = (indicatorProps) => {
	const {
		children = <CustomClearText/>,
		getStyles,
		innerProps: {ref, ...restInnerProps},
	} = indicatorProps;
	return (
		<div
			ref={ref}
			style={getStyles("clearIndicator", indicatorProps)}
			{...restInnerProps}
		>
			<div style={{padding: "0px 5px"}}>{children}</div>
		</div>
	);
};

const RegistrationLanding = () => {
	const courses = useSelector(({Course}) => Course.NewCourseList);
	const instructors = useSelector(({Users}) => Users.InstructorList);
	const categories = useSelector(({Course}) => Course.CourseCategories);

	const courseStatus = hooks.useCourse();
	const instructorStatus = hooks.useInstructor();
	const categoryStatus = hooks.useCategory();

	const [view, setView] = useState(0);
	const [courseFilters, setCourseFilters] = useState({
		grade: [],
		instructor: [],
		subject: [],
	});

	const updateView = useCallback(
		(newView) => () => {
			setView(newView);
		},
		[]
	);

	const instructorOptions = useMemo(
		() =>
			Object.values(instructors).map(({name, user_id}) => ({
				label: name,
				value: user_id,
			})),
		[instructors]
	);

	const subjectOptions = useMemo(
		() =>
			distinctObjectArray(
        Object.values(courses)
		// prevent a crash if some categories are not loaded yet
			.filter(({category}) => categories.find(({id}) => category == id))
			.map(({category}) => ({
				label: categories.find(({id}) => category == id).name,
				value: category,
			}))
			),
		[categories, courses]
	);

	const filteredCourses = useMemo(
		() =>
			Object.entries(courseFilters)
        .filter(([, filters]) => filters.length > 0)
        .reduce((courseList, [filterName, filters]) => {
			const mappedValues = filters.map(({value}) => value);
			switch (filterName) {
				case "instructor":
					return courseList.filter(({instructor_id}) =>
						mappedValues.includes(instructor_id)
					);
				case "subject":
					return courseList.filter(({category}) =>
						mappedValues.includes(category)
					);
				case "grade":
					return courseList.filter(({academic_level}) =>
						mappedValues.includes(academic_level)
					);
				default:
					return courseList;
			}
        }, Object.values(courses)),
		[courses, courseFilters]
	);

	const handleFilterChange = useCallback(
		(filterType) => (filters) => {
			setCourseFilters((prevFilters) => ({
				...prevFilters,
				[filterType]: filters || [],
			}));
		},
		[]
	);

	const isLoading =
		hooks.isLoading(courseStatus, categoryStatus, instructorStatus) &&
		Object.entries(courses).length === 0;

	const renderFilter = useCallback(
		(filterType) => {
			if (categories.length === 0) {
				return null;
			}

			let options = [];
			switch (filterType) {
				case "instructor":
					options = instructorOptions;
					break;
				case "subject":
					options = subjectOptions;
					break;
				case "grade":
					options = gradeOptions;
					break;
				// no default
			}

			return (
				<SearchSelect
					className="filter-options"
					closeMenuOnSelect={false}
					components={{ClearIndicator}}
					isMulti
					onChange={handleFilterChange(filterType)}
					options={options}
					placeholder={`All ${filterType}s`}
					styles={customStyles}
					value={courseFilters[filterType]}
				/>
			);
		},
		[
			categories.length,
			courseFilters,
			handleFilterChange,
			instructorOptions,
			subjectOptions,
		]
	);

	if (hooks.isFail(courseStatus) && Object.entries(courses).length) {
		return "Unable to load courses!";
	}

	return (
		<Paper elevation={2} className="RegistrationLanding paper">
			<BackButton/>
			<hr/>
			<RegistrationActions/>
			<Grid container layout="row">
				<Grid item md={8} xs={12}>
					<Typography align="left" className="heading" variant="h3">
						Registration Catalog
					</Typography>
				</Grid>
				<Grid className="catalog-setting-wrapper" item>
					<Tabs
						className="catalog-setting"
						indicatorColor="primary"
						value={view}
					>
						<Tab label="Courses" onClick={updateView(0)}/>
						<Tab label="Tutoring" onClick={updateView(1)}/>
					</Tabs>
				</Grid>
			</Grid>
			{view === 0 && (
				<Grid container layout="row" spacing={1}>
					<Grid item md={4} xs={12}>
						{renderFilter("instructor")}
					</Grid>
					<Hidden xsDown>
						<Grid item md={4} xs={12}>
							{renderFilter("subject")}
						</Grid>
						<Grid item md={4} xs={12}>
							{renderFilter("grade")}
						</Grid>
					</Hidden>
				</Grid>
			)}
			<div className="registration-table">
				{isLoading ? (
					<Loading/>
				) : view === 0 ? (
					<CourseList filteredCourses={filteredCourses}/>
				) : (
					<TutoringList/>
				)}
			</div>
		</Paper>
	);
};

export default RegistrationLanding;
