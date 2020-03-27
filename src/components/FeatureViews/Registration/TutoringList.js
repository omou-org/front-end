import React from "react";
import {useSelector} from "react-redux";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ForwardArrow from "@material-ui/icons/ArrowForward";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import {Link} from "react-router-dom";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import {isFail, isLoading, useCategory} from "actions/hooks.js";
import {truncateStrings} from "utils";

const TutoringList = () => {
    const categories = useSelector(({Course}) => Course.CourseCategories);
    const categoryStatus = useCategory();
    const registeringParent =
        useSelector(({Registration}) => Registration.CurrentParent);

    if (!categories) {
        if (isLoading(categoryStatus)) {
            return <Loading />;
        } else if (isFail(categoryStatus)) {
            return "Error loading subjects!";
        }
    }

    if (!registeringParent) {
        return (
            <Grid item xs={12}>
                <Grow in>
                    <Paper className="info">
                        <Typography style={{"fontWeight": 700}}>
                            Please set the parent who's registering!
                        </Typography>
                    </Paper>
                </Grow>
            </Grid>
        );
    }

    return (
        <Grid alignItems="center" container direction="row" spacing={8}>
            {categories.map(({id, name}) => (
                <Grid alignItems="center" item key={id} md={4} sm={6} xs={12}>
                    <Card className="tutoring-card" component={Link}
                        to={`/registration/form/tutoring/${id}`}>
                        <Grid container>
                            <Grid align="left" component={CardContent} item
                                xs={11}>
                                {truncateStrings(name, 20)}
                            </Grid>
                            <Grid align="center" component={ForwardArrow} item
                                style={{
                                    "display": "inline",
                                    "margin": "auto 0",
                                }} xs={1} />
                        </Grid>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

TutoringList.propTypes = {};

export default TutoringList;
