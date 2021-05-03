import React, { useEffect, useMemo, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'actions/hooks';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LessResultsIcon from '@material-ui/icons/KeyboardArrowLeft';
import { Link } from 'react-router-dom';
import MoreResultsIcon from '@material-ui/icons/KeyboardArrowRight';
import Typography from '@material-ui/core/Typography';

import './Search.scss';
import AccountFilters from './AccountFilters';
import AccountCard from './cards/AccountCard';
import BackButton from '../../OmouComponents/BackButton';
import { LabelBadge } from '../../../theme/ThemedComponents/Badge/LabelBadge';
import CourseFilters from './CourseFilters';
import CourseCard from './cards/CourseCard';
import NoResultsPage from './NoResults/NoResultsPage';
import { capitalizeString } from 'utils';

const changePage = (setter, delta) => () => {
    setter((prevVal) => prevVal + delta);
};

const getPageSize = (filter) => (filter ? 12 : 4);

const ACCOUNT_SEARCH = gql`
    query AccountSearch(
        $grade: Int
        $page: Int
        $pageSize: Int
        $profile: String
        $query: String!
        $sort: String
    ) {
        accountSearch(
            query: $query
            page: $page
            pageSize: $pageSize
            grade: $grade
            profile: $profile
            sort: $sort
        ) {
            results {
                ... on StudentType {
                    user {
                        id
                    }
                    accountType
                }
                ... on ParentType {
                    user {
                        id
                    }
                    accountType
                }
                ... on InstructorType {
                    user {
                        id
                    }
                    accountType
                }
                ... on AdminType {
                    user {
                        id
                    }
                    accountType
                }
            }
            total
        }
    }
`;

const COURSE_SEARCH = gql`
    query CourseSearch(
        $query: String!
        $availability: String
        $size: Int
        $type: String
        $page: Int
        $pageSize: Int
        $sort: String
    ) {
        courseSearch(
            query: $query
            availability: $availability
            courseSize: $size
            courseType: $type
            page: $page
            pageSize: $pageSize
            sort: $sort
        ) {
            total
            results {
                id
            }
        }
    }
`;

const SearchResults = () => {
    const [accountsPage, setAccountsPage] = useState(1);
    const [coursePage, setCoursePage] = useState(1);

    const searchParams = useSearchParams();
    const filter = searchParams.get('filter'),
        query = searchParams.get('query'),
        sort = searchParams.get('sort'),
        profile = searchParams.get('profile')?.toUpperCase();
    const accountQuery = useQuery(ACCOUNT_SEARCH, {
        variables: {
            grade: searchParams.get('grade'),
            page: accountsPage,
            pageSize: getPageSize(filter),
            profile: profile,
            query,
            sort,
        },
    });

    const courseQuery = useQuery(COURSE_SEARCH, {
        variables: {
            availability: searchParams.get('availability'),
            page: coursePage,
            pageSize: getPageSize(filter),
            profile: profile,
            query,
            sort,
            type: searchParams.get('course'),
        },
    });

    // go back to 1st page on query change
    useEffect(() => {
        setAccountsPage(1);
        setCoursePage(1);
    }, [query]);

    const numAccResults = accountQuery.data?.accountSearch.total || 0;
    const numCourseResults = courseQuery.data?.courseSearch.total || 0;

    const numResults = useMemo(() => {
        switch (filter) {
            case 'account':
                return numAccResults;
            case 'course':
                return numCourseResults;
            default:
                return numAccResults + numCourseResults;
        }
    }, [filter, numAccResults, numCourseResults]);

    const renderAccounts = useMemo(
        () =>
            accountQuery.loading
                ? Array(4)
                      .fill(null)
                      .map((_, index) => (
                          <Grid item key={index} sm={3}>
                              <AccountCard isLoading />
                          </Grid>
                      ))
                : accountQuery.data.accountSearch.results.map(
                      ({ user, accountType }) => (
                          <Grid item key={user.id} sm={'auto'}>
                              <AccountCard
                                  accountType={accountType}
                                  userID={user.id}
                              />
                          </Grid>
                      )
                  ),
        [accountQuery]
    );

    const renderCourses = useMemo(
        () =>
            courseQuery.loading
                ? Array(4)
                      .fill(null)
                      .map((_, index) => (
                          <Grid item key={index} sm={3}>
                              <CourseCard isLoading />
                          </Grid>
                      ))
                : courseQuery.data?.courseSearch.results.map(({ id }) => (
                      <Grid item key={id} sm={3}>
                          <CourseCard courseID={id} />
                      </Grid>
                  )),
        [courseQuery]
    );

    if (
        !(courseQuery.isLoading || accountQuery.isLoading) &&
        numResults === 0
    ) {
        return <NoResultsPage />;
    }

    return (
        <Grid className='search-results' container>
            <Grid item xs={12} className='main-search-view'>
                {filter && (
                    <Grid className='prevResults' item xs={12}>
                        <BackButton
                            btnText='To All Search Results'
                            style={{ marginBottom: '2vh' }}
                        />
                    </Grid>
                )}
                <Grid className='searchResults' item xs={12}>
                    <Typography
                        align='left'
                        className='search-title'
                        variant='h1'
                    >
                        {numResults} Search Result{numResults !== 1 && 's'} for{' '}
                        {filter && capitalizeString(filter)} {`"${query}"`}
                    </Typography>
                </Grid>
                {filter !== 'course' && (
                    <div className='account-results-wrapper'>
                        {filter === 'account' && (
                            <Grid item xs={12}>
                                <AccountFilters />
                            </Grid>
                        )}
                        {numAccResults !== 0 && (
                            <hr style={{ marginBottom: '48px' }} />
                        )}
                        <Grid item xs={12}>
                            <Grid
                                alignItems='center'
                                container
                                direction='row'
                                justify='space-between'
                                style={{ marginBottom: '24px' }}
                            >
                                <Grid className='searchResults' item>
                                    <Typography
                                        align='left'
                                        className='resultsColor'
                                        gutterBottom
                                    >
                                        {numAccResults > 0 && 'Accounts'}
                                    </Typography>
                                </Grid>
                                {numAccResults > 0 && filter !== 'account' && (
                                    <Grid item>
                                        <Link
                                            to={{
                                                pathname: '/search/',
                                                search: `?query=${query}&filter=account`,
                                            }}
                                        >
                                            <LabelBadge variant='outline-gray'>
                                                See All Accounts
                                            </LabelBadge>
                                        </Link>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid container direction='row' spacing={2}>
                                {renderAccounts}
                            </Grid>
                            {numAccResults > getPageSize(filter) && (
                                <div className='results-nav'>
                                    <IconButton
                                        className='less'
                                        disabled={accountsPage === 1}
                                        onClick={changePage(
                                            setAccountsPage,
                                            -1
                                        )}
                                    >
                                        <LessResultsIcon />
                                    </IconButton>
                                    {accountsPage}
                                    <IconButton
                                        className='more'
                                        disabled={
                                            accountsPage *
                                                getPageSize(filter) >=
                                            numAccResults
                                        }
                                        onClick={changePage(setAccountsPage, 1)}
                                    >
                                        <MoreResultsIcon />
                                    </IconButton>
                                </div>
                            )}
                        </Grid>
                    </div>
                )}
                {filter !== 'account' && (
                    <div className='course-results-wrapper'>
                        {filter === 'course' && (
                            <Grid item xs={12}>
                                <CourseFilters />
                            </Grid>
                        )}
                        {numCourseResults !== 0 && (
                            <hr style={{ marginBottom: '48px' }} />
                        )}
                        <Grid item xs={12}>
                            <Grid
                                alignItems='center'
                                container
                                direction='row'
                                justify='space-between'
                            >
                                <Grid className='searchResults' item>
                                    <Typography
                                        align='left'
                                        className='resultsColor'
                                    >
                                        {numAccResults > 0 && 'Courses'}
                                        {/* {numCourseResults > 0 &&
                                                filter !== "course" &&
                                                "Courses"} */}
                                    </Typography>
                                </Grid>
                                {numCourseResults > 0 && filter !== 'course' && (
                                    <Grid item>
                                        <Link
                                            to={{
                                                pathname: '/search/',
                                                search: `?query=${query}&filter=course`,
                                            }}
                                        >
                                            <LabelBadge variant='outline-gray'>
                                                See All Courses
                                            </LabelBadge>
                                        </Link>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid container direction='row' spacing={1}>
                                {renderCourses}
                            </Grid>
                        </Grid>
                        {numCourseResults > getPageSize(filter) && (
                            <div className='results-nav'>
                                <IconButton
                                    className='less'
                                    disabled={coursePage === 1}
                                    onClick={changePage(setCoursePage, -1)}
                                >
                                    <LessResultsIcon />
                                </IconButton>
                                {coursePage}
                                <IconButton
                                    className='more'
                                    disabled={
                                        coursePage * getPageSize(filter) >=
                                        numCourseResults
                                    }
                                    onClick={changePage(setCoursePage, 1)}
                                >
                                    <MoreResultsIcon />
                                </IconButton>
                            </div>
                        )}
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

export default SearchResults;
