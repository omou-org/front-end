import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import {NavLink} from "react-router-dom";
import BackArrow from "@material-ui/icons/ArrowBack";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {Typography} from "@material-ui/core";
import BackButton from "../../BackButton";
import RegistrationActions from "./RegistrationActions";
const rowHeadings = [
    {id:'Student', numberic:false, disablePadding: false},
    {id:'Parent', numberic:false, disablePadding: false},
    {id:'Status', numberic:false, disablePadding: false},
    {id:'', numberic:false, disablePadding: false},
];

class CourseCategory extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    componentWillMount(){
        let CategoryInView = this.props.courseCategories.find((category)=>{
            return category.id.toString() === this.props.match.params.categoryID;
        });
        console.log(CategoryInView);
        this.setState({...CategoryInView});
    }

    render(){
        return (
            <Grid item xs={12}>
                <Paper className={"paper"}>
                    <Grid item lg={12}>
                            <RegistrationActions
                            //admin={false}
                            />
                    </Grid>
                </Paper>
                <Paper className={"paper content"}>
                    <BackButton />
                    <Typography style={{fontWeight:500}} variant={'h4'} align={'left'}>
                        {this.state.cat_title}
                    </Typography>
                </Paper>
            </Grid>
        )
    }
}

CourseCategory.propTypes = {
    stuffActions: PropTypes.object,
    RegistrationForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        courses: state.Course["CourseList"],
        courseCategories: state.Course["CourseCategories"],
        students: state.Users["StudentList"],
        teachers: state.Users["TeacherList"],
        parents: state.Users["ParentList"],
        courseRoster: state.Course["CourseRoster"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseCategory);