import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Grid,
    Typography,
    // TextField,
    TableContainer,
    TableCell,
    TableHead,
    Table,
    TableRow,
    TableBody,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
    h4,
    h5,
    slateGrey,
    omouBlue,
    body1,
    body2,
} from '../../../../theme/muiTheme';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const useStyles = makeStyles({
    root: {
        padding: '1em',
    },
    breadcrumb: {
        width: '5.0625rem',
        height: '1rem',
        ...h5,
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
    tableHead: {
        color: omouBlue,
    },
    headCells: {
        ...h4,
        color: omouBlue,
    },
    tagName: {
        ...body2,
    },
    catchAllRule: {
        marginTop: '1rem',
        width: '33.4375rem',
        height: '1.375rem',
    },
    catchAllRuleText: {
        ...body1,
        fontStyle: 'italic',
    },
});

const GET_COURSE_TOPIC = gql`
    query MyQuery($categoryId: ID) {
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

const ManageTopicTuition = ({
    location /*match  you can use this propety to get the id  */,
}) => {
    const classes = useStyles();
    const {
        state: { id, name },
    } = location;
    const topicName = name;

    const { loading, error, data } = useQuery(GET_COURSE_TOPIC, {
        variables: {
            categoryId: id,
        },
        fetchPolicy: 'cache-and-network',
    });
    if (loading) return null;
    if (error) return `Error! ${error}`;
    const { courseCategory } = data;
    const tuitionRuleSet = courseCategory.tuitionruleSet;

    const tuitionPrices = tuitionRuleSet
        .map((rule) => rule.tuitionPriceList[0])
        .filter((rule) => rule);

    const privateRules = tuitionPrices.filter(
        (price) => price.tuitionRule.courseType === 'TUTORING'
    );

    const smallGroupRules = tuitionPrices.filter(
        (price) => price.tuitionRule.courseType === 'SMALL_GROUP'
    );

    return (
        <Grid
            container
            direction='column'
            justify='center'
            alignItems='flex-start'
            className={classes.root}
        >
            <Grid item xs={2}>
                <NavLink
                    className={classes.breadcrumb}
                    color='inherit'
                    to='/adminportal/tuition-rules/'
                >
                    {'< ALL TOPICS'}
                </NavLink>
            </Grid>
            <Grid className={classes.topicName} item>
                <Typography display='block' align='left' variant='h3'>
                    {topicName}
                </Typography>
            </Grid>

            <Grid className={classes.courseType} item>
                <Typography display='block' align='left' variant='h4'>
                    Private Tutoring
                </Typography>
            </Grid>

            <Grid className={classes.verticalMargin} container>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classes.headCells}
                                    style={{ minWidth: 170 }}
                                >
                                    Instructor
                                </TableCell>
                                <TableCell
                                    className={classes.headCells}
                                    style={{ minWidth: 170 }}
                                >
                                    Tuition
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {privateRules.length < 1 ? (
                                <TableRow
                                    component={Link}
                                    to={{
                                        pathname: `${id}/edit`,
                                        state: {
                                            name,
                                            id,
                                            tuitionRuleSet,
                                            privateRules,
                                        },
                                    }}
                                >
                                    <TableCell>All</TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                </TableRow>
                            ) : (
                                privateRules.map(
                                    ({
                                        allInstructorsApply,
                                        hourlyTuition,
                                        id,
                                        tuitionRule,
                                    }) => (
                                        <TableRow
                                            key={id}
                                            component={Link}
                                            to={{
                                                pathname: `${id}/edit`,
                                                state: {
                                                    name,
                                                    id,
                                                    tuitionRuleSet,
                                                    privateRules,
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                {allInstructorsApply
                                                    ? 'All'
                                                    : `${tuitionRule.instructors[0].user.firstName} ${tuitionRule.instructors[0].user.lastName}`}
                                            </TableCell>
                                            <TableCell>
                                                ${hourlyTuition}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item style={{ marginTop: '1rem' }}>
                <ResponsiveButton
                    variant='outlined'
                    startIcon={<AddIcon />}
                    disabled={privateRules.length === 0 ? true : false}
                >
                    New Rule
                </ResponsiveButton>
            </Grid>

            <Grid className={classes.courseType} item>
                <Typography
                    style={{ width: '100%' }}
                    display='block'
                    align='left'
                    variant='h4'
                >
                    Small Group Tutoring
                </Typography>
            </Grid>

            <Grid className={classes.verticalMargin} container>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classes.headCells}
                                    style={{ minWidth: 170 }}
                                >
                                    Instructor
                                </TableCell>
                                <TableCell
                                    className={classes.headCells}
                                    style={{ minWidth: 170 }}
                                >
                                    Tuition
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {smallGroupRules.length < 1 ? (
                                <TableRow
                                    component={Link}
                                    to={{
                                        pathname: `${id}/edit`,
                                        state: {
                                            name,
                                            id,
                                            tuitionRuleSet,
                                            smallGroupRules,
                                        },
                                    }}
                                >
                                    <TableCell>All</TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                </TableRow>
                            ) : (
                                smallGroupRules.map(
                                    ({
                                        allInstructorsApply,
                                        hourlyTuition,
                                        id,
                                        tuitionRule,
                                    }) => (
                                        <TableRow
                                            key={id}
                                            component={Link}
                                            to={{
                                                pathname: `${id}/edit`,
                                                state: {
                                                    name,
                                                    id,
                                                    tuitionRuleSet,
                                                    smallGroupRules,
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                {allInstructorsApply
                                                    ? 'All'
                                                    : `${tuitionRule.instructors[0].user.firstName} ${tuitionRule.instructors[0].user.lastName}`}
                                            </TableCell>
                                            <TableCell>
                                                ${hourlyTuition}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item style={{ marginTop: '1rem' }}>
                <ResponsiveButton
                    variant='outlined'
                    startIcon={<AddIcon />}
                    disabled={smallGroupRules.length === 0 ? true : false}
                >
                    New Rule
                </ResponsiveButton>
            </Grid>

            <Grid item className={classes.catchAllRule}>
                <Typography
                    className={classes.catchAllRuleText}
                    variant='body1'
                >
                    Instructor-specific rules cannot be added until a general
                    catch-all tuition rule is set.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default withRouter(ManageTopicTuition);

ManageTopicTuition.propTypes = {
    location: PropTypes.object,
    // match: PropTypes.object,
};
