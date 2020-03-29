import React, {useCallback} from "react";
import {useHistory} from "react-router-dom";

import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

import "./Search.scss";
import {BootstrapInput} from "../Scheduler/SchedulerUtils";
import {useSearchParams} from "actions/hooks";

const CourseFilters = () => {
	const history = useHistory();
	const searchParams = useSearchParams();

	const handleFilterChange = useCallback(
		({target: {name, value}}) => {
			const params = new URLSearchParams(searchParams);
			switch (name) {
				case "classFilter":
					if (value === "course") {
						params.delete("course");
					} else {
						params.set("course", value);
					}
					break;
				case "availability":
					if (value === "availability") {
						params.delete("availability");
					} else {
						params.set("availability", value);
					}
					break;
				case "sortFilter":
					if (value === "relevance") {
						params.delete("sort");
					} else {
						params.set("sort", value);
					}
					break;
				// no default
			}
			history.push({
				pathname: "/search/",
				search: params.toString(),
			});
		},
		[history, searchParams]
	);

	return (
		<div className="courseFilters">
			<Grid
				item
				style={{
					marginRight: "10px",
					paddingTop: "5px",
				}}
			>
				<Typography variant="subtitle1">Filter | </Typography>
			</Grid>
			<Grid className="spacing" item>
				<FormControl>
					<Select
						input={<BootstrapInput name="classFilter"/>}
						onChange={handleFilterChange}
						value={searchParams.get("course") || "course"}
					>
						<MenuItem value="course">Course Type</MenuItem>
						<MenuItem value="class">Class</MenuItem>
						<MenuItem value="group">Group</MenuItem>
						<MenuItem value="tutoring">Tutoring</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<Grid item>
				<FormControl>
					<Select
						input={<BootstrapInput name="availability"/>}
						onChange={handleFilterChange}
						value={searchParams.get("availability") || "availability"}
					>
						<MenuItem value="availability">Availability</MenuItem>
						<MenuItem value="filled">Full</MenuItem>
						<MenuItem value="open">Open</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<Grid
				item
				style={{
					margin: "0px 20px",
					paddingTop: "5px",
				}}
			>
				<Typography variant="subtitle1">Sort | </Typography>
			</Grid>
			<Grid item>
				<FormControl>
					<Select
						input={<BootstrapInput name="sortFilter"/>}
						onChange={handleFilterChange}
						value={searchParams.get("sort") || "relevance"}
					>
						<MenuItem value="relevance">Relevance</MenuItem>
						<MenuItem value="dateAsc">Recent - Future</MenuItem>
						<MenuItem value="dateDesc">Future - Recent</MenuItem>
						<MenuItem value="timeDesc">Later Time - Earlier Time</MenuItem>
						<MenuItem value="timeAsc">Earlier Time - Later Time</MenuItem>
					</Select>
				</FormControl>
			</Grid>
		</div>
	);
};

export default CourseFilters;
