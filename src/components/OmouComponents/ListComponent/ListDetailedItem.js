import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

export const useStyles = makeStyles({
    root: {
        borderTop: '1px solid #C4C4C4',
        padding: '24px',
        height: '120px',
    },
    heading: {
        paddingBottom: '15px',
    },
    badge: {
        paddingRight: '24px',
        paddingTop: '4px',
    },
    link: {
        lineHeight: '14px',
    },
    status: {
        paddingBottom: '15px',
    },
    pointer: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
});

export const ListContent = ({ children }) => {
    const classes = useStyles();
    return (
        <Grid item>
            <Grid
                container
                justify='space-between'
                direction='column'
                className={classes.content}
            >
                {children}
            </Grid>
        </Grid>
    );
};

export const ListActions = ({ children }) => {
    return (
        <Grid item>
            <Grid container direction='column' justify='space-around'>
                {children}
            </Grid>
        </Grid>
    );
};

export const ListHeading = ({ children }) => {
    const classes = useStyles();
    return (
        <Grid item>
            <Grid container className={classes.heading}>
                {children}
            </Grid>
        </Grid>
    );
};

export const ListTitle = ({ children }) => {
    const classes = useStyles();
    return (
        <Grid item className={classes.pointer}>
            <Typography variant='h3'>{children}</Typography>
        </Grid>
    );
};

export const ListDetails = ({ children }) => {
    return (
        <Grid item>
            <Grid container spacing={3} justify='space-between'>
                {children}
            </Grid>
        </Grid>
    );
};

export const ListDetail = ({ children }) => {
    return (
        <Grid item spacing={3}>
            <Typography variant='body1'>{children}</Typography>
        </Grid>
    );
};

export const ListDetailLink = ({ children }) => {
    return (
        <Link underline='always' variant='body1'>
            <Grid item spacing={3} lineHeight={0}>
                {children}
            </Grid>
        </Link>
    );
};

export const ListButton = ({ children }) => {
    return <Grid item>{children}</Grid>;
};

export const ListBadge = ({ children }) => {
    const classes = useStyles();
    return (
        <Grid item className={classes.badge}>
            {children}
        </Grid>
    );
};

export const ListStatus = ({ children }) => {
    const classes = useStyles();
    return (
        <Grid item className={classes.status}>
            <Typography variant='h4'>{children}</Typography>
        </Grid>
    );
};

export const ListDivider = () => {
    return (
        <Grid item>
            <Divider
                orientation='vertical'
                style={{
                    height: '1em',
                    marginRight: '1rem',
                    marginLeft: '1rem',
                }}
            />
        </Grid>
    );
};

const ListDetailedItem = ({ children }) => {
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Grid container justify='space-between'>
                {children}
            </Grid>
        </Box>
    );
};

export default ListDetailedItem;
