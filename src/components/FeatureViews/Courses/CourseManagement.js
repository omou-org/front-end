import React, { useEffect, useState, useMemo, useRef } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import Divder from "@material-ui/core/Divider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import moment from "moment";

const baseTheme = createMuiTheme();
const skyBlue = {backgroundColor: "rgba(235, 250, 255, 0.5)"}
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
    marginBottom: "1.25em"
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
    '&:hover': {backgroundColor: skyBlue.backgroundColor, color: "#28ABD5"},
    '&:focus': skyBlue,
  },
  menuSelected: {
    backgroundColor: skyBlue.backgroundColor += "!important",
},
}));

const CourseManagement = () => {
  const classes = useStyles();
  const [state, setState] = useState("");

  const handleChange = (event) => {
    setState(event.target.value);
  };

  const GET_COURSES = gql`query getCourses {
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
    }
  }  
  `

  const { data, loading, error } = useQuery(GET_COURSES);

  if(loading) return <Loading />;
  if(error) return console.error(error.message);
  console.log(data);

  const CourseDisplayCard = ({ title, day, endDate, endTime, startTime, startDate, instructor}) => {
    const { firstName, lastName } = instructor.user
    const letterDayManipulation = day.substring(1,3).toLowerCase();
    const firstLetterDayManipulation = day.substring(0, 1)
    const abbreviatedDay = firstLetterDayManipulation + letterDayManipulation;
    const startingTime = moment(startTime, "HH:mm").format("h:mm A");
    const endingTime = moment(endTime, "HH:mm").format("h:mm A");
    const startingDate = moment(startDate).calendar();
    const endingDate = moment(endDate).calendar();

    return (
      <Grid container justify="flex-start">
        <Grid item xs={8}>
    <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid item xs={4}>Active</Grid>
    <Grid item xs={2}>{`By: ${firstName} ${lastName}`}</Grid>
    <Divder orientation="vertical" flexItem />
    <Grid item xs={6}>{`Time: ${startingDate} - ${endingDate} ${abbreviatedDay} ${startingTime} - ${endingTime} `}</Grid>
      </Grid>
    )
  }

  const courseDisplayList = data.courses.map(e => <CourseDisplayCard title={e.title} day={e.dayOfWeek} endDate={e.endDate} endTime={e.endTime} startTime={e.startTime} startDate={e.startDate} instructor={e.instructor}/>);

  return (
    <Grid item xs={12}>
      <BackgroundPaper elevation={2}>
        <Typography align="left" className="heading" variant="h3">
          Course Management
        </Typography>
        <Paper elevation={4} className={classes.appBar}>
          <Grid container alignItems="center" className={classes.containerMargins}>
            <Grid item xs={3}>
              <FormControl className={classes.margin}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={state.age}
                  onChange={handleChange}
                  classes={{select: classes.menuSelect}}
                  input={<BootstrapInput />}
                  MenuProps={{
                    classes:{list: classes.dropdown
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left"
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                  <MenuItem className={classes.menuSelect} value={"start-date"} ListItemClasses={{ selected: classes.menuSelected}}>Start Date (Latest)</MenuItem>
                  <MenuItem className={classes.menuSelect} value={"class-name"} ListItemClasses={{ selected: classes.menuSelected}}>Class Name(A-Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl className={classes.margin}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={state.age}
                  onChange={handleChange}
                  input={<BootstrapInput />}
                  MenuProps={{
                    classes:{list: classes.dropdown
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left"
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl className={classes.margin}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={state.age}
                  onChange={handleChange}
                  input={<BootstrapInput />}
                  SelectDisplayProps={classes.menuSelect}
                  MenuProps={{
                    classes:{list: classes.dropdown
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left"
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl className={classes.margin}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={state.age}
                  onChange={handleChange}
                  input={<BootstrapInput />}
                  MenuProps={{
                    classes:{list: classes.dropdown
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left"
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left"
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
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
