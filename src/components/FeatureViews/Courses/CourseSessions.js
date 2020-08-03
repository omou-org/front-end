import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import Button from "@material-ui/core/Button";
import { BootstrapInput } from "./CourseManagement";
import CourseListOptions from "./CourseListOptions";
import moment from "moment";
import { highlightColor } from "../../../theme/muiTheme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minWidth: 1460,
    backgroundColor: theme.palette.background.paper,
  },
  listItems: {
    paddingTop: "3em",
    paddingBottom: "1em",
  },
  margin: {
    float: "left",
    marginTop: "2em",
    marginBottom: "2em"
  },
  menuSelected: {
    "&:hover": { backgroundColor: highlightColor, color: "#28ABD5" },
    "&:focus": { backgroundColor: highlightColor },
  },
  menuSelect: {
    backgroundColor: `${highlightColor} !important`,
  },
  dropdown: {
    border: "1px solid #43B5D9",
    borderRadius: "5px",
  },
}));

const CourseSessions = ({ sessionList, loggedInUser }) => {
  // console.log(loggedInUser)
  const classes = useStyles();
  const [sortBySession, setSortBySession] = useState("");

  // console.log(sessionList);

  const handleChange = (e) => {
    setSortBySession(e.target.value);
  };




  
  // console.log(sortBySession);
  return (
    <>
      <Grid container justify="flex-start">
        <Grid item xs={12}>
          <FormControl className={classes.margin}>
            <Select
              labelId="session-sort-tab"
              id="session-sort-tab"
              displayEmpty
              value={sortBySession}
              onChange={handleChange}
              classes={{ select: classes.menuSelected }}
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
              {sortBySession === "" && (
                <MenuItem
                  ListItemClasses={{ selected: classes.menuSelect }}
                  value=""
                >
                  Select Session...
                </MenuItem>
              )}
              {sessionList.map(({ startDatetime, id }, index) => {
                const startingDate = moment(startDatetime).calendar();
                return (
                  <MenuItem
                    key={index}
                    className={classes.menuSelected}
                    value={id}
                    ListItemClasses={{ selected: classes.menuSelect }}
                  >
                    {`Session ${index + 1} (${startingDate})`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        {sortBySession === "" ? null : <CourseListOptions sessionId={sortBySession} loggedInUser={loggedInUser}/> }
      </Grid>
    </>
  );
};

export default CourseSessions;
