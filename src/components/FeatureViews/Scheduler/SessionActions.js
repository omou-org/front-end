import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as calenderActions from "../../../actions/calendarActions";
import PropTypes from "prop-types";
import React, {Component} from "react";
import "../../../theme/theme.scss";
//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import NewCourse from "@material-ui/icons/CalendarToday";
import AssignmentIcon from "@material-ui/icons/Assignment";
import UpdateTeacher from "@material-ui/icons/PersonAdd";
import Button from "@material-ui/core/Button";
import {NavLink} from "react-router-dom";

class SessionView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
	}

	render() {
		return (
			<Grid item xs={12}>
				<Paper elevation={2} className={"paper"}>
					<Grid
						container
						direction="row"
						justify="flex-start"
						className="registration-action-control"
					>
						<Grid item>
							<Button
								component={NavLink}
								to="/scheduler/add-course"
								variant="outlined"
								color="secondary"
								className="button"
							>
								<NewCourse className="icon"/>
								Add New Course
							</Button>
						</Grid>
						<Grid item>
							<Button
								to="/"
								variant="outlined"
								color="secondary"
								className="button"
							>
								<UpdateTeacher className="icon"/>
								Update Teacher Avalibility
							</Button>
						</Grid>
						<Grid item>
							<Button
								variant="outlined"
								color="secondary"
								className="button"
								aria-controls="simple-menu"
								aria-haspopup="true"
								onClick={""}
							>
								<AssignmentIcon className="icon"/>
								Add New Classroom
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		);
	}
}

SessionView.propTypes = {
	sessionView: PropTypes.string,
};

function mapStateToProps(state) {
	return {
		courses: state.Course["NewCourseList"],
		courseCategories: state.Course["CourseCategories"],
		students: state.Users["StudentList"],
		teachers: state.Users["TeacherList"],
		courseSessions: state.Course["CourseSessions"],
	};
}

function mapDispatchToProps(dispatch) {
	return {
		calenderActions: bindActionCreators(calenderActions, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionView);
