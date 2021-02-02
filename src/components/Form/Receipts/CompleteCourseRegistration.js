import React from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Paper, Tooltip, Typography} from '@material-ui/core';
import AccountCard from '../../FeatureViews/Search/cards/AccountCard';
import Grid from '@material-ui/core/Grid';
import * as hooks from '../../../actions/hooks';
import Loading from '../../OmouComponents/Loading';
import {stringToColor} from '../../FeatureViews/Accounts/accountUtils';
import Avatar from '@material-ui/core/Avatar';
import {ResponsiveButton} from '../../../theme/ThemedComponents/Button/ResponsiveButton';

export function CompleteCourseRegistration({
                                               registeredCourseForm,
                                               courseType,
                                           }) {
    const students = useSelector(({Users}) => Users.StudentList);
    const instructors = useSelector(({Users}) => Users.InstructorList);
    const courses = useSelector(({Course}) => Course.NewCourseList);

    let studentID = registeredCourseForm.student_id;
    const course_id = registeredCourseForm.course_id;
    const courseStatus = hooks.useCourse(
        typeof course_id !== 'string' && course_id
    );
    const instructorID = {
        course: courses[course_id] && courses[course_id].instructor_id,
        tutoring:
            registeredCourseForm.new_course &&
            registeredCourseForm.new_course.instructor,
        small_group: courses[course_id] && courses[course_id].instructor_id,
    }[courseType];
    const instructorStatus = hooks.useInstructor(
        courses[course_id] && instructorID
    );

    const studentStatus = hooks.useStudent(studentID);

    if (
        hooks.isLoading(instructorStatus) ||
        hooks.isLoading(courseStatus) ||
        hooks.isLoading(studentStatus)
    ) {
        return <Loading />;
    }

    const styles = (username) => ({
        backgroundColor: stringToColor(username),
        color: 'white',
        width: '3vw',
        height: '3vw',
        fontSize: 15,
        'margin-right': 10,
    });

    const rawStudent = students[studentID];
    const student = {
        user: {
            id: rawStudent.user_id,
            first_name: rawStudent.first_name,
            last_name: rawStudent.last_name,
            email: rawStudent.email,
        },
        account_type: 'student',
    };

    const course = {
        course: courses[course_id],
        tutoring: registeredCourseForm.new_course,
        small_group: courses[course_id],
    }[courseType];

    const instructor = instructors[instructorID];

    const dateString = (date) => {
        return new Date(date).toLocaleDateString();
    };
    const timeString = (time) => {
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };
        const formattedTime = '01/01/2020 ' + time.replace('T', '');
        return new Date(formattedTime).toLocaleTimeString(
            'eng-us',
            timeOptions
        );
    };

    return (
        <>
            <Paper elevation={2} className={'paper course-receipt'}>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid
                            container
                            direction='column'
                            justify='flex-start'
                            alignItems='flex-start'
                        >
                            <div className='course-info'>
                                <Grid item>
                                    <Typography align={'left'} variant='h4'>
                                        {course.title}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        className={'course-receipt-label'}
                                        align={'left'}
                                    >
                                        Date
                                    </Typography>
                                    <Typography align={'left'}>
                                        {`${dateString(
                                            course.schedule.start_date
                                        )} - ${dateString(
                                            course.schedule.end_date
                                        )}`}{' '}
                                        <br />
                                        {`${timeString(
                                            course.schedule.start_time
                                        )} - ${timeString(
                                            course.schedule.end_time
                                        )}`}
                                    </Typography>
                                </Grid>

                                <Grid item>
                                    <Typography
                                        className={'course-receipt-label'}
                                        align={'left'}
                                    >
                                        Instructor
                                    </Typography>
                                    <NavLink
                                        to={`/accounts/instructor/${instructor.user_id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Tooltip
                                            title={instructor.name}
                                            aria-label='Instructor Name'
                                        >
                                            <Avatar
                                                style={styles(instructor.name)}
                                            >
                                                {instructor.name
                                                    .match(/\b(\w)/g)
                                                    .join('')}
                                            </Avatar>
                                        </Tooltip>
                                    </NavLink>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid
                            container
                            direction='column'
                            justify='flex-end'
                            alignItems='center'
                        >
                            <Grid item xs={8}>
                                <AccountCard user={student} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction={'row'} justify={'flex-end'}>
                            <Grid item>
                                <ResponsiveButton
                                    variant='outlined'
                                    className='button'
                                >
                                    Add Sessions
                                </ResponsiveButton>
                            </Grid>
                            <Grid item>
                                <ResponsiveButton
                                    variant='outlined'
                                    component={NavLink}
                                    to={'/registration'}
                                    className='button'
                                >
                                    Register More
                                </ResponsiveButton>
                            </Grid>
                            <Grid item>
                                <ResponsiveButton
                                    component={NavLink}
                                    to={'/registration/cart'}
                                    variant='contained'
                                    color='primary'
                                    style={{ color: 'white' }}
                                >
                                    Checkout
                                </ResponsiveButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}

CompleteCourseRegistration.propTypes = {};

export default withRouter(CompleteCourseRegistration);
