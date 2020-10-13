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
                        <LabelBadge label="Instructor" variant="outline-gray"/>
                    </Grid>
                    <Grid item >
                        <LabelBadge label="Parent" variant="outline-gray"/>
                    </Grid>
                    <Grid item >
                        <LabelBadge label="Receptionist" variant="outline-gray"/>
                    </Grid>
                    <Grid item >
                        <LabelBadge label="Admin" variant="outline-gray"/>
                    </Grid>
                    <Grid item >
                        <LabelBadge label="Student" variant="outline-gray"/>
                    </Grid>
                </Grid>

                <Grid container xs={12} className={classes.column}>
                    <Grid container item xs={6}>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">User Information Contained Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge label="Chemistry"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="SAT Preparation"/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs={6}>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">User Information Outline Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge label="English" variant="outline"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Mandarin" variant="outline"/>
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
                                <LabelBadge label="Present" variant="status-positive"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Tardy" variant="status-warning"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Absent" variant="status-negative"/>
                            </Grid>
                        </Grid>

                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">Medium Length Status Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge label="Medium Length" variant="status-positive"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Medium Length" variant="status-warning"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Medium Length" variant="status-negative"/>
                            </Grid>
                        </Grid>

                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">Round Status Badge (Can Contain Numbers)</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge label="1" variant="round-positive"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="20" variant="round-warning"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="300" variant="round-negative"/>
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
                                <LabelBadge label="ACTIVE" variant="status-active"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="PAST" variant="status-past"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="NEW" variant="status-new"/>
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