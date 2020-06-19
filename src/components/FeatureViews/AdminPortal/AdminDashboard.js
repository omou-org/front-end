import React, { useState, useEffect, useMemo } from "react";
import {
  Chart,
  BarSeries,
  PieSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Legend,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { EventTracker } from "@devexpress/dx-react-chart"
// import { Chart, SeriesTemplate, CommonSeriesSettings, Title } from 'devextreme-react/chart';
import { Animation, LineSeries } from "@devexpress/dx-react-chart";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ChromeTabs from "./ChromeTabs";
import TabPanel from "./TabPanel";
import ProfileCard from "../Accounts/ProfileCard";
import UserAvatar from "../Accounts/UserAvatar"
import "./AdminPortal.scss";
import {useSelector} from "react-redux";
import {stringToColor} from "../Accounts/accountUtils";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";


const baseTheme = createMuiTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
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
  // To move to it's own component
  snapshot: {
    marginLeft: "24px",
    backgroundColor: "#FFFFFF",
  },
  snapshotalt: {
    marginLeft: "7em",
    backgroundColor: "#FFFFFF",
  },
  snapName: {
    color: "#666666",
    float: "left",
    lineHeight: "1.1rem",
    fontSize: "0.9375rem",
    marginLeft: "21px",
    marginTop: "12px",
  },
  number: {
    float: "left",
    marginLeft: "21px",
    color: "#28ABD5",
    fontSize: "2.8125rem",
    fontWeight: "300",
    fontStyle: "normal",
  },
  chartPaper: {
    height: "px",
    width: "36.25em",
    marginLeft: "1.675em",
    marginTop: "3.7875em",
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
  barPosition: {
    marginLeft: "3em"
  },
  piePosition: {
    marginLeft: "2.75em"
  },
  opCard:{
    // width: "80% !important",
    margin: "20px !important",
    padding: "10px !important",
  },
  opAvatar:{
    width: "65px",
    height: "65px",
    fontSize: "30px",
    alignSelf: "center",
    fontFamily: "Roboto"
  },
  opDetail:{
    fontSize: "12px",
    textAlign: "left"
  },
  amtdue:{
    color: "red",
  }
}));

const AdminDashboard = (props) => {
  // console.log(props);
  const classes = useStyles();
  const [index, setIndex] = useState(0);
  const tabs = [
    { label: "Dashboard" },
    { label: "Manage Courses" },
    { label: "Manage Pricing" },
    { label: "Access Control" },
  ];
  
  const QUERIES = {
    "unpaidsessions": gql`query MyQuery {
      unpaidSessions {
        paymentList {
          parent {
            user {
              firstName
              lastName
              id
            }
          }
        }
        course {
          startTime
          endTime
          hourlyTuition
        }
        lastPaidSessionDatetime
      }
    }
    `,
  }

// console.log(UNPAID_SESSIONS)

 const unpaidSessionsData = useQuery(QUERIES["unpaidsessions"])
//  console.log(unpaidSessionsData)
 
const getTime = (time) => {
  const strTime = String(time);
  const minutes = parseInt(strTime.slice(-2), 10) / 60;
  const hours = parseInt(strTime.substring(1), 10);
  return hours + minutes;
}; 

 const calculateUnpaidSessions = () => {
   if(unpaidSessionsData.data) {
     const TotalAmountDue = unpaidSessionsData.data.unpaidSessions.map(time=> {
     const { endTime, startTime, hourlyTuition } = time.course
     const totalTime = getTime(endTime) - getTime(startTime);
     const dollarsPerSession = totalTime * hourlyTuition;
     const lastPaidSessionDateTime = time.lastPaidSessionDatetime.substring(0,10).replace("-", "").replace("-", "");
    const missedPaymentSessions = moment().diff(lastPaidSessionDateTime, 'days') / 7
     const AmountDue = dollarsPerSession * Math.ceil(missedPaymentSessions)
      return AmountDue
     });
     return TotalAmountDue;
    };
};

 console.log(calculateUnpaidSessions())


  const OPdata = [
    {
    name: "David Hong",
    initials: "DH",
    due: 350
    }, 
    {
      name: "Jimmy Chiu",
      initials: "JC",
      due: 300
    },
    {
      name: "Kelly Smith",
      initials: "KS",
      due: 288
    },
    {
      name: "Sarah Pullman",
      initials: "SP",
      due: 260
    },
    {
      name: "Aaron Ames",
      initials:"AA",
      due: 200
    },
    {
      name: "May Lee",
      initials: "ML",
      due: 199
    },
  ]


  // const displayUsers = useMemo(() => {
	// 	let newUsersList = [];
	// 			newUsersList = Object.values(usersList)
	// 				.map((list) => Object.values(list))
	// 				.flat();
		
  //   return newUsersList
  // });

  const handleChange = (e, i) => {
    return setIndex(i);
  };



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
                        <Snapshot snapName="Revenue" number="$200k" />
                      </Grid>
                      <Grid item md={3} className={classes.snapshotalt}>
                        <Snapshot
                          snapName="Outstanding Payments"
                          number="$877"
                        />
                      </Grid>
                      <Grid item md={3} className={classes.snapshotalt}>
                        <Snapshot snapName="Total Sessions" number="45" />
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
                          <ClassEnrollment />
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
                          {OPdata.map((op)=> (
                            <OutstandingPaymentCard op={op} name={op.name} due={op.due} initials={op.initials}/> 
                          ))}
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

const OutstandingPaymentCard = op => {

  const classes = useStyles();
  return(
    
    <Card className={classes.opCard}>
      <Grid container>
        <Grid item xs={3}>
          {/* <CardMedia> */}
            <Avatar
              className={classes.opAvatar}
              style={{
                backgroundColor: stringToColor(op.name)
              }}
            >{op.initials}
            </Avatar>
          {/* </CardMedia> */}
        </Grid>
        <Grid item xs={9} className={classes.opDetail}>
          <CardContent>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                {op.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption text">
                Amount Due: <span className={classes.amtdue}>${op.due}</span>
              </Typography>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

const Snapshot = (props) => {
  const classes = useStyles();
  return (
    <Paper elevation={0}>
      <Typography className={classes.snapName}>{props.snapName}</Typography>
      <br />
      <br />
      <Typography className={classes.number}>{props.number}</Typography>
    </Paper>
  );
};

const styles = (theme) => ({
  xAxis: {
    fontSize: ".4rem",
  },
  titleText: {
    transform: "rotate(270deg)",
    fontSize: "1rem",
    textAlign: "left",
    position: "relative",
    right: "15.1875em",
    top: "4em",
    fontStyle: "normal",
    color: "#747D88",
  },
  legendText: {
    transform: "rotate(270deg)",
    fontSize: "1rem",
    textAlign: "left",
    position: "relative",
    right: "15.1875em",
    top: "1aem",
    fontStyle: "normal",
    color: "#747D88",
  },
  popbars: {
    // fill: "pink",
    marginLeft: "40px",
    // borderTopLeftRadius: "50%"
  },
  classbars: {
    fill: "#43B5D9",
  },
  instructorbars: {
    fill: "#1F82A1",
  },
  revenuebars: {
    fill:"#1F82A1"
  }
});

const TextComponent = withStyles(styles)(({ classes, ...restProps }) => (
  <Title.Text {...restProps} className={classes.titleText} />
));

const Root = withStyles(styles)(({ classes, ...restProps }) => (
  <ArgumentAxis.Root {...restProps} className={classes.xAxis} />
));

const LabelComponent = withStyles(styles)(({ classes, ...restProps }) => (
  <ArgumentAxis.Label {...restProps} className={classes.xAxis} />
));

const TickComponent = withStyles(styles)(({ classes, ...restProps }) => (
  <ArgumentAxis.Tick {...restProps} className={classes.bar} />
));

const BarComponent = withStyles(styles)(({ classes, ...restProps }) => (
  <BarSeries.Point {...restProps} className={classes.popbars} />
));

// .reduce((acc, item, index) => {
//   // console.log(Object.keys(subjects))
//   console.log(item)
//   // console.log(index)
//     acc.push(
//       <BarSeries
//         key={index.toString()}
//         valueField={item.}
//         argumentField={item.class}
//         name={item.class}
//         barWidth={.5}
//       />,
//     );
//   console.log(acc)
//   return acc;
// }, []);

const PopularSubject = (props) => {
  const classes = useStyles();
  const data = [
    { class: "ALGEBRA", session: 48 },
    { class: "SAT ENG", session: 37 },
    { class: "AP CHEM", session: 33 },
    { class: "GEOMETRY", session: 31 },
    { class: "COLLEGE PREP", session: 26 },
  ];

  const [chartData, setChartData] = useState(data);

  // const subjects = chartData.reduce((current, subject) => {
  //   let currentObj = { [subject.class]: subject.session };
  //   return { ...current, ...currentObj}
  // }, []);

  // console.log(subjects)

  return (
    <Paper elevation={0} className={classes.chartPaper}>
      <Chart
        data={chartData}
        height={350}
        width={430}
        className={classes.barPosition}
      >
        <ArgumentAxis
          rootComponent={Root}
          labelComponent={LabelComponent}
          tickComponent={TickComponent}
        />
        <ValueAxis max={60} />

        <BarSeries
          valueField="session"
          argumentField="class"
          barWidth={0.5}
          pointComponent={BarComponent}
        />
        {/* <BarSeries
        argumentField="Algebra"
        barWidth={.5}
        maxBarWidth={18}
        pointComponent={BarComponent}
      /> */}
        <Animation />
        <Title text="NUMBER OF SESSIONS" textComponent={TextComponent} />
        <EventTracker />
        <Tooltip />
        {/* <Legend position="left" /> */}
      </Chart>
    </Paper>
  );
};

const ClassEnrollment = () => {
  const classes = useStyles();
  const data = [
    {class: "filled", val: 324},
    {class: "unfilled", val: 76}
  ]
  const [chartData, setChartData] = useState(data)
  // const PieComponent = withStyles(styles)(({ classes, ...restProps }) => (
  //   <PieSeries.Point {...restProps} className={classes.classbars} />
  // ));

  return(
    <Paper elevation={0} className={classes.chartPaper}>
        <Chart
          data={chartData}
          height={350}
          width={430}
          className={classes.piePosition}
        >
          <PieSeries
            valueField="val"
            argumentField="class"
            innerRadius={0.65}
            // pointComponent={PieComponent}
          />
          <Title
            text="324/400 Spaces Filled"
            position="bottom"
          />
               <EventTracker />
                  <Tooltip />
          <Animation />
        </Chart>
      </Paper>
  )
};

const InstructorUtilization = () => {
  const classes = useStyles();
  const data = [
    {instructor: "DANIEL H.", value: 2},
    {instructor: "KATIE H.", value: 5},
    {instructor: "JERRY L.", value: 4},
    {instructor: "GABY C.", value: 4},
    {instructor: "CALVIN F.", value: 4}
  ]
  const [chartData, setChartData] = useState(data);

  const BarComponent = withStyles(styles)(({ classes, ...restProps }) => (
    <BarSeries.Point {...restProps} className={classes.instructorbars} />
  ));
  
  return (
    <Paper elevation={0} className={classes.chartPaper}>
      <Chart
        data={chartData}
        height={350}
        width={430}
        // className={classes.barPosition}
        rotated
      >
        <ArgumentAxis
          // rootComponent={Root}
          // labelComponent={LabelComponent}
          // tickComponent={TickComponent}
        />
        {/* <ValueAxis /> */}

        <BarSeries
          valueField="value"
          argumentField="instructor"
          barWidth={0.3}
          pointComponent={BarComponent}
        />
             <EventTracker />
                <Tooltip />
      </Chart>
    </Paper>
  )
}

const RevenuebyQuarter = () => {
  const classes = useStyles();
  const data = [
    {quarter: "q1", value: 11},
    {quarter: "q2", value: 38},
    {quarter: "q3", value: 18},
    {quarter: "q4", value: 40}
  ];
  const [chartData, setChartData] = useState(data)

  const LineComponent = withStyles(styles)(({ classes, ...restProps }) => (
    <LineSeries.Path {...restProps} className={classes.revenuebars} />
  ));
  
  const TextComponent = withStyles(styles)(({ classes, ...restProps }) => (
    <Title.Text {...restProps} className={classes.legendText} />
  ));
  

  return (
    <Paper elevation={0} className={classes.chartPaper}>
    <Chart
      data={chartData}
      height={350}
      width={430}
      className={classes.piePosition}
    >
      <ArgumentAxis />
      <ValueAxis />
      <LineSeries 
        valueField="value"
        argumentField="quarter"
        color="#1F82A1"
        // seriesComponent={LineComponent}
      />
      <Title text="THOUSANDS($)" textComponent={TextComponent} />
      <EventTracker />
      <Tooltip />
      <Animation />
    </Chart>
  </Paper>
  )
}

export default AdminDashboard;

//   <Chart
//     id="chart"
//     palette="Soft"
//     dataSource={chartData}>
//     <CommonSeriesSettings
//       argumentField="class"
//       valueField="session"
//       type="bar"
//       ignoreEmptyPoints={true}
//       barPadding={.1}
//     />
//     <SeriesTemplate nameField="class" />
//   </Chart>
