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
                        Bio
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
                                label={`${props.background.experience} years at Summit`}
                                variant="outlined" />
                        </Grid>
                    </Grid>
                    <Grid
                        className="rowPadding"
                        container>
                        <Grid className="bioDescription">
                            Subjects offered:
                        </Grid>
                        {props.background.subjects.map((subject) => (
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
                        {props.background.languages.map((language) => (
                            <Grid
                                className="chipPadding"
                                key={language}>
                                <Chip
                                    className="bioChip"
                                    label={language}
                                    variant="outlined" />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Grid>
        </Grid>
    </Card>
);

export default Bio;
