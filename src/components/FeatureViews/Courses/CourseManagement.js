import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
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
import { fullName } from "../../../utils";
import moment from "moment";

const baseTheme = createMuiTheme();
const skyBlue = { backgroundColor: "rgba(235, 250, 255, 0.5)" };
const BootstrapInput = withStyles((theme) => ({
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
    // Use the system font instead of the default Roboto font.
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
    "&:hover": { backgroundColor: skyBlue.backgroundColor, color: "#28ABD5" },
    "&:focus": skyBlue,
  },
  menuSelected: {
    backgroundColor: (skyBlue.backgroundColor += "!important"),
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
  },
  chipSize: {
    height: "2.5625em",
    width: "7.5em",
  },
  mainCardContainer: {
    paddingTop: "4.25em",
    width: "97%",
    marginLeft: "1.5em",
    marginTop: ".5em",
  },
}));

const CourseDisplayCard = ({
  title,
  day,
  endDate,
  endTime,
  startTime,
  startDate,
  instructor,
  id,
}) => {
  const classes = useStyles();
  let history = useHistory();
  const [activeTime, setActiveTime] = useState("Past");
  const [activeColor, setActiveColor] = useState("#BDBDBD");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  // const [currentTarget, setCurrentTarget] = useState();
  // const [tempTarget, setTempTarget] = useState();
  // const [previousTarget, setPreviousTarget] = useState();
  const { firstName, lastName } = instructor.user;
  const concatFullName = fullName(instructor.user);
  const letterDayManipulation = day.substring(1, 3).toLowerCase();
  const firstLetterDayManipulation = day.substring(0, 1);
  const abbreviatedDay = firstLetterDayManipulation + letterDayManipulation;
  const startingTime = moment(startTime, "HH:mm").format("h:mm A");
  const endingTime = moment(endTime, "HH:mm").format("h:mm A");
  const startingDate = moment(startDate).calendar();
  const endingDate = moment(endDate).calendar();

  useEffect(() => {
    const currentTime = moment().format("LT");
    if (currentTime > startTime && currentTime < endTime) {
      setActiveTime("Active");
      setActiveColor("#6FCF97");
    } else {
      setActiveTime("Past");
      setActiveColor("#BDBDBD");
    }
  }, [activeTime]);

  const handleClick = (e) => {
    history.push(`/coursemanagement/class/${id}`)
    // console.log("does this work?")
  };

  return (
    <>
      <Grid
        container
        justify="flex-start"
        className={classes.mainCardContainer}
        style={{ backgroundColor: `${bgColor}` }}
        data-active="inactive"
        onMouseEnter={() => setBgColor("#EBFAFF")}
        onMouseLeave={() => setBgColor("#FFFFFF")}
        onClick={handleClick}
      >
        <Grid item xs={6}>
          <Typography variant="h4" align="left" style={{ marginLeft: ".85em" }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "left" }}>
          <Chip
            label={activeTime}
            className={classes.chipSize}
            style={{ backgroundColor: activeColor }}
          />
        </Grid>
        <Grid
          item
          xs={3}
          // style={{ maxWidth: "12.66667%" }}
          className={classes.displayCardMargins}
        >
          <Typography
            variant="body1"
            align="left"
            style={{ marginLeft: "1.85em" }}
          >
            By:{" "}
            <span
              className={classes.highlightName}
            >{`${concatFullName}`}</span>
          </Typography>
        </Grid>
        <Divder
          orientation="vertical"
          flexItem
          style={{ height: "2em", marginTop: "1em" }}
        />
        <Grid item xs={6}>
          <Typography
            variant="body1"
            align="left"
            style={{ marginLeft: "1.2em" }}
            className={classes.displayCardMargins}
          >{`Time: ${startingDate} - ${endingDate} ${abbreviatedDay} ${startingTime} - ${endingTime} `}</Typography>
        </Grid>
      </Grid>
      <Divder />
    </>
  );
};

const CourseManagement = () => {
  const classes = useStyles();
  const [tab1, setTab1] = useState("");
  const [tab2, setTab2] = useState("");
  const [tab3, setTab3] = useState("");
  const [tab4, setTab4] = useState("");

  const handleChange1 = (event) => {
    setTab1(event.target.value);
  };

  const handleChange2 = (event) => {
    setTab2(event.target.value);
  };

  const handleChange3 = (event) => {
    setTab3(event.target.value);
  };

  const handleChange4 = (event) => {
    setTab4(event.target.value);
  };

  const GET_COURSES = gql`
  query getCourses {
    courses {
      dayOfWeek
      endDate
      endTime
      title
      startTime
      startDate
      instructor {
        user {
          firstName
          lastName
        }
      }
      courseId
    }
  }
  `;

  const { data, loading, error } = useQuery(GET_COURSES);

  if (loading) return <Loading />;
  if (error) return console.error(error.message);
  // console.log(data)

  const courseDisplayList = data.courses.map((courses) => (
    <CourseDisplayCard
      title={courses.title}
      day={courses.dayOfWeek}
      endDate={courses.endDate}
      endTime={courses.endTime}
      startTime={courses.startTime}
      startDate={courses.startDate}
      instructor={courses.instructor}
      id={courses.courseId}
    />
  ));

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
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  displayEmpty
                  value={tab1}
                  onChange={handleChange1}
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
                  {tab1 === "" ? <MenuItem value="">Sort By</MenuItem> : null}
                  <MenuItem
                    className={classes.menuSelect}
                    value={"start-date"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Start Date (Latest)
                  </MenuItem>
                  <MenuItem
                    className={classes.menuSelect}
                    value={"class-name"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Class Name(A-Z)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl className={classes.margin}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  displayEmpty
                  value={tab2}
                  onChange={handleChange2}
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
                  {tab2 === "" ? (
                    <MenuItem value="">All Grades</MenuItem>
                  ) : null}
                  <MenuItem
                    className={classes.menuSelect}
                    value={"start-date"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Start Date (Latest)
                  </MenuItem>
                  <MenuItem
                    className={classes.menuSelect}
                    value={"class-name"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Class Name(A-Z)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl className={classes.margin}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  displayEmpty
                  value={tab3}
                  onChange={handleChange3}
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
                  {tab3 === "" ? (
                    <MenuItem value="">All Subjects</MenuItem>
                  ) : null}
                  <MenuItem
                    className={classes.menuSelect}
                    value={"start-date"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Start Date (Latest)
                  </MenuItem>
                  <MenuItem
                    className={classes.menuSelect}
                    value={"class-name"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Class Name(A-Z)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl className={classes.margin}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  displayEmpty
                  value={tab4}
                  onChange={handleChange4}
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
                  {tab4 === "" ? (
                    <MenuItem value="">All Instructors</MenuItem>
                  ) : null}
                  <MenuItem
                    className={classes.menuSelect}
                    value={"start-date"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Start Date (Latest)
                  </MenuItem>
                  <MenuItem
                    className={classes.menuSelect}
                    value={"class-name"}
                    ListItemClasses={{ selected: classes.menuSelected }}
                  >
                    Class Name(A-Z)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        {courseDisplayList}
      </BackgroundPaper>
    </Grid>
  );
};

export default CourseManagement;
