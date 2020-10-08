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
                        <LabelBadge label="Instructor" type="user-outline"/>
                    </Grid>
                    <Grid item >
                        <LabelBadge label="Parent" type="user-outline"/>
                    </Grid>
                    <Grid item >
                        <LabelBadge label="Receptionist" type="user-outline"/>
                    </Grid>
                    <Grid item >
                        <LabelBadge label="Admin" type="user-outline"/>
                    </Grid>
                    <Grid item >
                        <LabelBadge label="Student" type="user-outline"/>
                    </Grid>
                </Grid>

                <Grid container xs={12} className={classes.column}>
                    <Grid container item xs={6}>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">User Information Contained Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge label="Chemistry" type="info"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="SAT Preparation" type="info"/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs={6}>
                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">User Information Outline Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge label="English" type="info-outline"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Mandarin" type="info-outline"/>
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
                                <LabelBadge label="Present" type="status-positive"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Tardy" type="status-warning"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Absent" type="status-negative"/>
                            </Grid>
                        </Grid>

                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">Medium Length Status Badge</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge label="Medium Length" type="status-positive"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Medium Length" type="status-warning"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="Medium Length" type="status-negative"/>
                            </Grid>
                        </Grid>

                        <Grid container item justify="center" className={classes.row}>
                            <Typography variant="h4">Round Status Badge (Can Contain Numbers)</Typography>
                        </Grid>

                        <Grid container item spacing={3} justify="center" className={classes.row}>
                            <Grid item>
                                <LabelBadge label="1" type="round-positive"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="20" type="round-warning"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="300" type="round-negative"/>
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
                                <LabelBadge label="ACTIVE" type="status-active"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="PAST" type="status-past"/>
                            </Grid>
                            <Grid item>
                                <LabelBadge label="NEW" type="status-new"/>
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