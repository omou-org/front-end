import React from 'react';
import { Grid, Typography } from '@material-ui/core';

// import { highlightColor, slateGrey } from '../../../theme/muiTheme';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Eyebrow from '../../OmouComponents/Eyebrow';
import { useFormState } from 'react-final-form';
import { fullName } from 'utils';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginBottom: theme.spacing(4),
    },
    reviewHeader: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

const GET_TOPIC_AND_STUDENT = gql`
    query getTopicAndStudent($courseTopicId: ID, $studentId: ID) {
        courseCategory(categoryId: $courseTopicId) {
            name
        }
        student(userId: $studentId) {
            user {
                firstName
                lastName
            }
        }
    }
`;

const ReviewRequestStep = () => {
    const classes = useStyles();
    const { values } = useFormState();

    const { data, loading, error } = useQuery(GET_TOPIC_AND_STUDENT, {
        variables: {
            courseTopicId: values.selectSubject,
            studentId: values.selectStudent,
        },
    });
    if (loading) return '';
    if (error) console.error(error);

    const ReciptLabels = ({ header, subHeader }) => {
        return (
            <div>
                <Typography
                    variant='h4'
                    style={{ textAlign: 'left', marginBottom: '15px' }}
                >
                    {header}
                </Typography>
                <Typography variant='subtitle1' style={{ textAlign: 'left' }}>
                    {subHeader}
                </Typography>
            </div>
        );
    };
    ReciptLabels.propTypes = {
        header: PropTypes.string,
        subHeader: PropTypes.string,
    };

    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    const sortDays = (day1, day2) => {
        day1 = days.indexOf(day1);
        day2 = days.indexOf(day2);
        return day1 - day2;
    };
    const recurringDays = () => {
        let formValueKeys = Object.keys(values).sort(sortDays);
        let recurringDaysArray = formValueKeys.filter((key) => {
            if (values[key] === true) return key;
        });

        return recurringDaysArray.join(', ');
    };

    const { courseCategory, student } = data;

    return (
        <Grid
            container
            direction='column'
            justify='flex-start'
            className={classes.root}
            spacing={3}
        >
            <Grid item xs={12} className={classes.reviewHeader}>
                <Eyebrow
                    title='Review Your Request'
                    subText='Please make sure the information is correct before submitting your request'
                />
            </Grid>

            <Grid
                item
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
                spacing={5}
            >
                <Grid item xs={5}>
                    <ReciptLabels
                        header='Date'
                        subHeader={`${values.startDate.format(
                            'MMMM DD'
                        )} - ${values.endDate.format('MMMM DD')}`}
                    />
                </Grid>
                <Grid item xs={7}>
                    <ReciptLabels
                        header='Day & time'
                        subHeader={`${recurringDays()} at 9:00am`}
                    />
                </Grid>

                <Grid item xs={2}>
                    <ReciptLabels
                        header='SUBJECT'
                        subHeader={courseCategory.name}
                    />
                </Grid>
                <Grid item xs={3}>
                    <ReciptLabels header='INSTRUCTOR' subHeader={'Tim Yang'} />
                </Grid>

                <Grid item xs={4}>
                    <ReciptLabels
                        header='Student'
                        subHeader={fullName(student.user)}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ReviewRequestStep;

ReviewRequestStep.propTypes = {
    studentIdList: PropTypes.array,
    activeStep: PropTypes.number,
};
