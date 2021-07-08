/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { h4, omouBlue, white, body1, body2 } from '../../../../theme/muiTheme';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
    Grid,
    TextField,
    TableContainer,
    TableCell,
    TableHead,
    Table,
    TableRow,
    TableBody,
} from '@material-ui/core';
import { Link, useRouteMatch } from 'react-router-dom';
// import CheckIcon from '@material-ui/icons/Check';
import { gql, useQuery } from '@apollo/client';
// import SearchIcon from '@material-ui/icons/Search';
import { TablePagination } from '../../../OmouComponents/TablePagination';

import Loading from 'components/OmouComponents/Loading';

const useStyles = makeStyles({
    verticalMargin: {
        marginTop: '1rem',
    },
    searchBar: {
        ...body1,
        height: '2.5rem',
        width: '16rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
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
    editTagDescription: {
        ...body1,
        height: '2rem',
        width: '34.675rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
    editTagName: {
        ...body1,
        height: '2rem',
        width: '13.2125rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
    input: {
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        textAlign: 'center',
        padding: '5px',
    },
    tableFooter: {
        paddingTop: '1vh',
    },
    topicCell: {
        height: '2rem',
        width: '18.2125rem',
    },
});

const GET_COURSE_TOPICS = gql`
    query getCourseTopics {
        courseCategories {
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
                                firstName
                                lastName
                            }
                        }
                    }
                }
                instructors {
                    user {
                        id
                        lastName
                        firstName
                    }
                }
            }
        }
    }
`;

const TuitionRule = () => {
    const classes = useStyles();
    const [courseTopics, setCourseTopics] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(0);

    const { data, loading, error } = useQuery(GET_COURSE_TOPICS, {
        onCompleted: () => {
            let topics = createCourseTopicObject(data.courseCategories);
            setCourseTopics(topics);
        },
        fetchPolicy: 'cache-and-network',
    });

    const createCourseTopicObject = (courses) => {
        return courses.map(
            ({ name, id, activeTuitionRuleCount, tuitionruleSet }) => ({
                id,
                name,
                activeTuitionRuleCount,
                tuitionruleSet,
            })
        );
    };

    if (loading) return <Loading />;
    if (error) console.error(error);

    const { courseCategories } = data;

    const searchCourseTopic = (e) => {
        setSearchValue(e.target.value);
        let inputValue = e.target.value;

        inputValue = inputValue.toLowerCase();

        const finalResult = [];
        courseTopics.forEach((item) => {
            if (item.name.toLowerCase().indexOf(inputValue) !== -1) {
                finalResult.push(item);
            }
        });

        if (!inputValue) {
            setCourseTopics(data.courseCategories);
        } else {
            setCourseTopics(finalResult);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    let amountOfRows = 15;
    let totalPages = Math.ceil(courseCategories.length / amountOfRows);

    return (
        <>
            <Grid
                container
                className={classes.verticalMargin}
                direction='row'
                justify='space-between'
                alignItems='center'
            >
                <Grid item></Grid>

                <Grid item style={{ marginRight: '3rem' }}>
                    <TextField
                        placeholder='Search topic'
                        value={searchValue}
                        variant='outlined'
                        InputProps={{
                            classes: {
                                root: classes.searchBar,
                            },
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={searchCourseTopic}
                    />
                </Grid>
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
                                    Topic
                                </TableCell>
                                <TableCell
                                    className={classes.headCells}
                                    style={{ minWidth: 170 }}
                                >
                                    Active Rules
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courseTopics
                                .slice(
                                    page * amountOfRows,
                                    page * amountOfRows + amountOfRows
                                )
                                .map(
                                    ({
                                        name,
                                        id,
                                        activeTuitionRuleCount,
                                        tuitionruleSet,
                                    }) => (
                                        <TableRow
                                            key={id}
                                            component={Link}
                                            to={{
                                                pathname: `${id}`,
                                                state: {
                                                    name,
                                                    id,
                                                    tuitionruleSet,
                                                },
                                            }}
                                        >
                                            <TableCell
                                                className={classes.topicCell}
                                            >
                                                {name}
                                            </TableCell>
                                            <TableCell>
                                                {activeTuitionRuleCount}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    className={classes.tableFooter}
                >
                    <TablePagination
                        page={page}
                        colSpan={3}
                        totalPages={totalPages}
                        onChangePage={handlePageChange}
                        isGraphqlPage={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
TuitionRule.propTypes = {
    row: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
};
export default TuitionRule;
