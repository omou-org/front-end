import {connect} from "react-redux";
import React, {Component} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import BackButton from "../../BackButton";
import RegistrationActions from "./RegistrationActions";

class CourseCategory extends Component {
    componentWillMount() {
        const CategoryInView = this.props.courseCategories.find((category) => category.id.toString() === this.props.computedMatch.params.categoryID);
        this.setState({...CategoryInView});
    }

    render() {
        return (
            <Grid
                item
                xs={12}>
                <Paper elevation={2} className="paper">
                    <Grid
                        item
                        lg={12}>
                        <RegistrationActions />
                    </Grid>
                </Paper>
                <Paper elevation={2} className="paper content">
                    <BackButton />
                    <Typography
                        align="left"
                        style={{"fontWeight": 500}}
                        variant="h4">
                        {this.state.cat_title}
                    </Typography>
                </Paper>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        "courseCategories": state.Course.CourseCategories,
    };
}


export default connect(mapStateToProps)(CourseCategory);
