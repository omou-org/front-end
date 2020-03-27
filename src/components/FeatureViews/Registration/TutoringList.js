import React from "react";
import {useSelector} from "react-redux";
import * as hooks from "actions/hooks.js";
// Material UI Imports
import {Link} from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ForwardArrow from "@material-ui/icons/ArrowForward";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError" 

const trimString = (string, maxLen) =>
    string.length > maxLen
        ? `${string.slice(0, maxLen - 3).trim()}...`
        : string;


const TutoringList = () => {
    const categories = useSelector(({Course}) => Course.CourseCategories);
    const categoryStatus = hooks.useCategory();
    const registeringParent = useSelector(({ Registration }) => Registration.CurrentParent);

    if (hooks.isLoading(categoryStatus)) {
        return <Loading />;
    }

    if (hooks.isFail(categoryStatus)) {
        return <LoadingError error="subjects"/>;
    }

    if(!registeringParent || registeringParent === "none"){
        return <Grid
            item
            xs={12}>
            <Grow in>
                <Paper className="info">
                    <Typography style={{"fontWeight": 700}}>
                        Please set the parent who's registering!
                    </Typography>
                </Paper>
            </Grow>
        </Grid>
    }

    return (
        <Grid
            alignItems="center"
            container
            direction="row"
            spacing={8}>
            {
                categories.map(({id, name}) => (
                    <Grid
                        alignItems="center"
                        item
                        key={id}
                        md={4}
                        sm={6}
                        xs={12}>
                        <Card
                            className="tutoring-card"
                            component={Link}
                            to={`/registration/form/tutoring/${id}`}>
                            <Grid container>
                                <Grid
                                    align="left"
                                    component={CardContent}
                                    item
                                    xs={11}>
                                    {trimString(name, 20)}
                                </Grid>
                                <Grid
                                    align="center"
                                    component={ForwardArrow}
                                    item
                                    style={{
                                        "display": "inline",
                                        "margin": "auto 0",
                                    }}
                                    xs={1} />
                            </Grid>
                        </Card>
                    </Grid>
                ))
            }
        </Grid>
    );
};

TutoringList.propTypes = {};

export default TutoringList;
