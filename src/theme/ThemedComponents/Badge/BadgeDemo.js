import { Grid, makeStyles, Typography, Container } from "@material-ui/core";
import BackgroundPaper from "components/OmouComponents/BackgroundPaper";
import React from "react";
import {LabelBadge} from "./LabelBadge";

const useStyles = makeStyles(() => ({
    row: {
        margin: "-2px"
    },
    column: {
        borderBottom: "solid 1px"
    }
}))

const BadgeDemo = () => {
    const classes = useStyles();

    return (
        <Container fullWidth="sm">
        <BackgroundPaper>
            <Grid container direction="column" spacing={1} item xs={12}>
                <Grid container item xs={12} spacing={3} justify="center" className={classes.row}>
                    <Typography variant="h3">Label Badges</Typography>
                </Grid>
                <Grid container item xs={12} spacing={3} justify="center" className={classes.row}>
                    <Typography variant="h4">User Type Label Badge</Typography>
                </Grid>
                
                <Grid container xs={12} spacing={3} justify="center" className={classes.row}>
                    <Grid item >
                        <LabelBadge variant="outline-gray">Instructor</LabelBadge>
                    </Grid>
                    <Grid item >
                        <LabelBadge variant="outline-gray">Parent</LabelBadge>
                    </Grid>
                    <Grid item >
                        <LabelBadge variant="outline-gray">Receptionist</LabelBadge>
                    </Grid>
                    <Grid item >
                        <LabelBadge variant="outline-gray">Admin</LabelBadge>
                    </Grid>
                    <Grid item >
                        <LabelBadge variant="outline-gray">Student</LabelBadge>
                    </Grid>
                </Grid>

                <Grid container xs={12} className={classes.column}>
                    <Grid container item xs={6}>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">User Information Contained Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge>Chemistry</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge>SAT Preparation</LabelBadge>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs={6}>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">User Information Outline Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge variant="outline">English</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="outline">Mandarin</LabelBadge>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container xs={12}>
                    <Grid container direction="column" spacing={2} xs={6}>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h3">Status Badges (Tables)</Typography>
                        </Grid>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">Standard Length Status Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge variant="status-positive">Present</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="status-warning">Tardy</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="status-negative">Absent</LabelBadge>
                            </Grid>
                        </Grid>

                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">Medium Length Status Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge variant="status-positive">Medium Length</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="status-warning">Medium Length</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="status-negative">Medium Length</LabelBadge>
                            </Grid>
                        </Grid>

                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">Round Status Badge (Can Contain Numbers)</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge variant="round-positive">1</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="round-warning">20</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="round-negative">50</LabelBadge>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container direction="column" spacing={2} xs={6}>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h3">Status Badges (Lists)</Typography>
                        </Grid>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">Standard Length Status Badge</Typography>
                        </Grid>

                        <Grid container item spacing={1} justify="center" className={classes.row}>
                        <Grid item>
                                <LabelBadge variant="status-active">ACTIVE</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="status-past">PAST</LabelBadge>
                            </Grid>
                            <Grid item>
                                <LabelBadge variant="status-new">NEW</LabelBadge>
                            </Grid>
                        </Grid>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">List count badge</Typography>
                        </Grid>
                        <Grid container item spacing={1} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge variant="round-count">1</LabelBadge>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
        </Grid>
        </BackgroundPaper>
        </Container>

    )
}

export default BadgeDemo;