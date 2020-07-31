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
import Announcements from "./Announcements";
import StudentEnrollment from "./StudentEnrollment";
import CourseSessions from "./CourseSessions";
import { useSelector } from  "react-redux"

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
  dataFontDate: {
    fontWeight: "600",
  },
  dividerColor: {
    backgroundColor: "black",
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
  const {email} = useSelector(({auth}) => auth) || [];
  
  const GET_CLASSES = gql`
    query getClass($id: ID!, $email: String="") {
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
                email
              }
              accountType
              phoneNumber
            }
            accountType
          }
        }
        sessionSet {
          startDatetime
          id
        }
      }
      announcements(courseId: $id) {
        subject
        id
        body
        createdAt
        poster {
          firstName
          lastName
        }
      }
      accountSearch(query: $email) {
        total
        results {
          ... on AdminType {
            userUuid
            user {
              email
              firstName
              lastName
              id
            }
          }
        }
      }
    }
  `;

//   const DASHBOARD_QUERY = gql`query DashboardQuery($email: String="") {
//     sessionSearch(query: "", time: "today", sort: "timeAsc") {
//       results {
//         course {
//           courseCategory {
//             id
//             name
//           }
//         }
//       }
//     }

//   }
  
// `;

  const { data, loading, error } = useQuery(GET_CLASSES, { variables: {
    id: id.id,
    email: email
  } });
  
  if (loading) return <Loading />;
  if (error) return console.error(error.message);
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

  const abbreviatedDay = moment(startDate).format("ddd")
  const startingTime = moment(startTime, "HH:mm").format("h:mm A");
  const endingTime = moment(endTime, "HH:mm").format("h:mm A");
  const startingDate = moment(startDate).calendar();
  const endingDate = moment(endDate).calendar();

  const handleChange = (_, i) => {
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
              className={classes.dataFontDate}
            >{`${startingDate} - ${endingDate}`}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="left">
              Time
            </Typography>
            <Typography
              variant="body1"
              align="left"
              className={classes.dataFontDate}
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
              className={classes.dataFontDate}
            >{`${firstName} ${lastName}`}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="left">
              Grade
            </Typography>
            <Typography variant="body1" align="left" className={classes.dataFontDate}>
              {academicLevel}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="left">
              Subject
            </Typography>
            <Typography variant="body1" align="left" className={classes.dataFontDate}>
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
                      topMargin: "1.1em",
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
              <Divider classes={{root: classes.dividerColor}}/>
              </AppBar>
              <Grid container>
                <TabPanel index={0} value={index} backgroundColor="#FFFFFF">
                <ClassInfo description={description} />
                </TabPanel>
                <TabPanel index={1} value={index}>
                  <Announcements announcementsData={data.announcements} loggedInUser={data.accountSearch} />
                </TabPanel>
                <TabPanel index={2} value={index}>
                <StudentEnrollment enrollmentList={enrollmentSet} />
                </TabPanel>
                <TabPanel index={3} value={index}>
                  <CourseSessions sessionList={sessionSet}/>
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
