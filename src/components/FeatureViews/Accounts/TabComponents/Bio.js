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
                        {
                            props.background.experience &&
                            props.background.experience.split(",").map(experience => (
                                <Grid
                                    key={experience}
                                    className="chipPadding">
                                    <Chip
                                        className="bioChip"
                                        label={experience}
                                        variant="outlined" />
                                </Grid>
                            ))
                        }

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
                        {
                            props.background.languages &&
                            props.background.languages.split(",").map((language) => (
                                <Grid
                                    className="chipPadding"
                                    key={language}>
                                    <Chip
                                        className="bioChip"
                                        label={language}
                                        variant="outlined" />
                                </Grid>
                            ))
                        }

                    </Grid>
                </div>
            </Grid>
        </Grid>
    </Card>
);

export default Bio;
