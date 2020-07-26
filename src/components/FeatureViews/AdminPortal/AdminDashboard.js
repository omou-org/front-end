import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ChromeTabs from "./ChromeTabs";
import TabPanel from "./TabPanel";
import {
  RevenuebyQuarter,
  InstructorUtilization,
  ClassEnrollment,
  PopularSubject,
} from "../AdminPortal/AdminDashboardCharts";
import { Snapshot, OutstandingPaymentCard } from "./AdminDashboardCards";
import "./AdminPortal.scss";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import Loading from "../../OmouComponents/Loading";

const baseTheme = createMuiTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    color: "#404143",
  },
  tabName: {
    float: "left",
    marginLeft: "24px",
    marginTop: "10px",
    marginBottom: "10px",
    fontWeight: "bold",
    lineHeight: "28px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    color: "#666666",
  },
  chromeTabStart: {
    alignSelf: "flex-end",
    border: "1px solid #EEEEEE",
    borderBottom: "0px",
    borderLeft: "0px",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#ffffff",
  },
  chromeTabEnd: {
    alignSelf: "flex-end",
    border: "1px solid #EEEEEE",
    borderBottom: "0px",
    borderRight: "0px",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#ffffff",
  },
  chromeTab: {
    alignSelf: "flex-end",
    border: "1px solid #EEEEEE",
    borderBottom: "0px",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#ffffff",
  },
  snapshot: {
    marginLeft: "24px",
    backgroundColor: "#FFFFFF",
  },
  snapshotalt: {
    marginLeft: "7em",
    backgroundColor: "#FFFFFF",
  },
  popSub: {
    float: "left",
    marginLeft: "24px",
    marginTop: "20px",
    marginBottom: "10px",
    fontWeight: "bold",
    lineHeight: "28px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    color: "#666666",
  },
  outstandpay: {
    width: "15.313em",
  },
}));

const AdminDashboard = (props) => {
  const classes = useStyles();
  const [index, setIndex] = useState(0);
  const tabs = [
    { label: "Dashboard" },
    { label: "Manage Courses" },
    { label: "Manage Pricing" },
    { label: "Access Control" },
  ];

  const QUERIES = 
    // gql`
    //   query MyQuery {
    //     unpaidSessions {
    //       paymentList {
    //         parent {
    //           user {
    //             firstName
    //             lastName
    //             id
    //           }
    //         }
    //       }
    //       course {
    //         startTime
    //         endTime
    //         hourlyTuition
    //         totalTuition
    //       }
    //       lastPaidSessionDatetime
    //     }
    //     enrollments {
    //       course {
    //         totalTuition
    //         startDate
    //       }
    //     }
    //   }
    // `
    gql`
      query myQuery {
        enrollments {
            course {
                totalTuition
                startDate
                maxCapacity
                enrollmentSet{
                  id
                }
            }
        }
        numRecentSessions(timeframe: ALL_TIME)
        sessions {
          course {
            id
            title
          }
        }
      }
    
    `


  const { data, loading, error } = useQuery(QUERIES);

  if (loading) { return <Loading/>}
  

  const getTime = (time) => {
    const minutes = parseInt(time.slice(-2), 10) / 60;
    const hours = parseInt(time.substring(0, 2), 10);
    return hours + minutes;
  };

  const {numRecentSessions, enrollments, sessions} = data;
  console.log(sessions);


  
  const getCapacity = () => enrollments.map((enrollment)=> {
    const maxCapacity = enrollment.course.maxCapacity;
    return maxCapacity
  });

  const totalCapacity = () => {
    const total = getCapacity().reduce((previousValue, currentValue) => {
      return previousValue + currentValue
    })
    return total
  }

  const getEnrolled = () => enrollments.map((enrollment)=>{
    const enrolled = enrollment.course.enrollmentSet.length;
    return enrolled
  })

  const totalEnrolled = () => {
    const total = getEnrolled().reduce((previousValue, currentValue) => {
      return previousValue + currentValue
    })
    return total
  }

  const classEnrollment = () => {
    return [
      { class: "filled", val: totalEnrolled() },
      { class: "unfilled", val: totalCapacity()-totalEnrolled() }
    ]
  }

  const totalTuitionArray = enrollments.map((enrollments)=> {
    return {  tuition: enrollments.course.totalTuition,
              startDate: enrollments.course.startDate
    }
  })

  const sessionsArray = sessions.map((sessions)=> {
    return {  class: sessions.course.title,
    }
  })



  const totalTuition = totalTuitionArray.reduce((previousValue, currentValue)=>{
    return {
      tuition: previousValue.tuition + currentValue.tuition
    }
  })

  

  // var val = array.reduce(function(previousValue, currentValue) {
  //   return {
  //     adults: previousValue.adults + currentValue.adults,
  //     children: previousValue.children + currentValue.children
  //   }
  // });

  // const unpaidSessionsObj = () => {
  //   const parentObj = data?.unpaidSessions.map((user) => {
  //     const { endTime, startTime, hourlyTuition } = user.course;
  //     const totalTime = getTime(endTime) - getTime(startTime);
  //     const dollarsPerSession = totalTime * hourlyTuition;
  //     const lastPaidSessionDateTime = user.lastPaidSessionDatetime
  //       .substring(0, 10)
  //       .replace("-", "")
  //       .replace("-", "");
  //     const missedPaymentSessions =
  //       moment().diff(lastPaidSessionDateTime, "days") / 7;
  //     const amountDue = dollarsPerSession * Math.ceil(missedPaymentSessions);
  //     const firstName = user.paymentList[0].parent.user.firstName;
  //     const lastName = user.paymentList[0].parent.user.lastName;
  //     const id = user.paymentList[0].parent.user.id;
  //     return {
  //       name: `${firstName} ${lastName}`,
  //       initial: `${firstName.charAt(0)}${lastName.charAt(0)}`,
  //       id: id,
  //       due: amountDue,
  //     };
  //   });
  //   return parentObj || [];
  // };

  const filterAndAddDuplicates = (arr) => {
    console.log(arr);
    const results = arr.reduce((r, { id, due, name, initial }) => {
      const temp = r.find((res) => res.id === id);
      if (!temp) {
        r.push({ id, due, name, initial });
      } else {
        temp.due += due;
      }
      return r;
    }, []);
    return results;
  };

  const handleChange = (e, i) => {
    return setIndex(i);
  };

  if (loading) return <Loading />;
  // const unpaidSessions = filterAndAddDuplicates(unpaidSessionsObj());

  // const unpaidSessionsComponent = unpaidSessions.map((card) => (
  //   <OutstandingPaymentCard
  //     name={card.name}
  //     initials={card.initial}
  //     due={card.due}
  //   />
  // ));

  return (
    <div className={classes.root}>
      <Paper className="registration-cart paper">
        <Grid container layout="row">
          <Grid item xs={12}>
            <Typography align="left" variant="h3" className={classes.title}>
              Admin Portal
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <ThemeProvider theme={baseTheme}>
              <AppBar
                position={"static"}
                elevation={0}
                style={{ backgroundColor: "#fafafa" }}
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
                    }}
                    tabProps={{
                      disableRipple: true,
                    }}
                    value={index}
                    onChange={handleChange}
                  />
                </Toolbar>
              </AppBar>
              <Grid container>
                <TabPanel index={0} value={index}>
                  <Grid container>
                    <Grid item xs={9}>
                      <Typography className={classes.tabName}>
                        QUICK SNAPSHOT
                      </Typography>
                      <Grid container>
                        <Grid item md={3} className={classes.snapshot}>
                          <Snapshot snapName="Revenue" number={`$${totalTuition.tuition}`} />
                        </Grid>
                        <Grid item md={3} className={classes.snapshotalt}>
                          <Snapshot
                            snapName="Outstanding Payments"
                            number="$877"
                          />
                        </Grid>
                        <Grid item md={3} className={classes.snapshotalt}>
                          <Snapshot snapName="Total Sessions" number={numRecentSessions} />
                        </Grid>
                        <Grid container>
                          <Grid item md={6}>
                            <Typography className={classes.popSub}>
                              POPULAR SUBJECT
                            </Typography>
                            <PopularSubject />
                          </Grid>
                          <Grid item md={6}>
                            <Typography className={classes.popSub}>
                              CLASS ENROLLMENT
                            </Typography>
                            <ClassEnrollment 
                            data = {classEnrollment()}
                            />
                          </Grid>
                          <Grid item md={6}>
                            <Typography className={classes.popSub}>
                              INSTRUCTOR UTILIZATION
                            </Typography>
                            <InstructorUtilization />
                          </Grid>
                          <Grid item md={6}>
                            <Typography className={classes.popSub}>
                              REVENUE BY QUARTER
                            </Typography>
                            <RevenuebyQuarter />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <Grid item xs={12}>
                        <Typography className={classes.tabName}>
                          OUTSTANDING PAYMENTS
                        </Typography>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={10}>
                          {/* {unpaidSessionsComponent} */}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel index={1} value={index}>
                  Page Two
                </TabPanel>
                <TabPanel index={2} value={index}>
                  Page Three
                </TabPanel>
                <TabPanel index={3} value={index}>
                  Page Four
                </TabPanel>
              </Grid>
            </ThemeProvider>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AdminDashboard;
