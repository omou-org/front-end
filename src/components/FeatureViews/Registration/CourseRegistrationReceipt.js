import React from 'react';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import AccountCard from '../Search/cards/AccountCard';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Loading from '../../OmouComponents/Loading';
import Typography from '@material-ui/core/Typography';
import { fullName } from '../../../utils';
import Moment from 'react-moment';
import Avatar from '@material-ui/core/Avatar';
import { stringToColor } from '../Accounts/accountUtils';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import NavLinkNoDup from '../../Routes/NavLinkNoDup';
import CourseAvailabilites from '../../OmouComponents/CourseAvailabilities';

import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

const GET_COURSE = gql`
    query GetCourse($courseId: ID!) {
        course(courseId: $courseId) {
            title
            startDate
            availabilityList {
                endTime
                startTime
                dayOfWeek
            }
            endDate
            instructor {
                user {
                    firstName
                    lastName
                }
            }
        }
    }
`;

export default function CourseRegistrationReceipt({ formData, format }) {
    const { type } = useParams();
    const { data, loading, error } = useQuery(GET_COURSE, {
        variables: { courseId: formData.course?.class.value },
        skip:
            type === 'tutoring-registration' ||
            type === 'small-group-registration',
    });

    const courseType = {
        'tutoring-registration': 'tutoring',
        'small-group-registration': 'smallGroup',
    }[type];

    if (loading) {
        return <Loading small />;
    }
    if (error) {
        return <Typography>{error.message}</Typography>;
    }

    //TODO: fix the dates....ugh.
    const createTutoringRegistration = (formData, courseType) => ({
        title: formData.tutoring_details.course,
        instructor: formData.tutoring_details.instructor.label,
        startDate: formData.tutoring_details.startDate,
        endDate: new Date(
            formData.tutoring_details.startDate.setDate(
                formData.tutoring_details.startDate.getDate() +
                    7 * (formData.sessions - 1)
            )
        ),
        startTime: formData.tutoring_details.startTime,
        endTime: new Date(
            formData.tutoring_details.startTime.setTime(
                formData.tutoring_details.startTime.getTime() +
                    Number(formData.duration) * 60 * 60 * 1000
            )
        ),
        courseType,
    });

    const course = {
        'tutoring-registration':
            formData.tutoring_details &&
            createTutoringRegistration(formData, courseType),
        'small-group-registration':
            formData.tutoring_details &&
            createTutoringRegistration(formData, courseType),
        'class-registration': data && {
            instructor: fullName(data.course.instructor.user),
            title: data.course.title,
            startDate: data.course.startDate,
            endDate: data.course.endDate,
            availabilityList: data.course.availabilityList,
        },
    }[type];
    const CourseReceipt = ({
        startDate,
        endDate,
        availabilityList,
        instructor,
        title,
    }) => (
        <>
            <Typography align='left' variant='h4'>
                {title}
            </Typography>{' '}
            <br />
            <Typography align='left' variant='subtitle2'>
                Dates
            </Typography>
            <Typography align='left'>
                <Moment format='MM/D/YYYY' date={startDate} /> -{' '}
                <Moment format='MM/D/YYYY' date={endDate} /> <br />
                <CourseAvailabilites availabilityList={availabilityList} />
            </Typography>{' '}
            <br />
            <Typography align='left' variant='subtitle2'>
                Instructor
            </Typography>
            <Typography align='left'>
                <Avatar styles={{ backgroundColor: stringToColor(instructor) }}>
                    {instructor.match(/\b(\w)/gu).join('')}
                </Avatar>
                {instructor}
            </Typography>
        </>
    );

    return (
        <Grid container>
            <Grid item md={6} xs={12}>
                {CourseReceipt(course)}
            </Grid>
            <Divider orientation='vertical' flexItem />
            <Grid item md={2} />
            <Grid item md={3} xs={12}>
                <AccountCard
                    accountType='STUDENT'
                    userID={formData.student.student}
                    data-cy='student-card'
                />
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction='row'
                justify='flex-end'
                spacing={4}
            >
                <Grid item>
                    <ResponsiveButton
                        variant='outlined'
                        component={NavLinkNoDup}
                        to='/registration'
                        data-cy='back-to-register'
                    >
                        register more
                    </ResponsiveButton>
                </Grid>
                <Grid item>
                    <ResponsiveButton
                        variant='contained'
                        component={NavLinkNoDup}
                        to={'/registration/cart/'}
                        data-cy='back-to-register'
                    >
                        checkout
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    );
}
