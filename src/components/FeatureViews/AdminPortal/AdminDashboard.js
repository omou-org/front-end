import React, { useState, useEffect } from "react";
import Recharts from "recharts";
import { makeStyles } from "@material-ui/core/styles";
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
                  <Typography className={classes.tabName} classes>
                    QUICK SNAPSHOT
                  </Typography>
                  <Grid container>
                    <Grid item md={2} className={classes.snapshot}>
                      <Snapshot snapName="Revenue" number="$200k" />
                    </Grid>
                    <Grid item md={2} className={classes.snapshot}>
                    <Snapshot snapName="Outstanding Payments" number="$877" />
                    </Grid>
                    <Grid item md={2} className={classes.snapshot}>
                    <Snapshot snapName="Total Sessions" number="45" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs>
                  Outstanding Payments
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
      <Typography className={classes.number}>
        {props.number}
      </Typography>
    </Paper>
  );
};

export default AdminDashboard;
