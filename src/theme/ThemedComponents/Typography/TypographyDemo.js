import { Grid } from "@material-ui/core";
import React from "react";
import Typography from "@material-ui/core/Typography";
// import LabelBadge from "./LabelBadge";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    'p': {
      textAlign: 'right',
      color: 'pink'
    },
    
  }));


const TypographyDemo = () => {

    return (
        <Paper>
            <p>
            <Typography variant="h1">
                Heading 1
            </Typography>
            </p>
            <p>
            <Typography variant="h2">
                Heading 2
            </Typography>
            </p>
            <p>
            <Typography variant="h3">
                Heading 3
            </Typography>
            </p>
            <p>
            <Typography variant="h4">
               Heading 4
            </Typography>
            </p>
            <p>
            <Typography variant="h5">
                heading 5
            </Typography>
            </p>
            <p>
            <Typography variant="body1">
                Body(Default)
            </Typography>
            </p>
            <p>
            <Typography variant="body2">
                Body (Bolded)
            </Typography>
            </p>
            This is an a variant:
            <p>
            <Typography variant="a">
                It's a link?
            </Typography>
            </p>
            This is an a tag:
            <p>
            <a href="www.google.com">What's happening here</a>
            </p>
        </Paper>
    )
}

export default TypographyDemo;