import React, { useState, useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
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
import { useHistory, useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import { fullName, gradeOptions } from "../../../utils";
import moment from "moment";
import axios from "axios"; 
import * as actions from "actions/actionTypes";
import googleClassroomLogo from "../../GoogleClassroomIcon.png";
import Tooltip from '@material-ui/core/Tooltip';


import { Link } from "react-router-dom";
import CourseAvailabilites from "../../OmouComponents/CourseAvailabilities";

import Box from "@material-ui/core/Box";
import ListDetailedItem, {
  ListContent,
  ListActions,
  ListHeading,
  ListTitle,
  ListDetails,
  ListDetail,
  ListDetailLink,
  ListButton,
  ListBadge,
  ListStatus,
  ListDivider,
} from "../../OmouComponents/ListComponent/ListDetailedItem";
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
    marginBottom: "16px",
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

const GET_COURSES = gql`
  query getCourses {
    courses {
      endDate
      title
      availabilityList {
        dayOfWeek
        endTime
        startTime
      }
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
      googleClassCode
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
  availabilityList,
  startDate,
  instructor,
  id,
  googleClassCode,
  totalTuition,
}) => {
  const classes = useStyles();
  let history = useHistory();
  const concatFullName = fullName(instructor.user);
  const startingDate = moment(startDate).format("MMM D YYYY");
  const endingDate = moment(endDate).format("MMM D YYYY");
  const isActive = moment().diff(moment(endDate)) < 0;
  const cost = totalTuition;
  const { google_access_token, google_courses } = useSelector(({ auth }) => auth);
  const [courses, setCourses] = useState();
  const [gClassResp, setGClassResp] = useState();
  const dispatch = useDispatch();

  const handleClick = (e) => history.push(`/coursemanagement/class/${id}`);

  useEffect(() => {
    (async () => {
      setGClassResp( await axios.get("https://classroom.googleapis.com/v1/courses", {
        "headers": {
          "Authorization": `Bearer ${google_access_token}`,
        },
      }));
    })();
  }, [google_access_token]);

  function checkCourses(googleCode){
    var isIntegrated = false;
    if(googleCode && gClassResp){
      if(google_courses === undefined || google_courses == null){
        dispatch({
          type: actions.SET_GOOGLE_COURSES,
          payload: {google_courses: gClassResp.data.courses}
        })
      }
      gClassResp.data.courses.forEach(function(course) {
        if(course.enrollmentCode == googleCode){
          isIntegrated = true;
          console.log(course.enrollmentCode);
          console.log({googleCode});
        } 
      });
      console.log(isIntegrated);
      return isIntegrated ? <img src={googleClassroomLogo} width="30" height="30"/> : <div></div>;
    } 
    else{
      return <div></div>;
    }
  } 

  return (
    <ListDetailedItem>
      <ListContent>
        <ListHeading>
          <ListBadge>
            <LabelBadge variant={`status-${isActive ? "active" : "past"}`}>
              {isActive ? "ACTIVE" : "PAST"}
            </LabelBadge>
          </ListBadge>
          <Box onClick={handleClick}>
            <ListTitle>{title}</ListTitle>
          </Box>
          <ListDivider />
          <Tooltip title="Integrated with Google Classroom" placement="top" arrow> 
              {checkCourses(googleClassCode)}        
          </Tooltip>
        </ListHeading>
        <ListDetails>
          <Link to={`/accounts/instructor/${instructor.user.id}`}>
            <ListDetailLink>{concatFullName}</ListDetailLink>
          </Link>
          <ListDivider />
          <ListDetail>
            {startingDate} - {endingDate}
          </ListDetail>
          <ListDivider />
          <ListDetail>
            <CourseAvailabilites availabilityList={availabilityList} />
          </ListDetail>
          <ListDivider />
          <ListDetail>{cost}</ListDetail>
        </ListDetails>
      </ListContent>
      <ListActions>
        <ListStatus></ListStatus>
        <ListButton></ListButton>
      </ListActions>
    </ListDetailedItem>
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
  const dispatch = useDispatch();

  const handleChange = (event) => setSortByDate(event.target.value);

  const { data, loading, error } = useQuery(GET_COURSES, {
    onCompleted: (data) => {
      dispatch({
        type: actions.GET_GOOGLE_CLASSCODE, 
        payload: {courses: data.courses}
      })
    }});

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
      <BackgroundPaper elevation={2}>
        <Typography align="left" className="heading" variant="h3">
          Course Management
        </Typography>
      </BackgroundPaper>
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
                    className={classes.menuSelect}
                    value={"start_date"}
                    ListItemClasses={{ selected: classes.menuSelected }}
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
        ({ title, availabilityList, endDate, startDate, instructor, id, googleClassCode }) => (
          <ClassListItem
            title={title}
            day={availabilityList[0].dayOfWeek}
            availabilityList={availabilityList}
            endDate={endDate}
            startDate={startDate}
            instructor={instructor}
            id={id}
            googleClassCode={googleClassCode}
            key={title}
          />
        )
      )}
    </Grid>
  );
};

export default CourseManagementContainer;
