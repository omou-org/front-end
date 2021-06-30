import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField } from '@material-ui/core';
import { slateGrey, omouBlue, white, body1 } from '../../../theme/muiTheme';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';
import { makeStyles } from '@material-ui/styles';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { withRouter } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';

const useStyles = makeStyles({
    editBtn: {
        marginTop: '1rem',
        marginBottom: '1rem',
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

const CREATE_CATCH_ALL_TUITION_RULE = gql`
    mutation createCatchAllTuitionRule(
        $hourlyTuition: Float = 1.5
        $category: Int = 10
        $courseType: CourseTypeEnum = SMALL_GROUP
    ) {
        createTuitionRule(
            hourlyTuition: $hourlyTuition
            category: $category
            courseType: $courseType
            allInstructorsApply: true
        ) {
            tuitionRule {
                id
                name
                category {
                    name
                }
                courseType
                instructors {
                    user {
                        id
                        firstName
                    }
                }
                tuitionPriceList {
                    hourlyTuition
                    createdAt
                    allInstructorsApply
                }
                business {
                    id
                }
            }
        }
    }
`;

const MainTuitionRulePage = ({ location }) => {
    const classes = useStyles();

    const {
        state: { id, name, privateRules, smallGroupRules },
    } = location;

    const tutoringType = privateRules
        ? 'Private'
        : smallGroupRules
        ? 'Small Group'
        : 'Class';

    const instructor =
        ((privateRules && privateRules.length === 0) ||
            (smallGroupRules && smallGroupRules.length === 0)) &&
        'All';

    const [showEdit, setShowEdit] = useState(false);
    const [catchAllTuition, setCatchAllTuition] = useState();

    const [submitData] = useMutation(CREATE_CATCH_ALL_TUITION_RULE, {
        onCompleted: (data) => {
            console.log(data);
        },
    });

    const handleOnChange = (e) => {
        const hourlyTuition = e.target.value;
        setCatchAllTuition(hourlyTuition);
    };

    const onSubmit = () => {
        submitData({
            variables: {
                hourlyTuition: catchAllTuition,
                category: id,
                courseType:
                    tutoringType === 'Private'
                        ? 'TUTORING'
                        : tutoringType === 'Small Group'
                        ? 'SMALL_GROUP'
                        : 'CLASS',
            },
        });
    };

    const toggleShowEdit = () => setShowEdit(!showEdit);

    return (
        <Grid
            container
            direction='column'
            justify='center'
            alignItems='flex-start'
        >
            <Grid className={classes.editBtn} item>
                <ResponsiveButton variant='outlined' onClick={toggleShowEdit}>
                    Edit
                </ResponsiveButton>
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

                <Grid item>
                    <Typography variant='body1'>{instructor}</Typography>
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
                        Tuition Rate
                    </Typography>
                </Grid>

                <Grid item>
                    {showEdit ? (
                        <TextField
                            variant='outlined'
                            value={catchAllTuition}
                            onChange={handleOnChange}
                            InputProps={{
                                classes: {
                                    root: classes.tuitionRateField,
                                },
                            }}
                        />
                    ) : (
                        <Typography variant='body1'>
                            <LabelBadge
                                style={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                }}
                                variant='round-negative'
                            >
                                !
                            </LabelBadge>
                            &nbsp; Not Set
                        </Typography>
                    )}
                </Grid>
            </Grid>

            {showEdit && (
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
                                onClick={toggleShowEdit}
                                variant='outlined'
                            >
                                cancel
                            </ResponsiveButton>
                        </Grid>
                        <Grid item>
                            <ResponsiveButton
                                onClick={onSubmit}
                                variant='contained'
                            >
                                update
                            </ResponsiveButton>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

MainTuitionRulePage.propTypes = {
    location: PropTypes.object,
    // match: PropTypes.object,
};

export default withRouter(MainTuitionRulePage);
