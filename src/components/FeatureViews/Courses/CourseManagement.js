import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import Divder from "@material-ui/core/Divider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import { fullName, gradeOptions } from "../../../utils";
import moment from "moment";
import theme, {
  highlightColor,
  activeColor,
  pastColor,
} from "../../../theme/muiTheme";

export const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #43B5D9",
    fontSize: 16,
    padding: "6px 26px 6px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  containerMargins: {
    marginTop: "1.25em",
    marginBottom: "1.25em",
  },
  margin: {
    margin: theme.spacing(1.5),
    minWidth: "12.8125em",
    [theme.breakpoints.down("md")]: {
      minWidth: "10em",
    },
  },
  appBar: {
    maxWidth: "calc(100% - 3%)",
    marginLeft: "1.5em",
    marginTop: "1.5em",
    border: "1px solid #43B5D9",
  },
  dropdown: {
    border: "1px solid #43B5D9",
    borderRadius: "5px",
  },
  menuSelect: {
    "&:hover": { backgroundColor: highlightColor, color: "#28ABD5" },
    "&:focus": highlightColor,
  },
  menuSelected: {
    backgroundColor: `${highlightColor} !important`,
  },
  highlightName: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "1.15rem",
    lineHeigh: "1.25em",
    color: "#28ABD5",
  },
  displayCardMargins: {
    marginTop: "1em",
    marginBottom: "1em",
    [theme.breakpoints.down("md")]: {
      fontSize: ".85rem",
    },
  },
  chipSize: {
    height: "2.0625em",
    width: "6.5em",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "1rem",
    color: "#FFFFFF",
  },
  mainCardContainer: {
    paddingTop: "4.25em",
    width: "97%",
    marginLeft: "1.5em",
    marginTop: ".5em",
    "&:hover": {
      backgroundColor: highlightColor,
    },
  },
}));

const CourseDisplayCard = ({
  title,
  endDate,
  endTime,
  startTime,
  startDate,
  instructor,
  id,
}) => {
  const classes = useStyles();
  let history = useHistory();
  const concatFullName = fullName(instructor.user);
  const abbreviatedDay = moment(startDate).format("ddd");
  const startingTime = moment(startTime, "HH:mm").format("h:mm A");
  const endingTime = moment(endTime, "HH:mm").format("h:mm A");
  const startingDate = moment(startDate).calendar();
  const endingDate = moment(endDate).calendar();

  const isActive = (startTime, endTime, startDate, endDate) => {
    const currentTime = moment().format("HH:mm:ss");
    const currentDate = moment().format("L");
    return (
      currentDate >= startDate &&
      currentTime >= startTime &&
      currentTime <= endTime &&
      currentDate <= endDate
    );
  };

  const handleClick = (e) => {
    history.push(`/coursemanagement/class/${id}`);
  };

  return (
    <>
      <Grid
        container
        justify="flex-start"
        className={classes.mainCardContainer}
        data-active="inactive"
        onClick={handleClick}
      >
        <Grid item xs={6} sm={9} md={6}>
          <Typography variant="h4" align="left" style={{ marginLeft: ".85em" }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3} md={6} style={{ textAlign: "left" }}>
          <Chip
            label={
              isActive(startTime, endTime, startingDate, endingDate)
                ? "ACTIVE"
                : "PAST"
            }
            className={classes.chipSize}
            style={{
              backgroundColor: isActive(
                startTime,
                endTime,
                startingDate,
                endingDate
              )
                ? activeColor
                : pastColor,
            }}
          />
        </Grid>
        <Grid item xs={3} sm={4} md={3} className={classes.displayCardMargins}>
          <Typography
            variant="body1"
            align="left"
            style={{ marginLeft: "1.85em" }}
          >
            <span style={{ marginRight: theme.spacing(1) }}>By:</span>
            <span className={classes.highlightName}>{`${concatFullName}`}</span>
          </Typography>
        </Grid>
        <Divder
          orientation="vertical"
          flexItem
          style={{ height: "2em", marginTop: "1em" }}
        />
        <Grid item xs={6} sm={7} md={6}>
          <Typography
            variant="body1"
            align="left"
            style={{ marginLeft: "1.2em", paddingTop: "3px" }}
            className={classes.displayCardMargins}
          >{`Time: ${startingDate} - ${endingDate} ${abbreviatedDay} ${startingTime} - ${endingTime} `}</Typography>
        </Grid>
      </Grid>
      <Divder />
    </>
  );
};

const CourseFilter = ({ initialValue, filterList, setState, filter }) => {
  const classes = useStyles();
  const handleChange = (event) => setState(event.target.value);

  const chosenFilter = filterList.map((filterItem) => {
    switch (initialValue) {
      case "All Instructors":
        return (
          <MenuItem
            key={filterItem.instructor.user.lastName}
            className={classes.menuSelect}
            value={filterItem.instructor.user.lastName}
            ListItemClasses={{ selected: classes.menuSelected }}
          >
            {fullName(filterItem.instructor.user)}
          </MenuItem>
        );
      case "All Subjects":
        return (
          <MenuItem
            key={filterItem.courseCategory.name}
            className={classes.menuSelect}
            value={filterItem.courseCategory.name}
            ListItemClasses={{ selected: classes.menuSelected }}
          >
            {filterItem.courseCategory.name}
          </MenuItem>
        );
      case "All Grades":
        return (
          <MenuItem
            key={filterItem.label}
            className={classes.menuSelect}
            value={filterItem.value.toUpperCase()}
            ListItemClasses={{ selected: classes.menuSelected }}
          >
            {filterItem.label}
          </MenuItem>
        );
      default:
        return;
    }
  });

  return (
    <Grid item xs={3}>
      <FormControl className={classes.margin}>
        <Select
          labelId="course-management-sort-tab"
          id="course-management-sort-tab"
          displayEmpty
          value={filter}
          onChange={handleChange}
          classes={{ select: classes.menuSelect }}
          input={<BootstrapInput />}
          MenuProps={{
            classes: { list: classes.dropdown },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
        >
          <MenuItem
            ListItemClasses={{ selected: classes.menuSelected }}
            value=""
          >
            {initialValue}
          </MenuItem>
          {chosenFilter}
        </Select>
      </FormControl>
    </Grid>
  );
};

const CourseManagement = () => {
  const classes = useStyles();
  const [sortByDate, setSortByDate] = useState("");
  const [filterByGrades, setFilterByGrades] = useState("");
  const [filterBySubjects, setFilterBySubjects] = useState("");
  const [filterByInstructors, setFilterByInstructors] = useState("");

  const handleChange = (event) => setSortByDate(event.target.value);

  const GET_COURSES = gql`
    query getCourses {
      courses {
        dayOfWeek
        endDate
        endTime
        title
        startTime
        academicLevel
        startDate
        instructor {
          user {
            firstName
            lastName
            id
          }
        }
        courseCategory {
          id
          name
        }
        courseId
        id
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_COURSES);

  if (loading) return <Loading />;
  if (error) return console.error(error.message);

  const createFilteredListFromCourses = (filterCriteria) =>
    data.courses.reduce(
      (accumulator, currentValue) =>
        !accumulator.some((dataExist) =>
          filterCriteria === "course"
            ? currentValue.courseCategory.id === dataExist.courseCategory.id
            : currentValue.instructor.user.id === dataExist.instructor.user.id
        )
          ? [...accumulator, currentValue]
          : accumulator,
      []
    );

  const subjectList = createFilteredListFromCourses("course");
  const instructorsList = createFilteredListFromCourses("instructor");

  const checkFilter = (value, filter) => "" === filter || value === filter;
  const sortDescOrder = (firstEl, secondEl) => (firstEl < secondEl ? -1 : 0);

  const normalCourseDisplay = data.courses
    .filter(
      (course) =>
        checkFilter(course.academicLevel, filterByGrades) &&
        checkFilter(course.courseCategory.name, filterBySubjects) &&
        checkFilter(course.instructor.user.lastName, filterByInstructors)
    )
    .sort((firstEl, secondEl) => {
      switch (sortByDate) {
        case "start_date":
          return sortDescOrder(firstEl.startDate, secondEl.startDate);
        case "class_name":
          return sortDescOrder(firstEl.title, secondEl.title);
        default:
          return;
      }
    });

  return (
    <Grid item xs={12}>
      <BackgroundPaper elevation={2}>
        <Typography align="left" className="heading" variant="h3">
          Course Management
        </Typography>
        <Paper elevation={4} className={classes.appBar}>
          <Grid
            container
            alignItems="center"
            className={classes.containerMargins}
          >
            <Grid item xs={3}>
              <FormControl className={classes.margin}>
                <Select
                  labelId="course-management-sort-tab"
                  id="course-management-sort-tab"
                  displayEmpty
                  value={sortByDate}
                  onChange={handleChange}
                  classes={{ select: classes.menuSelect }}
                  input={<BootstrapInput />}
                  MenuProps={{
                    classes: { list: classes.dropdown },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {sortByDate === "" && (
                    <MenuItem
                      ListItemClasses={{ selected: classes.menuSelected }}
                      value=""
                    >
                      Sort By
                    </MenuItem>
                  )}
                  <MenuItem
                    className={classes.menuSelect}
                    value={"start_date"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Start Date (Latest)
                  </MenuItem>
                  <MenuItem
                    className={classes.menuSelect}
                    value={"class_name"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Class Name(A-Z)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <CourseFilter
              filterList={gradeOptions}
              initialValue="All Grades"
              setState={setFilterByGrades}
              filter={filterByGrades}
            />
            <CourseFilter
              filterList={subjectList}
              initialValue="All Subjects"
              setState={setFilterBySubjects}
              filter={filterBySubjects}
            />
            <CourseFilter
              filterList={instructorsList}
              initialValue="All Instructors"
              setState={setFilterByInstructors}
              filter={filterByInstructors}
            />
          </Grid>
        </Paper>
        {normalCourseDisplay.map(
          ({
            title,
            dayOfWeek,
            endDate,
            endTime,
            startTime,
            startDate,
            instructor,
            id,
          }) => (
            <CourseDisplayCard
              title={title}
              day={dayOfWeek}
              endDate={endDate}
              endTime={endTime}
              startTime={startTime}
              startDate={startDate}
              instructor={instructor}
              id={id}
              key={title}
            />
          )
        )}
      </BackgroundPaper>
    </Grid>
  );
};

export default CourseManagement;
