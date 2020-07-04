import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import BackButton from "../../OmouComponents/BackButton";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
      },
}));
const CourseClasses = () => {

const id = useParams();

const GET_CLASSES = gql`
query getClass ($id: ID!){
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
          }
          primaryParent {
            user {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;

const { data, loading, error } = useQuery(GET_CLASSES, {variables: id});

if (loading) return <Loading />;
if (error) return console.error(error.message);

console.log(data);

const { title } = data.course

  return (
    <Grid item xs={12}>
      <BackgroundPaper elevation={2}>
        <BackButton />
        <Hidden xsDown>
          <hr />
        </Hidden>
        <Typography align="left" className="heading" variant="h3" style={{marginTop: ".65em"}}>
          {title}
        </Typography>
      </BackgroundPaper>
    </Grid>
  );
};

export default CourseClasses;
