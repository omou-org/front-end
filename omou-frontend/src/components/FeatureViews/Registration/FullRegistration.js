import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import {Typography} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import ForwardIcon from "@material-ui/icons/ArrowForward";
import BackIcon from "@material-ui/icons/ArrowBack";

//Local Component Imports
import './registration.scss'


const rowHeadings = [
    {id:'Grade', number:false, disablePadding: false,},
    {id:'Course', numberic:false, disablePadding: false},
    {id:'Dates', numberic:false, disablePadding: false},
    {id:'Day(s)', numberic:false, disablePadding: false},
    {id:'Time', numberic:false, disablePadding: false},
    {id:'Tuition', numberic:false, disablePadding: false},
    {id:'Space Left', numberic:false, disablePadding: false},
    {id:'Register', numberic:false, disablePadding: false}
];

let TableToolbar = props =>{
    return (<TableHead>
        <TableRow>
            {rowHeadings.map(
                (row, i) => (
                    <Hidden key={i} mdDown={row.id === 'Grade' || row.id === "Tuition" || row.id === "Space Left"}>
                        <TableCell
                            align={row.numberic ? 'right':'left'}
                            padding={row.disablePadding ? 'none':'default'}
                        >
                            {row.id}
                        </TableCell>
                    </Hidden>
                )
            )}
        </TableRow>
    </TableHead>);
};

class FullRegistration extends Component {
    constructor(){
        super();
        this.state = {
            maxCategory: 3,
            minCategory: 0,
        };

    }

    forwardCategories(){
        // console.log(this.props.categories)
        this.setState((oldState)=>{
            if(oldState.maxCategory + 1 < this.props.categories.length){
                return {
                    maxCategory: oldState.maxCategory+1,
                    minCategory: oldState.minCategory+1
                }
            }
        });
    }

    backCategories(){

        this.setState((oldState)=>{
            if(oldState.minCategory - 1 > 0){
                return {
                    maxCategory: oldState.maxCategory-1,
                    minCategory: oldState.minCategory-1
                }
            }
        });
    }

    render(){
        console.log(this.props);
        return (
            <div className="">
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container className={"course-categories"} spacing={16}>
                            <BackIcon className={`control back ${this.state.minCategory !== 0 ? "visible" : ""}`}
                                      onClick={(e)=>{e.preventDefault(); this.backCategories.bind(this)()}}/>
                            {
                                this.props.categories.map((category,i)=>{
                                    if(this.state.minCategory <= i && i < this.state.maxCategory){
                                        return <Grid item xs={4} key={category.id}>
                                            <Card className={"category-card"}>
                                                <CardMedia
                                                    className={"media"}
                                                    image={"https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjBz-2K9ZviAhWiGDQIHdopCZYQjRx6BAgBEAU&url=https%3A%2F%2Fwww.losdschools.org%2Fdomain%2F1704&psig=AOvVaw0GpyRGZMw9QDj5zOLnmw85&ust=1557954002247055"}
                                                    title={"AP Test Logo"}/>
                                                <CardContent className={"text"}>
                                                    <Typography gutterBottom variant={"h6"} component={"h2"}>
                                                        {category.cat_title}
                                                    </Typography>
                                                    <Typography component="p">
                                                        Lizards are a widespread group of squamate reptiles, with over 6,000 species.
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button size={"small"} color={"secondary"}>
                                                        Explore
                                                    </Button>
                                                    <Button size={"small"} color={"secondary"}>
                                                        Learn More
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    }
                                })
                            }
                            <ForwardIcon className={`control forward ${this.state.maxCategory !== this.props.categories.length-1 ? "visible":""}`}
                                         onClick={(e)=>{e.preventDefault(); this.forwardCategories.bind(this)()}}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={"paper"}>
                            <Table>
                                <TableToolbar/>
                                <TableBody className={"table"}>
                                    {
                                        this.props.courses.map((course)=>{
                                            return <TableRow key={course.id} hover>
                                                <Hidden mdDown>
                                                    <TableCell align="right">{course.grade}</TableCell>
                                                </Hidden>
                                                <TableCell align="right">{course.course_title}</TableCell>
                                                <TableCell align="right">{course.dates}</TableCell>
                                                <TableCell align="right">{course.days}</TableCell>
                                                <TableCell align="right">{course.time}</TableCell>
                                                <Hidden mdDown>
                                                    <TableCell align="right">{course.tuition}</TableCell>
                                                </Hidden>
                                                <Hidden mdDown>
                                                    <TableCell align="right">{course.capacity - course.filled}</TableCell>
                                                </Hidden>
                                                <TableCell align="right">
                                                    <Button variant="contained" color="secondary" className={"button"}>REGISTER</Button>
                                                </TableCell>
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

FullRegistration.propTypes = {
    stuffActions: PropTypes.object,
    FullRegistrationForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        // courses: state.FullRegistration["course_list"]
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
)(FullRegistration);