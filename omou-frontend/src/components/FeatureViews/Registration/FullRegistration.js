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
import ExpandIcon from "@material-ui/icons/ExpandMore";
import ShrinkIcon from "@material-ui/icons/ExpandLess";

//Local Component Imports
import './registration.scss'
import Grow from "@material-ui/core/Grow";
import {NavLink} from "react-router-dom";


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
            maxCategory: 2,
            minCategory: 0,
            coursePopup: false,
        };
    }

    forwardCategories(){
        this.setState((oldState)=>{
            console.log(oldState.minCategory, oldState.maxCategory);
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
            console.log(oldState.minCategory, oldState.maxCategory);
            if(oldState.minCategory - 1 >= 0){
                return {
                    maxCategory: oldState.maxCategory-1,
                    minCategory: oldState.minCategory-1
                }
            }
        });
    }

    expandCategories(){
        console.log( this.state.expandCategory);
        let newMaxCategory = 0;
        let newMinCategory = 0;
        if(this.state.maxCategory === this.props.courses.length-1){
            newMaxCategory = 2;
            newMinCategory = 0;
        } else {
            newMaxCategory = this.props.courses.length - 1;
            newMinCategory = 0;
        }
        this.setState( (old)=>{
            return {
                maxCategory: newMaxCategory,
                minCategory: newMinCategory,
                expandCategory: !old.expandCategory
            }
        });
    }

    render(){

        return (
            <div className="">
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container className={"course-categories"} spacing={16}>
                            <div className={this.state.minCategory !== 0 ? "visible" : ""}>
                            <BackIcon className={`control back `}
                                      onClick={(e)=>{e.preventDefault(); this.backCategories.bind(this)()}}/>
                            </div>
                            {
                                this.props.categories.map((category,i)=>{
                                    if(this.state.minCategory <= i && i <= this.state.maxCategory){
                                        return <Grow in={this.state.minCategory <= i && i <= this.state.maxCategory} key={category.id}>
                                            <Grid item xs={4} >
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
                                        </Grow>
                                    }
                                    return '';
                                })
                            }
                            <div className={this.state.maxCategory !==this.props.courses.length-1 ? "visible" : ""}>
                                <ForwardIcon className={`control forward`}
                                         onClick={(e)=>{e.preventDefault(); this.forwardCategories.bind(this)()}}/>
                            </div>
                            <div className={this.state.expandCategory ? "" : "visible"}>
                                <ExpandIcon className={`control expand`}
                                        onClick={(e)=>{e.preventDefault(); this.expandCategories.bind(this)()}}/>
                            </div>
                            <div className={this.state.expandCategory ? "visible" : ""}>
                                <ShrinkIcon className={`control shrink`}
                                        onClick={(e)=>{e.preventDefault(); this.expandCategories.bind(this)()}}/>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={"paper"}>
                            <Grow in={true}>
                                <Table>
                                    <TableToolbar/>
                                    <TableBody className={"table"}>
                                        {
                                            this.props.courses.map((course,i)=>{
                                                return <TableRow key={i}
                                                                 hover>
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
                                                        <Button component={NavLink} to={'/registration/form/'+ course.course_title.split(" ").join("-")}
                                                            variant="contained"
                                                            color="primary"
                                                            className={"button"}>REGISTER</Button>
                                                    </TableCell>
                                                </TableRow>
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </Grow>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default FullRegistration;