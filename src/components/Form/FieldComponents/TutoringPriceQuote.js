// React Imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Material UI Imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';
// Local Component Imports
import './Form.scss';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { BootstrapInput } from '../../FeatureViews/Scheduler/SchedulerUtils';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loading from '../../OmouComponents/Loading';
import * as Fields from 'mui-rff';
import { OnChange } from 'react-final-form-listeners';
import makeStyles from '@material-ui/core/styles/makeStyles';

const GET_TUITION_RULES = gql`
    query GetTuitionRules {
        priceRules {
            id
            category {
                name
                id
            }
            hourlyTuition
            academicLevel
            courseType
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '5%',
    },
}));

const TutoringPriceQuote = ({ courseType, mutators }) => {
    const { data, loading, error } = useQuery(GET_TUITION_RULES);

    const [priceQuote, setPriceQuote] = useState(null);
    const [durationValue, setDurationValue] = useState(null);
    const [sessionsValue, setSessionsValue] = useState(null);
    const [disabledAcademicLevel, setDisabledAcademicLevel] = useState(true);
    const [categoryValue, setCategoryValue] = useState(null);
    const [hourlyTuitionValue, setHourlyTuitionValue] = useState(null);

    const classes = useStyles();

    useEffect(() => {
        if (sessionsValue && durationValue && hourlyTuitionValue) {
            setPriceQuote(() => {
                const quote =
                    Number(sessionsValue) *
                    Number(durationValue) *
                    Number(hourlyTuitionValue);
                return `$ ${quote}`;
            });
        }
    }, [sessionsValue, durationValue, hourlyTuitionValue]);

    if (loading) {
        return <Loading small />;
    }
    if (error) {
        return <Typography>There's been an error: {error.message}</Typography>;
    }

    const { priceRules } = data;
    const filteredPriceRules = priceRules.filter(
        (rule) => rule.courseType === courseType
    );
    const categoryOptions = filteredPriceRules
        .map(({ category }) => ({
            label: category.name,
            value: category.id,
        }))
        .filter(
            (rule, index, self) =>
                index === self.findIndex((r) => r.value === rule.value)
        );
    const academicLevelOptions = filteredPriceRules
        .map(({ academicLevel, category, id }) => ({
            label: {
                COLLEGE_LVL: 'College',
                HIGH_LVL: 'High School',
                MIDDLE_LVL: 'Middle School',
                ELEMENTARY_LVL: 'Elementary School',
            }[academicLevel],
            value: { category: category.id, ruleId: id },
        }))
        .filter((rule) => rule.value.category === categoryValue);

    return (
        <Grid
            container
            direction='column'
            justify='flex-start'
            alignItems='flex-end'
            spacing={4}
        >
            <Grid
                container
                item
                md={8}
                spacing={5}
                direction='row'
                alignItems='center'
            >
                <Grid item md={4}>
                    <Fields.Select
                        data={categoryOptions}
                        name='categories'
                        label='Category'
                        input={<BootstrapInput id='category-options' />}
                    />
                    <OnChange name='categories'>
                        {(value) => {
                            setCategoryValue(value);
                            setDisabledAcademicLevel(false);
                        }}
                    </OnChange>
                </Grid>
                <Grid item md={4}>
                    <Fields.Select
                        name='academicLevels'
                        label='Academic Levels'
                        disabled={disabledAcademicLevel}
                        input={<BootstrapInput id='category-options' />}
                    >
                        {academicLevelOptions.map((academicLevel, i) => (
                            <MenuItem
                                key={i}
                                value={academicLevel.value.ruleId}
                            >
                                {academicLevel.label}
                            </MenuItem>
                        ))}
                    </Fields.Select>
                    <OnChange name='academicLevels'>
                        {(value) => {
                            const hourlyTuition =
                                priceRules[value].hourlyTuition;
                            setHourlyTuitionValue(hourlyTuition);
                            mutators.setHourlyTuition(hourlyTuition);
                        }}
                    </OnChange>
                </Grid>
                <Grid item md={3}>
                    <InputLabel>Hourly Tuition</InputLabel>
                    <TextField
                        classes={classes.root}
                        variant='outlined'
                        value={hourlyTuitionValue}
                    />
                </Grid>
            </Grid>
            <Grid item md={4}>
                <Fields.Select
                    name='duration'
                    label='Duration'
                    variant='outlined'
                >
                    <MenuItem value='.5'>0.5 Hours</MenuItem>
                    <MenuItem value='1'>1 Hours</MenuItem>
                    <MenuItem value='1.5'>1.5 Hours</MenuItem>
                    <MenuItem value='2'>2 Hours</MenuItem>
                </Fields.Select>
                <OnChange name='duration'>
                    {(value) => setDurationValue(value)}
                </OnChange>
            </Grid>
            <Grid item md={4}>
                <Fields.TextField name='sessions' label='Number of Sessions' />
                <OnChange name='sessions'>
                    {(value) => setSessionsValue(value)}
                </OnChange>
            </Grid>
            <Grid item>{priceQuote}</Grid>
        </Grid>
    );
};

TutoringPriceQuote.propTypes = {
    courseType: PropTypes.string.isRequired,
};

export default TutoringPriceQuote;
