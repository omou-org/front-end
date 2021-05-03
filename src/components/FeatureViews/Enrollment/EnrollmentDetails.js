import React from 'react';
import Grid from '@material-ui/core/Grid';
import Moment from 'react-moment';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import {formatAvailabilityListDays, formatAvailabilityListHours, fullName,} from '../../../utils';
import PropTypes from "prop-types";

const Detail = ({title, info, link}) => {
    const infoDisplay =
        link === undefined ? info : <Link to={link}>{info}</Link>;

    return (
        <Grid item xs={4}>
            <Grid
                container
                direction='column'
                alignItems='flex-start'
                spacing={1}
            >
                <Grid item>
                    <Typography variant='h5'>{title}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant='body1'>{infoDisplay}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

Detail.propTypes = {
    title: PropTypes.string,
    info: PropTypes.string,
    link: PropTypes.string,
};

function EnrollmentDetails({enrollment}) {
    const {course, student} = enrollment;

    const detailData = [
        {
            title: 'Instructor',
            info: fullName(course.instructor.user),
            link: `/accounts/instructor/${course.instructor.user.id}`,
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
                    <Moment date={course.startDate} format='M/D/YYYY'/>
                    {' - '}
                    <Moment date={course.endDate} format='M/D/YYYY'/>
                </>
            ),
        },
        {
            title: 'Days',
            info: formatAvailabilityListDays(course.availabilityList),
        },
        {
            title: 'Time',
            info: formatAvailabilityListHours(course.availabilityList),
        },
    ];

    return (
        <Grid container xs={6} direction='row' spacing={5}>
            {detailData.map((detail, index) => (
                <Detail
                    title={detail.title}
                    info={detail.info}
                    link={detail.link}
                    key={index}
                />
            ))}
        </Grid>
    );
}

EnrollmentDetails.propTypes = {
    enrollment: PropTypes.shape({
        course: PropTypes.shape({
            instructor: PropTypes.shape({
                user: PropTypes.shape({
                    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                })
            }),
            courseCategory: PropTypes.shape({
                name: PropTypes.string,
            }),
            startDate: PropTypes.any,
            endDate: PropTypes.any,
            availabilityList: PropTypes.any,
        }),
        student: PropTypes.shape({
            grade: PropTypes.any,
        }),
    }).isRequired,
};

export default EnrollmentDetails;
