import React, { useState } from 'react';

import { Grid, Typography, TextField } from '@material-ui/core';
import { body1, white, omouBlue, slateGrey } from '../../../../theme/muiTheme';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { makeStyles } from '@material-ui/styles';
import { useQuery, useMutation, gql } from '@apollo/client';
import Select from 'react-select';

import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';

const GET_COURSE_TOPIC = gql`
    query getCourseTopic($categoryId: ID) {
        courseCategory(categoryId: $categoryId) {
            id
            name
            activeTuitionRuleCount
            tuitionruleSet {
                id
                tuitionPriceList {
                    allInstructorsApply
                    id
                    hourlyTuition
                    tuitionRule {
                        id
                        courseType
                        createdAt
                        updatedAt
                        instructors {
                            user {
                                id
                                firstName
                                lastName
                            }
                        }
                    }
                }
                instructors {
                    user {
                        id
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

const GET_INSTRUCTORS = gql`
    query getInstructors {
        instructors {
            user {
                id
                firstName
                lastName
            }
        }
    }
`;

const CREATE_INSTRUCTOR_RULE = gql`
    mutation MyMutation(
        # $id: ID
        $hourlyTuition: Float
        $category: Int
        $instructors: [ID]
        $courseType: CourseTypeEnum
    ) {
        createTuitionRule(
            allInstructorsApply: false
            # id: $id
            hourlyTuition: $hourlyTuition
            category: $category
            instructors: $instructors
            courseType: $courseType
        ) {
            tuitionRule {
                # id
                name
                category {
                    id
                    name
                }
                courseType
                instructors {
                    user {
                        id
                        firstName
                        lastName
                    }
                    business {
                        id
                    }
                }
                tuitionPriceList {
                    hourlyTuition
                    createdAt
                    allInstructorsApply
                }
            }
        }
    }
`;

const useStyles = makeStyles({
    root: {
        padding: '1em',
    },
    topicName: {
        width: '16rem',
        height: '2rem',
        marginTop: '0.5rem',
    },
    courseType: {
        marginTop: '2rem',
        color: slateGrey,
        width: '100%',
        height: '3rem',
    },
    label: {
        color: slateGrey,
    },
    marginVertLarge: {
        marginBottom: '2rem',
    },
    marginVertSm: {
        marginBottom: '0.5rem',
    },
    tuitionRateField: {
        ...body1,
        height: '2rem',
        width: '5.645rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
});

const ManageInstructorRule = ({ location }) => {
    const {
        state: { id, name, privateRule, smallGroupRule },
    } = location;
    // console.log(id);
    const history = useHistory();

    const classes = useStyles();
    const [hourlyTuition, setHourlyTuition] = useState();
    const [selectedInstructors, setSelectedInstructors] = useState([]);

    const handleOnChange = (e) => {
        const hourlyTuition = e.target.value;
        console.log(hourlyTuition);
        setHourlyTuition(hourlyTuition);
    };

    const handleInstructorChange = (e) => {
        console.log(e);
        setSelectedInstructors(e);
    };

    const {
        loading: topicLoading,
        error: topicError,
        data: topicData,
    } = useQuery(GET_COURSE_TOPIC, {
        variables: {
            categoryId: id,
        },
        fetchPolicy: 'cache-and-network',
    });

    const [submitData] = useMutation(CREATE_INSTRUCTOR_RULE, {
        onCompleted: (data) => {
            console.log('created');
            console.log(data);
            history.goBack();
        },
    });

    const onSubmit = () => {
        submitData({
            variables: {
                // id: tuitionRuleId,
                hourlyTuition: hourlyTuition,
                category: id,
                instructors: selectedInstructors.map((item) => item.value),
                courseType: privateRule
                    ? 'TUTORING'
                    : smallGroupRule
                    ? 'SMALL_GROUP'
                    : 'CLASS',
            },
        });
    };
    const tutoringType = privateRule
        ? 'Private'
        : smallGroupRule
        ? 'Small Group'
        : 'Class';

    const {
        loading: instructorLoading,
        error: instructorError,
        data: instructorData,
    } = useQuery(GET_INSTRUCTORS);

    if (topicLoading || instructorLoading) return null;
    if (topicError || instructorError)
        return `Error! ${topicError || instructorError}`;

    const formatInstructorInfo = (instructorsArr) => {
        let instructors = [];

        instructorsArr.forEach(({ user }) => {
            instructors.push({
                value: Number(user.id),
                label: `${user.firstName} ${user.lastName}`,
            });
        });

        return instructors;
    };

    const instructorInfo = formatInstructorInfo(instructorData.instructors);

    const {
        courseCategory: { tuitionruleSet },
    } = topicData;
    // console.log(tuitionruleSet);
    const tuitionPrices = tuitionruleSet.map((rule) => rule.tuitionPriceList);
    const instructorRules = tuitionPrices.filter((price) =>
        price.every((edit) => !edit.allInstructorsApply)
    );

    let existingInstructorRules;

    if (tutoringType === 'Private') {
        existingInstructorRules = instructorRules.filter((rule) =>
            rule.every((item) => item.tuitionRule.courseType === 'TUTORING')
        );
    } else if (tutoringType === 'Small Group') {
        existingInstructorRules = instructorRules.filter((rule) =>
            rule.every((item) => item.tuitionRule.courseType === 'SMALL_GROUP')
        );
    } else {
        existingInstructorRules = instructorRules.filter((rule) =>
            rule.every((item) => item.tuitionRule.courseType === 'CLASS')
        );
    }

    const existingInstructors = formatInstructorInfo(
        existingInstructorRules[0][0].tuitionRule.instructors
    );

    const checkForSameInstructors = (selected, instructors) => {
        if (selected) {
            return selected.every((instructor) =>
                instructors.includes(instructor)
            );
        }
    };

    const existingIds = existingInstructors.map(
        (instructor) => instructor.value
    );
    const selectedIds =
        selectedInstructors &&
        selectedInstructors.map((instructor) => instructor.value);

    const customStyles = {
        control: (base) => {
            return {
                ...base,
                border: `1px solid ${omouBlue}`,
                width: '28rem',
                height: '2rem',
            };
        },
    };

    return (
        <Grid
            container
            direction='column'
            justify='center'
            alignItems='flex-start'
            style={{ marginTop: '2rem' }}
        >
            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Topic
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant='body1'>{name}</Typography>
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Tutoring Type
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant='body1'>{tutoringType}</Typography>
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Instructor
                    </Typography>
                </Grid>

                <Grid item xs={12} className={checkForSameInstructors(selectedIds, existingIds) && classes.marginVertSm}>
                    <Select
                        isMulti
                        options={instructorInfo}
                        styles={customStyles}
                        placeholder='Select Instructors'
                        value={selectedInstructors}
                        onChange={handleInstructorChange}
                    />
                </Grid>

                {checkForSameInstructors(selectedIds, existingIds) && 
                    <Grid item xs={12}>
                        <Typography
                        variant='body1'
                    >
                        * A tuition rule with that instructor or those instructors already exists.
                    </Typography>
                    </Grid>
                }
                
            </Grid>

            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Tuition Rate
                    </Typography>
                </Grid>

                <Grid item>
                    <TextField
                        variant='outlined'
                        value={hourlyTuition}
                        onChange={handleOnChange}
                        InputProps={{
                            classes: {
                                root: classes.tuitionRateField,
                            },
                        }}
                    />{' '}
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                style={{ marginTop: '3rem' }}
            >
                <Grid
                    item
                    xs={2}
                    container
                    direction='row'
                    justify='space-between'
                    alignItems='center'
                >
                    <Grid item>
                        <ResponsiveButton
                            onClick={() => history.goBack()}
                            variant='outlined'
                        >
                            cancel
                        </ResponsiveButton>
                    </Grid>
                    <Grid item>
                        <ResponsiveButton
                            onClick={onSubmit}
                            variant='contained'
                            disabled={
                                checkForSameInstructors(
                                    selectedIds,
                                    existingIds
                                ) ||
                                !(
                                    Array.isArray(selectedInstructors) &&
                                    selectedInstructors.length
                                )
                                    ? true
                                    : false
                            }
                        >
                            create
                        </ResponsiveButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

ManageInstructorRule.propTypes = {
    location: PropTypes.object,
    privateRule: PropTypes.bool,
    smallGroupRule: PropTypes.bool,
};

export default withRouter(ManageInstructorRule);
