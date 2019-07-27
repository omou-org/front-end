import React, {Component} from 'react';
import Card from "@material-ui/core/Card";
import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grow from "@material-ui/core/Grow";
import {withRouter} from 'react-router'

import '../../../theme/theme.scss';

const CategoryView = (cats) => {
    return cats.map((cat,i)=>{
        return <Grow in={true} key={i}>
            <Grid item xs={12}>
                <Card className={"category-card"}>
                    <CardMedia
                        className={"media"}
                        image={"https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjBz-2K9ZviAhWiGDQIHdopCZYQjRx6BAgBEAU&url=https%3A%2F%2Fwww.losdschools.org%2Fdomain%2F1704&psig=AOvVaw0GpyRGZMw9QDj5zOLnmw85&ust=1557954002247055"}
                        title={"AP Test Logo"}/>
                    <CardContent className={"text"}>
                        <Typography gutterBottom variant={"h6"} component={"h2"}>
                            {cat.cat_title}
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
    })
};

class MobileRegistration extends Component {

    goToRoute(route){
        this.props.history.push(route);
    }

    getInstructorByID = ( id ) =>{
        // console.log(id, this.props.teachers);
        return this.props.teachers.find((teacher)=>{
            return teacher.id === id;
        })['name'];
    };

    CoursesView = (courses) => {
        return courses.map((course,i)=>{
            return <Grow in={true} key={i}>
                <Grid item xs={12}>
                    <Card className={"category-card"}>
                        <CardContent className={"text"}>
                            <Typography gutterBottom variant={"h4"} component={"h2"} style={{fontWeight:'500'}}>
                                {course.course_title}
                            </Typography>
                            <Typography variant={"h6"} component={"h3"} >
                                {this.getInstructorByID(course.instructor_id)}
                            </Typography>
                            <Typography component="p">
                                {course.dates} | {course.days} | {course.time}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size={"small"}
                                color={"primary"}
                                onClick={(e) => {e.preventDefault(); this.goToRoute('/registration/form/course/' + course.course_title)}}
                            >
                                Register
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grow>
        })
    };

    render(){
        // console.log('mobile registration!');
        return (
            <div className="">
                <Grid container spacing={16} className={"course-categories"}>
                { this.props.categoriesViewToggle ?
                    CategoryView.bind(this)(this.props.categories) :
                    this.CoursesView.bind(this)(this.props.courses)
                }
                </Grid>
            </div>
        )
    }
}



export default withRouter(MobileRegistration);