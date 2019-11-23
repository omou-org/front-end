import PropTypes from "prop-types";
import React from "react";

// Material UI Imports
import {Link} from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ForwardArrow from "@material-ui/icons/ArrowForward";
import Grid from "@material-ui/core/Grid";

const trimString = (string, maxLen) =>
    string.length > maxLen
    ? `${string.slice(0, maxLen - 3).trim()}...`
    : string;


const TutoringList = ({filteredCourses}) => (
    <Grid
        alignItems="center"
        container
        direction="row"
        spacing={8}>
        {
            filteredCourses.map(({course_id, title}) => (
                <Grid
                    alignItems="center"
                    item
                    key={course_id}
                    md={4}
                    sm={6}
                    xs={12}>
                    <Card
                        className="tutoring-card"
                        component={Link}
                        to={`/registration/form/tutoring/${course_id}`}>
                        <Grid container>
                            <Grid
                                align="left"
                                component={CardContent}
                                item
                                xs={11}>
                                {trimString(title, 20)}
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

TutoringList.propTypes = {
    "filteredCourses": PropTypes.arrayOf(PropTypes.shape({
        "course_id": PropTypes
            .oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        "title": PropTypes.string.isRequired,
    })),
};

TutoringList.defaultProps = {
    "filteredCourses": [],
};

export default TutoringList;
