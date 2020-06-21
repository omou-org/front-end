import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Chart,
  BarSeries,
  PieSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { EventTracker } from "@devexpress/dx-react-chart";
import { Animation, LineSeries } from "@devexpress/dx-react-chart";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  chartPaper: {
    height: "px",
    width: "36.25em",
    marginLeft: "1.675em",
    marginTop: "3.7875em",
  },
  piePosition: {
    marginLeft: "2.75em",
  },
  barPosition: {
    marginLeft: "3em",
  },
}));

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
    marginLeft: "40px",
  },
  classbars: {
    fill: "#43B5D9",
  },
  instructorbars: {
    fill: "#1F82A1",
  },
  revenuebars: {
    fill: "#1F82A1",
  },
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

export const RevenuebyQuarter = props => {
  const classes = useStyles();
  const data = [
    { quarter: "q1", value: 11 },
    { quarter: "q2", value: 38 },
    { quarter: "q3", value: 18 },
    { quarter: "q4", value: 40 },
  ];
  const [chartData, setChartData] = useState(data);

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
        />
        <Title text="THOUSANDS($)" textComponent={TextComponent} />
        <EventTracker />
        <Tooltip />
        <Animation />
      </Chart>
    </Paper>
  );
};

export const InstructorUtilization = props => {
  const classes = useStyles();
  const data = [
    { instructor: "DANIEL H.", value: 2 },
    { instructor: "KATIE H.", value: 5 },
    { instructor: "JERRY L.", value: 4 },
    { instructor: "GABY C.", value: 4 },
    { instructor: "CALVIN F.", value: 4 },
  ];
  const [chartData, setChartData] = useState(data);

  const BarComponent = withStyles(styles)(({ classes, ...restProps }) => (
    <BarSeries.Point {...restProps} className={classes.instructorbars} />
  ));

  return (
    <Paper elevation={0} className={classes.chartPaper}>
      <Chart data={chartData} height={350} width={430} rotated>
        <ArgumentAxis />

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
  );
};

export const ClassEnrollment = props => {
  const classes = useStyles();
  const data = [
    { class: "filled", val: 324 },
    { class: "unfilled", val: 76 },
  ];
  const [chartData, setChartData] = useState(data);

  return (
    <Paper elevation={0} className={classes.chartPaper}>
      <Chart
        data={chartData}
        height={350}
        width={430}
        className={classes.piePosition}
      >
        <PieSeries valueField="val" argumentField="class" innerRadius={0.65} />
        <Title text="324/400 Spaces Filled" position="bottom" />
        <EventTracker />
        <Tooltip />
        <Animation />
      </Chart>
    </Paper>
  );
};

export const PopularSubject = props => {
  const classes = useStyles();
  const data = [
    { class: "ALGEBRA", session: 48 },
    { class: "SAT ENG", session: 37 },
    { class: "AP CHEM", session: 33 },
    { class: "GEOMETRY", session: 31 },
    { class: "COLLEGE PREP", session: 26 },
  ];

  const [chartData, setChartData] = useState(data);

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
        <Animation />
        <Title text="NUMBER OF SESSIONS" textComponent={TextComponent} />
        <EventTracker />
        <Tooltip />
      </Chart>
    </Paper>
  );
};
