import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import { fullName, gradeOptions } from "../../../utils";
import moment from "moment";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import ListComponent, { ListContent, ListActions, ListHeading, ListTitle, ListDetails, ListDetail, ListDetailLink, ListButton, ListBadge, ListStatus, ListDivider } from '../../OmouComponents/ListComponent/ListComponent'
import theme, {
  highlightColor,
  activeColor,
  pastColor,
} from "../../../theme/muiTheme";
import { LabelBadge } from "theme/ThemedComponents/Badge/LabelBadge";

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
    marginBottom: "16px"
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
        __typename
      }
      __typename
    }
    courseCategory {
      id
      name
      __typename
    }
    courseId
    id
    __typename
    totalTuition
  }
}
`;

const ClassListItem = ({
  title,
  endDate,
  endTime,
  startTime,
  startDate,
  instructor,
  id,
  totalTuition,
}) => {
  const classes = useStyles();
  let history = useHistory();
  const concatFullName = fullName(instructor.user);
  const abbreviatedDay = moment(startDate).format("dddd");
  const startingTime = moment(startTime, "HH:mm").format("h:mm");
  const endingTime = moment(endTime, "HH:mm").format("h:mm");
  const startingDate = moment(startDate).format("MMM D YYYY");
  const endingDate = moment(endDate).format("MMM D YYYY");
  const currentDate = moment().format("L");
  const isActive = currentDate <= moment(endDate).format("L");
  const cost = totalTuition;

  const handleClick = (e) => history.push(`/coursemanagement/class/${id}`);


  return (
      <ListComponent>
        <ListContent>
            <ListHeading>
                <ListBadge>
                  <LabelBadge 
                    label={isActive ? "ACTIVE" : "PAST"} 
                    variant={`status-${isActive ? "active" : "past"}`} 
                  />
                </ListBadge>
                <Box onClick={handleClick}>
                  <ListTitle>
                    {title}
                  </ListTitle>
                </Box>
            </ListHeading>
            <ListDetails>
                <Link to={`/accounts/instructor/${instructor.user.id}`}>
                  <ListDetailLink>
                    {concatFullName}
                  </ListDetailLink>
                </Link>
                <ListDivider />
                <ListDetail>
                  {startingDate} - {endingDate}
                </ListDetail>
                <ListDivider />
                <ListDetail>
                  {abbreviatedDay} {startingTime} - {endingTime}pm
                </ListDetail>
                <ListDivider />
                <ListDetail>
                  {cost}
                </ListDetail>
            </ListDetails>
        </ListContent>
        <ListActions>
            <ListStatus>
                
            </ListStatus>
            <ListButton>
                
            </ListButton>
        </ListActions>
      </ListComponent>
  );
};

const CourseFilterDropdown = ({
  initialValue,
  filterList,
  setState,
  filter,
  filterKey,
}) => {
  const classes = useStyles();
  const handleChange = (event) => setState(event.target.value);
  const filterOptionsMapper = {
    instructors: (option) => ({
      value: option.instructor.user.id,
      label: fullName(option.instructor.user),
    }),
    subjects: (option) => ({
      value: option.courseCategory.id,
      label: option.courseCategory.name,
    }),
    grades: (option) => ({
      value: option.value.toUpperCase(),
      label: option.label,
    }),
  }[filterKey];

  const ChosenFiltersOption = filterList.map(filterOptionsMapper);

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
          {ChosenFiltersOption.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              className={classes.menuSelect}
              ListItemClasses={{ selected: classes.menuSelected }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

const CourseManagementContainer = () => {
  const classes = useStyles();
  const [sortByDate, setSortByDate] = useState("");
  const [gradeFilterValue, setGradeFilterValue] = useState("");
  const [subectFilterValue, setSubjectFilterValue] = useState("");
  const [instructorsFilterValue, setInstructorFilterValue] = useState("");

  const handleChange = (event) => setSortByDate(event.target.value);

  const { data, loading, error } = useQuery(GET_COURSES);

  if (loading) return <Loading />;
  if (error) return console.error(error.message);

  const createFilteredListFromCourses = (filterCondition) =>
    data.courses.reduce(
      (accumulator, currentValue) =>
        !accumulator.some((course) => filterCondition(currentValue, course))
          ? [...accumulator, currentValue]
          : accumulator,
      []
    );
  const subjectList = createFilteredListFromCourses(
    (currentValue, course) =>
      currentValue.courseCategory.id === course.courseCategory.id
  );
  const instructorsList = createFilteredListFromCourses(
    (currentValue, course) =>
      currentValue.instructor.user.id === course.instructor.user.id
  );

  const checkFilter = (value, filter) => "" === filter || value === filter;
  const sortDescOrder = (firstEl, secondEl) => (firstEl < secondEl ? -1 : 0);

  const defaultCourseDisplay = data.courses
    .filter(
      (course) =>
        checkFilter(course.academicLevel, gradeFilterValue) &&
        checkFilter(course.courseCategory.id, subectFilterValue) &&
        checkFilter(course.instructor.user.id, instructorsFilterValue)
    )
    .sort(
      (firstEl, secondEl) =>
        ({
          start_date: sortDescOrder(firstEl.startDate, secondEl.startDate),
          class_name: sortDescOrder(firstEl.title, secondEl.title),
        }[sortByDate])
    );

  return (
    <Grid item xs={12}>
      <Box width="100%" marginTop="22px">
        <Typography align="left" className="heading" variant="h1">
          Course Management
          </Typography>
      </Box>
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
          <CourseFilterDropdown
            filterList={gradeOptions}
            initialValue="All Grades"
            setState={setGradeFilterValue}
            filter={gradeFilterValue}
            filterKey="grades"
          />
          <CourseFilterDropdown
            filterList={subjectList}
            initialValue="All Subjects"
            setState={setSubjectFilterValue}
            filter={subectFilterValue}
            filterKey="subjects"
          />
          <CourseFilterDropdown
            filterList={instructorsList}
            initialValue="All Instructors"
            setState={setInstructorFilterValue}
            filter={instructorsFilterValue}
            filterKey="instructors"
          />
        </Grid>
      </Paper>
      {defaultCourseDisplay.map(
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
            <ClassListItem
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
    </Grid>
  );
};

export default CourseManagementContainer;