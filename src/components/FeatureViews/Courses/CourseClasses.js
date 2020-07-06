import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/EditOutlined";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import Loading from "../../OmouComponents/Loading";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import BackButton from "../../OmouComponents/BackButton";
import ChromeTabs from "../../OmouComponents/ChromeTabs";
import TabPanel from "../../OmouComponents/TabPanel";
import ClassInfo from "./ClassInfo";
import StudentEnrollment from "./StudentEnrollment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  editcoursebutton: {
    border: "1px solid #999999",
    height: "2.25em",
    borderRadius: "0",
    width: "2.25em",
    float: "right",
    marginRight: "2.3em",
    marginTop: "2.1em",
  },
  alignTitleLeft: {
    textAlign: "left",
  },
}));

const baseTheme = createMuiTheme();

const CourseClasses = () => {
  const id = useParams();
  const classes = useStyles();
  const [index, setIndex] = useState(0);
  const tabs = [
    { label: "About Course" },
    { label: "Annoucements" },
    { label: "Student Enrolled" },
    { label: "Sessions" },
  ];

  const GET_CLASSES = gql`
    query getClass($id: ID!) {
      course(courseId: $id) {
        academicLevel
        courseCategory {
          name
          id
        }
        title
        startTime
        startDate
        endTime
        endDate
        dayOfWeek
        description
        instructor {
          user {
            firstName
            lastName
          }
        }
        enrollmentSet {
          student {
            user {
              firstName
              lastName
              id
            }
            primaryParent {
              user {
                firstName
                lastName
                id
              }
              accountType
              phoneNumber
            }
            accountType
          }
        }
        sessionSet {
          startDatetime
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_CLASSES, { variables: id });

  if (loading) return <Loading />;
  if (error) return console.error(error.message);

  console.log(data);

  const {
    academicLevel,
    dayOfWeek,
    description,
    endDate,
    endTime,
    enrollmentSet,
    startDate,
    startTime,
    title,
    sessionSet,
  } = data.course;
  const { name } = data.course.courseCategory;
  const { firstName, lastName } = data.course.instructor.user;

  // console.log(academicLevel);

  // console.log(enrollmentSet);
  // const x = enrollmentSet.map((e) => e);
  // console.log(x)

  // const y = sessionSet.map((e, i) => e);
  // console.log(y)

  const letterDayManipulation = dayOfWeek.substring(1, 3).toLowerCase();
  const firstLetterDayManipulation = dayOfWeek.substring(0, 1);
  const abbreviatedDay = firstLetterDayManipulation + letterDayManipulation;
  const startingTime = moment(startTime, "HH:mm").format("h:mm A");
  const endingTime = moment(endTime, "HH:mm").format("h:mm A");
  const startingDate = moment(startDate).calendar();
  const endingDate = moment(endDate).calendar();

  const handleChange = (e, i) => {
    return setIndex(i);
  };


  return (
    <Grid item xs={12}>
      <BackgroundPaper elevation={2}>
        <BackButton />
        <Hidden xsDown>
          <hr />
        </Hidden>
        <Grid container>
          <Grid item xs={6}>
            <Typography
              align="left"
              className="heading"
              variant="h3"
              style={{ marginTop: ".65em" }}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <IconButton className={classes.editcoursebutton} size="small">
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container justify="flex-start" style={{ marginTop: "2.5em" }}>
          <Grid item xs={2}>
            <Typography
              variant="body2"
              align="left"
              className={classes.alignTitleLeft}
            >
              Date
            </Typography>
            <Typography
              variant="body1"
              align="left"
            >{`${startingDate} - ${endingDate}`}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="left">
              Time
            </Typography>
            <Typography
              variant="body1"
              align="left"
            >{`${abbreviatedDay} ${startingTime} - ${endingTime}`}</Typography>
          </Grid>
        </Grid>
        <Grid container justify="flex-start" style={{ marginTop: "2em" }}>
          <Grid item xs={2}>
            <Typography variant="body2" align="left">
              Instructor
            </Typography>
            <Typography
              variant="body1"
              align="left"
            >{`${firstName} ${lastName}`}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="left">
              Grade
            </Typography>
            <Typography variant="body1" align="left">
              {academicLevel}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="left">
              Subject
            </Typography>
            <Typography variant="body1" align="left">
              {name}
            </Typography>
          </Grid>
        </Grid>

        <Grid container style={{marginTop: "2.5em"}}>
        <Grid item xs={12} sm={12}>
            <ThemeProvider theme={baseTheme}>
              <AppBar
                position={"static"}
                elevation={0}
                style={{ backgroundColor: "#ffffff" }}
              >
                <Toolbar disableGutters>
                  <ChromeTabs
                    className={
                      index === 0
                        ? classes.chromeTabStart
                        : index === tabs.length - 1
                        ? classes.chromeTabEnd
                        : classes.chromeTab
                    }
                    tabs={tabs}
                    tabStyle={{
                      bgColor: "#ffffff",
                      selectedBgColor: "#EBFAFF",
                      color: "rgba(102, 102, 102, 0.87)",
                      leftValue: 0,
                      rightValue: 0,
                    }}
                    tabProps={{
                      disableRipple: true,
                    }}
                    value={index}
                    onChange={handleChange}
                  />
                </Toolbar>
              <Divider />
              </AppBar>
              <Grid container>
                <TabPanel index={0} value={index} backgroundColor="#FFFFFF">
                <ClassInfo description={description} />
                </TabPanel>
                <TabPanel index={1} value={index}>
                </TabPanel>
                <TabPanel index={2} value={index}>
                  <StudentEnrollment enrollment={enrollmentSet} session={sessionSet}/>
                </TabPanel>
                <TabPanel index={3} value={index}>
                  Page Four
                </TabPanel>
              </Grid>
            </ThemeProvider>
          </Grid>
          </Grid>

      </BackgroundPaper>
    </Grid>
  );
};

export default CourseClasses;
