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
                This is h1:
            <Typography variant="h1">
                Hello OMOU!
            </Typography>
            </p>
            This is h2:
            <p>
            <Typography variant="h2">
                How's it going?
            </Typography>
            </p>
            This is h3:
            <p>
            <Typography variant="h3">
                It's been a crazy time.
            </Typography>
            </p>
            This is h4:
            <p>
            <Typography variant="h4">
               But look at what you've accomplished!
            </Typography>
            </p>
            This is h5:
            <p>
            <Typography variant="h5">
                you are doing great
            </Typography>
            </p>
            This is body1:
            <p>
            <Typography variant="body1">
                Look at this paragraph! Such a normal paragraph.
            </Typography>
            </p>
            This is body2:
            <p>
            <Typography variant="body2">
                Look at this paragraph! Such a bolded paragraph!
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