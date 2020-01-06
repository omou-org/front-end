import React from "react";

import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const Bio = (props) => (
    <Card className="Bio">
        <Grid
            container
            item
            xs={12}>
            <Grid
                item
                md={6}
                xs={12}>
                <div className="Bio1">
                    <Typography className="bioHeader">
                        Biography
                    </Typography>
                    <Typography className="bioBody">
                        {props.background.bio}
                    </Typography>
                </div>
            </Grid>
            <Grid
                item
                md={6}
                xs={12}>
                <div className="BioBackground Bio2">
                    <Grid
                        className="rowPadding"
                        container>
                        <Grid className="bioDescription">
                            Experience:
                        </Grid>
                        <Grid className="chipPadding">
                            <Chip
                                className="bioChip"
                                label={`${props.background.experience}`}
                                variant="outlined" />
                        </Grid>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        container>
                        <Grid className="bioDescription">
                            Subjects offered:
                        </Grid>
                        {props.background.subjects && props.background.subjects.split(",").map((subject) => (
                            <Grid
                                className="chipPadding"
                                key={subject}>
                                <Chip
                                    className="bioChip"
                                    label={subject}
                                    variant="outlined" />
                            </Grid>
                        ))}
                    </Grid>
                    <Grid
                        className="rowPadding"
                        container>
                        <Grid className="bioDescription">
                            Language:
                        </Grid>
                        <Grid
                            className="chipPadding"
                            key={props.background.languages}>
                            <Chip
                                className="bioChip"
                                label={props.background.languages}
                                variant="outlined" />
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </Grid>
    </Card>
);

export default Bio;
