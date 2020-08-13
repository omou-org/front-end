import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/EditOutlined";
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
import { useSelector } from "react-redux";
import { gradeLvl } from "../../../utils";
import theme from "../../../theme/muiTheme";

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
    fontWeight: "300",
    [theme.breakpoints.between("sm", "lg")]: {
      fontSize: ".75rem",
    },
  },
  dataFontDate: {
    fontWeight: "400",
    [theme.breakpoints.between("sm", "lg")]: {
      fontSize: ".8rem",
    },
  },
  dividerColor: {
    backgroundColor: "black",
  },
}));

export const GET_ANNOUNCEMENTS = gql`
  query getAnnouncement($id: ID!) {
    announcements(courseId: $id) {
      subject
      id
      body
      createdAt
      updatedAt
      poster {
        firstName
        lastName
      }
    }
  }
`;

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

  const { email, accountType } = useSelector(({ auth }) => auth) || [];

  const queryParser = (userType) =>
    ({
      ADMIN: "AdminType",
      INSTRUCTOR: "InstructorType",
      PARENT: "ParentType",
      STUDENT: "StudentType",
    }[userType]);

  const GET_CLASSES = gql`
    query getClass($id: ID!, $email: String = "") {
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
      accountSearch(query: $email) {
        total
        results {
          ... on ${queryParser(accountType)} {
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
      enrollments(courseId: $id) {
        student {
          user {
            id
          }
        }
      }
       ${
         accountType === "PARENT"
           ? `parent(email: $email) {
        studentList
      }`
           : ""
       }
    }
  `;

  const { data, loading, error } = useQuery(GET_CLASSES, {
    variables: {
      id: id.id,
      email: email,
    },
  });

  const getAnnouncements = useQuery(GET_ANNOUNCEMENTS, {
    variables: {
      id: id.id,
    },
  });

  if (loading) return <Loading />;
  if (getAnnouncements.loading) return <Loading />;
  if (error) return console.error(error.message);
  if (getAnnouncements.error)
    return console.error(getAnnouncements.error.message);

  const {
    academicLevel,
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

  const abbreviatedDay = moment(startDate).format("ddd");
  const startingTime = moment(startTime, "HH:mm").format("h:mm A");
  const endingTime = moment(endTime, "HH:mm").format("h:mm A");
  const startingDate = moment(startDate).calendar();
  const endingDate = moment(endDate).calendar();

  const handleChange = (_, i) => {
    return setIndex(i);
  };

  const comparison = (studentList, enrollmentArray) => {
    if (queryParser(accountType) === "ParentType") {
      for (const studentId of enrollmentArray) {
        return studentList?.includes(studentId.student.user.id);
      }
    } else {
      return true;
    }
  };

  const tabSelection = () => {
    switch(index) {
      case 0:
        return classes.chromeTabStart;
      case tabs.legth - 1: 
        return classes.chromeTabEnd;
      default:
        return classes.chromeTab;
    }
  }

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
            <IconButton
              className={classes.editcoursebutton}
              size="small"
              component={Link}
              to={`/registration/form/course_details/${id.id}`}
            >
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container justify="flex-start" style={{ marginTop: "2.5em" }}>
          <Grid item xs={2} md={4} lg={3} xl={2}>
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
          <Grid item xs={2} md={4} lg={3} xl={2}>
            <Typography
              variant="body2"
              align="left"
              className={classes.alignTitleLeft}
            >
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
          <Grid item xs={2} md={4} lg={2} xl={2}>
            <Typography
              variant="body2"
              align="left"
              className={classes.alignTitleLeft}
            >
              Instructor
            </Typography>
            <Typography
              variant="body1"
              align="left"
              className={classes.dataFontDate}
            >{`${firstName} ${lastName}`}</Typography>
          </Grid>
          <Grid item xs={2} md={4} lg={2} xl={2}>
            <Typography
              variant="body2"
              align="left"
              className={classes.alignTitleLeft}
            >
              Grade
            </Typography>
            <Typography
              variant="body1"
              align="left"
              className={classes.dataFontDate}
            >
              {gradeLvl(academicLevel)}
            </Typography>
          </Grid>
          <Grid item xs={2} md={4} lg={2} xl={2}>
            <Typography
              variant="body2"
              align="left"
              className={classes.alignTitleLeft}
            >
              Subject
            </Typography>
            <Typography
              variant="body1"
              align="left"
              className={classes.dataFontDate}
            >
              {name}
            </Typography>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: "2.5em" }}>
          <Grid item xs={12} sm={12}>
            <ThemeProvider theme={theme}>
                <Toolbar disableGutters>
                  <ChromeTabs
                    className={
                      tabSelection()
                    }
                    tabs={
                      comparison(data.parent?.studentList, data.enrollments)
                        ? tabs
                        : [{ label: "About Course" }]
                    }
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
                <Divider classes={{ root: classes.dividerColor }} />
              <Grid container>
                <TabPanel index={0} value={index} backgroundColor="#FFFFFF">
                  <ClassInfo description={description} />
                </TabPanel>
                <TabPanel index={1} value={index}>
                  <Announcements
                    announcementsData={getAnnouncements.data.announcements}
                    loggedInUser={data.accountSearch}
                    loggedInUserAccountType={accountType}
                  />
                </TabPanel>
                <TabPanel index={2} value={index}>
                  <StudentEnrollment
                    enrollmentList={enrollmentSet}
                    loggedInUser={data.accountSearch}
                    loggedInUserAccountType={accountType}
                  />
                </TabPanel>
                <TabPanel index={3} value={index}>
                  <CourseSessions
                    sessionList={sessionSet}
                    loggedInUser={data.accountSearch}
                  />
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
