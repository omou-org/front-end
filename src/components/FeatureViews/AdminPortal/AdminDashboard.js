import React, { useState, useEffect } from "react";
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ChromeTabs from "./ChromeTabs";
import TabPanel from "./TabPanel";
import "./AdminPortal.scss";

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
    // height: "260px",
    width: "332px",
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
  legendBar: {
    marginLeft: "1.25em"
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
              <Grid item xs={12}>
                <TabPanel index={0} value={index}>
                  <Grid item xs>
                    <Typography className={classes.tabName}>
                      QUICK SNAPSHOT
                    </Typography>
                    <Grid container>
                      <Grid item md={2} className={classes.snapshot}>
                        <Snapshot snapName="Revenue" number="$200k" />
                      </Grid>
                      <Grid item md={2} className={classes.snapshot}>
                        <Snapshot
                          snapName="Outstanding Payments"
                          number="$877"
                        />
                      </Grid>
                      <Grid item md={2} className={classes.snapshot}>
                        <Snapshot snapName="Total Sessions" number="45" />
                      </Grid>
                      <Grid item xs>
                        Outstanding Payments
                      </Grid>
                      <Grid container direction="column">
                        <Grid item md={2}>
                          <Typography className={classes.popSub}>
                            POPULAR SUBJECT
                          </Typography>
                          <PopularSubject />
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

const styles = theme => ({
  xAxis: {
    fontSize: ".4rem",
    
  },
  titleText: {
    transform: "rotate(270deg)",
    fontSize: ".5rem",
    textAlign: "left",
    position: "relative",
    right: "20.1875em",
    top: "1em"
  },
  bars: {
    backgroundColor: "pink"
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


const PopularSubject = (props) => {
  const classes = useStyles();
  const data = [
    { class: 'ALGEBRA', session: 48 },
    { class: 'SAT ENG', session: 37 },
    { class: 'AP CHEM', session: 33 },
    { class: 'GEOMETRY', session: 31 },
    { class: 'COLLEGE PREP', session: 26 },
  ];
  const [chartData, setChartData] = useState(data);
  

  
  return (
    <Paper elevation={0} className={classes.chartPaper}>
        <Chart
          data={chartData}
          height={213}
          width={294}
          className={classes.legendBar}
          >
          <ArgumentAxis rootComponent={Root} labelComponent={LabelComponent} tickComponent={TickComponent}/>
          <ValueAxis max={60} />

          <BarSeries
            name="NUMBER OF SESSIONS"
            valueField="session"
            argumentField="class"
            barWidth={.5}
            maxBarWidth={18}
          />
          <Animation />
          <Title text="NUMBER OF SESSIONS" textComponent={TextComponent}/>
          {/* <Legend position="left" /> */}
        </Chart>
    </Paper>
  );
};

export default AdminDashboard;
