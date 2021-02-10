import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
// import LabelBadge from "./LabelBadge";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    style: {
        textAlign: 'left',
        paddingLeft: '100px',
        paddingBottom: '100px',
    },
    headingOneStyle: {
        textAlign: 'left',
        paddingTop: '100px',
    },
}));

const TypographyDemo = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.style}>
            <Typography className={classes.headingOneStyle} variant='h1'>
                Heading 1
            </Typography>
            <p>
                <Typography variant='h2'>Heading 2</Typography>
            </p>
            <p>
                <Typography variant='h3'>Heading 3</Typography>
            </p>
            <p>
                <Typography variant='h4'>Heading 4</Typography>
            </p>
            <p>
                <Typography variant='h5'>heading 5</Typography>
            </p>
            <p>
                <Typography variant='body1'>Body(Default)</Typography>
            </p>
            <p>
                <Typography variant='body2'>Body (Bolded)</Typography>
            </p>
            <p>
                <a href='#'>Body (Links) w/ an a tag</a>
            </p>
            <p>
                <Link href='#'>Body (Links) w/ the link component</Link>
            </p>
        </Paper>
    );
};

export default TypographyDemo;
