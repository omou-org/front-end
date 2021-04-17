import React from 'react';
import Grid from '@material-ui/core/Grid';
import Moment from 'react-moment';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { fullName, formatAvailabilityListHours, formatAvailabilityListDays } from '../../../utils';

export default function EnrollmentDetails({ enrollment }) {
    const { course, student } = enrollment;

    const detailData = [
        {
            title: 'Instructor',
            info: fullName(course.instructor.user),
            link: `/accounts/instructor/${course.instructor.user.id}`
        },
        {
            title: 'Grade',
            info: student.grade,
        },
        {
            title: 'Subject',
            info: course.courseCategory.name,
        },
        {
            title: 'Date',
            info: (
                <>
                    <Moment
                        date={course.startDate}
                        format='M/D/YYYY'
                    />
                    {' - '}
                    <Moment
                        date={course.endDate}
                        format='M/D/YYYY'
                    />
                </>)
        },
        {
            title: 'Days',
            info: formatAvailabilityListDays(course.availabilityList)
        },
        {
            title: 'Time',
            info: formatAvailabilityListHours(course.availabilityList)
        }
    ]

    const Detail = ({ title, info, link }) => {

        const infoDisplay = (link === undefined) ? 
            info :
            <Link to={link}>{info}</Link>;

        return (
            <Grid item xs={4}>
                <Grid
                    container
                    direction='column'
                    alignItems='flex-start'
                    spacing={1}
                >
                    <Grid item>
                        <Typography variant='h5'>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>
                            {infoDisplay}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    

    return (
        <Grid 
            container 
            xs={6}
            direction='row'
            spacing={5}

        >
            {detailData.map((detail) => <Detail title={detail.title} info={detail.info} link={detail.link}/>)}
        </Grid>
    );
}
