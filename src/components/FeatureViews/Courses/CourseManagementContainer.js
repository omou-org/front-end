import React, { useState } from 'react';
import { useSelector, useDispatch, useEffect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import Divder from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loading from '../../OmouComponents/Loading';
import axios from "axios"; 
import * as actions from "actions/actionTypes";
import googleClassroomLogo from "../../GoogleClassroomIcon.png";
import Tooltip from '@material-ui/core/Tooltip';

import { UserAvatarCircle, StudentCourseLabel } from './StudentBadge';
import { fullName, gradeOptions } from 'utils';
import moment from 'moment';
import theme, {
    highlightColor,
    activeColor,
    pastColor,
} from '../../../theme/muiTheme';

export const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #43B5D9',
        fontSize: 16,
        padding: '6px 26px 6px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    containerMargins: {
        marginTop: '1.25em',
        marginBottom: '1.25em',
    },
    margin: {
        margin: theme.spacing(1.5),
        minWidth: '12.8125em',
        [theme.breakpoints.down('md')]: {
            minWidth: '10em',
        },
    },
    appBar: {
        maxWidth: 'calc(100% - 3%)',
        marginLeft: '1.5em',
        marginTop: '1.5em',
        border: '1px solid #43B5D9',
    },
    dropdown: {
        border: '1px solid #43B5D9',
        borderRadius: '5px',
    },
    menuSelect: {
        '&:hover': { backgroundColor: highlightColor, color: '#28ABD5' },
        '&:focus': highlightColor,
        display: 'flex',
    },
    menuSelected: {
        backgroundColor: `${highlightColor} !important`,
    },
    highlightName: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '1.15rem',
        lineHeigh: '1.25em',
        color: '#28ABD5',
    },
    displayCardMargins: {
        marginTop: '1em',
        marginBottom: '1em',
        [theme.breakpoints.down('md')]: {
            fontSize: '.85rem',
        },
    },
    chipSize: {
        height: '2.0625em',
        width: '6.5em',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '1rem',
        color: '#FFFFFF',
    },
    mainCardContainer: {
        paddingTop: '25px',
        paddingBottom: '25px',
        width: '100%',
        paddingLeft: '24px',
        height: '115px',
        '&:hover': {
            backgroundColor: highlightColor,
        },
    },
}));

export const GET_STUDENTS = gql`
    query getStudents($accountId: ID!) {
        parent(userId: $accountId) {
            user {
                id
            }
            studentList {
                user {
                    firstName
                    id
                    lastName
                    email
                }
                enrollmentSet {
                    course {
                        id
                        title
                    }
                }
            }
        }
    }
`;

const ClassListItem = ({
    title,
    endDate,
    activeAvailabilityList,
    startDate,
    instructor,
    id,
    googleClassCode,
    studentList,
}) => {
    const classes = useStyles();
    let history = useHistory();
    const concatFullName = fullName(instructor.user);
    const abbreviatedDay = moment(startDate).format('dddd');
    const startingTime = moment(
        activeAvailabilityList[0].startTime,
        'HH:mm'
    ).format('h:mm');
    const endingTime = moment(
        activeAvailabilityList[0].endTime,
        'HH:mm'
    ).format('h:mma');
    const startingDate = moment(startDate).format('MMM D YYYY');
    const endingDate = moment(endDate).format('MMM D YYYY');
    const isActive = moment(startDate).isSameOrBefore(endDate);

    const { google_courses } = useSelector(({ auth }) => auth);
    const [courses, setCourses] = useState();
    const dispatch = useDispatch();

    const handleClick = (e) => history.push(`/coursemanagement/class/${id}`);

    function GoogleClassroomIntegrationIcon(googleCode){
      let isIntegrated = false;
      if(googleCode && google_courses){
        google_courses.forEach(function(course) {
          if(course.enrollmentCode == googleCode){
            isIntegrated = true;
          } 
        });
        return isIntegrated ? <img src={googleClassroomLogo} width="30" height="30"/> : <div></div>;
      } 
      return;
    }   

  return (
        <>
            <Grid
                container
                justify="flex-start"
                className={classes.mainCardContainer}
                data-active="inactive"
                onClick={handleClick}
            >
                <Grid container md={10}>
                    <Grid
                        item
                        xs={2}
                        sm={3}
                        md={2}
                        style={{ textAlign: 'left' }}
                    >
                        <Chip
                            label={isActive ? 'ACTIVE' : 'PAST'}
                            className={classes.chipSize}
                            style={{
                                backgroundColor: isActive
                                    ? activeColor
                                    : pastColor,
                            }}
                        />
                    </Grid>
                    <Grid item xs={9} sm={8} md={9}>
                        <Typography
                            variant="h3"
                            align="left"
                            style={{ marginLeft: '.85em' }}
                        >
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        {GoogleClassroomIntegrationIcon(googleClassCode)}        
                    </Grid>

                    <Grid
                        item
                        xs={3}
                        sm={4}
                        md={2}
                        className={classes.displayCardMargins}
                    >
                        <Typography variant="body1" align="left">
                            <span className={classes.highlightName}>
                                {concatFullName}
                            </span>
                        </Typography>
                    </Grid>
                    <Divder
                        orientation="vertical"
                        flexItem
                        style={{ height: '2em', marginTop: '1em' }}
                    />
                    <Grid item>
                        <Typography
                            variant="body1"
                            align="left"
                            style={{ marginLeft: '1.2em', paddingTop: '3px' }}
                            className={classes.displayCardMargins}
                        >
                            {` ${startingDate} - ${endingDate}`}
                        </Typography>
                    </Grid>
                    <Divder
                        orientation="vertical"
                        flexItem
                        style={{
                            height: '2em',
                            marginTop: '1em',
                            marginLeft: '1em',
                        }}
                    />
                    <Grid item>
                        <Typography
                            variant="body1"
                            align="left"
                            style={{ marginLeft: '1.2em', paddingTop: '3px' }}
                            className={classes.displayCardMargins}
                        >
                            {`${abbreviatedDay} ${startingTime} - ${endingTime} `}
                        </Typography>
                    </Grid>
                </Grid>
                {studentList && (
                    <Grid item xs={2}>
                        {studentList
                            .filter((student) =>
                                JSON.parse(student.value).includes(id)
                            )
                            .map(({ label }) => (
                                <StudentCourseLabel label={label} />
                            ))}
                    </Grid>
                )}
            </Grid>
            <Divder />
        </>
    );
};

const CourseFilterDropdown = ({
    initialValue,
    filterList,
    setState,
    filter,
    filterKey,
}) => {
    const classes = useStyles();
    const handleChange = (event) => setState(event.target.value);
    const filterOptionsMapper = {
        instructors: (option) => ({
            value: option.instructor.user.id,
            label: fullName(option.instructor.user),
        }),
        subjects: (option) => ({
            value: option.courseCategory.id,
            label: option.courseCategory.name,
        }),
        grades: (option) => ({
            value: option.value.toUpperCase(),
            label: option.label,
        }),
        students: (option) => ({
            value: option.value,
            label: option.label,
        }),
    }[filterKey];

    const ChosenFiltersOption = filterList.map(filterOptionsMapper);

    return (
        <Grid item xs={3}>
            <FormControl className={classes.margin}>
                <Select
                    labelId="course-management-sort-tab"
                    id="course-management-sort-tab"
                    displayEmpty
                    value={filter}
                    onChange={handleChange}
                    classes={{ select: classes.menuSelect }}
                    input={<BootstrapInput />}
                    MenuProps={{
                        classes: { list: classes.dropdown },
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                        },
                        getContentAnchorEl: null,
                    }}
                >
                    <MenuItem
                        ListItemClasses={{ selected: classes.menuSelected }}
                        value=""
                    >
                        {initialValue}
                    </MenuItem>
                    {ChosenFiltersOption.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            className={classes.menuSelect}
                            ListItemClasses={{ selected: classes.menuSelected }}
                        >
                            {filterKey === 'students' ? (
                                <UserAvatarCircle label={option.label} />
                            ) : (
                                ''
                            )}
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
};

const CourseManagementContainer = () => {
    const classes = useStyles();
    const [sortByDate, setSortByDate] = useState('');
    const [gradeFilterValue, setGradeFilterValue] = useState('');
    const [subectFilterValue, setSubjectFilterValue] = useState('');
    const [instructorsFilterValue, setInstructorFilterValue] = useState('');
    const [studentFilterValue, setStudentFilterValue] = useState('');
    const accountInfo = useSelector(({ auth }) => auth);
    const dispatch = useDispatch();

    const handleChange = (event) => setSortByDate(event.target.value);

    const checkAccountForQuery =
        accountInfo.accountType === 'ADMIN' ||
        accountInfo.accountType === 'INSTRUCTOR'
            ? 'instructorId'
            : 'parentId';

    const accountId =
        accountInfo.accountType === 'ADMIN' ? '' : accountInfo.user.id;

    const GET_COURSES = gql`
    query getCourses($accountId:ID!) {
      courses(${checkAccountForQuery}: $accountId) {
        endDate
        title
        academicLevel
        startDate
        courseId
        id
        activeAvailabilityList {
          dayOfWeek
          endTime
          startTime
        }
        instructor {
          user {
            firstName
            lastName
            id
          }
        }
        googleClassCode
        courseCategory {
          id
          name
        }
      }
    }
  `;

    const {
        data: courseData,
        loading: courseLoading,
        error: courseError,
    } = useQuery(GET_COURSES, {
        variables: { accountId },

    });

    const { data, loading, error } = useQuery(GET_COURSES, {
        variables: { accountId },
        onCompleted: (data) => {
          dispatch({
            type: actions.STORE_COURSES, 
            payload: {courses: data.courses}
          })
        }});

    const {
        data: studentData,
        loading: studentLoading,
        error: studentError,
    } = useQuery(GET_STUDENTS, {
        variables: { accountId },
        skip: accountInfo.accountType !== 'PARENT',
    });

    if (courseLoading || studentLoading) return <Loading />;
    if (courseError) return console.error(courseError.message);
    if (studentError) return console.error(studentError.message);

    const createFilteredListFromCourses = (filterCondition) =>
        courseData.courses.reduce(
            (accumulator, currentValue) =>
                !accumulator.some((course) =>
                    filterCondition(currentValue, course)
                )
                    ? [...accumulator, currentValue]
                    : accumulator,
            []
        );
    const subjectList = createFilteredListFromCourses(
        (currentValue, course) =>
            currentValue.courseCategory.id === course.courseCategory.id
    );
    const instructorsList = createFilteredListFromCourses(
        (currentValue, course) =>
            currentValue.instructor.user.id === course.instructor.user.id
    );

    const checkFilter = (value, filter) => '' === filter || value === filter;
    const checkStudentEnrolled = (value, filter) =>
        '' === filter || filter.includes(value);
    const sortDescOrder = (firstEl, secondEl) => (firstEl < secondEl ? -1 : 0);
    const defaultCourseDisplay = courseData.courses
        .filter(
            (course) =>
                checkFilter(course.academicLevel, gradeFilterValue) &&
                checkFilter(course.courseCategory.id, subectFilterValue) &&
                checkFilter(
                    course.instructor.user.id,
                    instructorsFilterValue
                ) &&
                checkStudentEnrolled(course.id, studentFilterValue)
        )
        .sort(
            (firstEl, secondEl) =>
                ({
                    start_date: sortDescOrder(
                        firstEl.startDate,
                        secondEl.startDate
                    ),
                    class_name: sortDescOrder(firstEl.title, secondEl.title),
                }[sortByDate])
        );

    let studentOptionList;
    if (accountInfo.accountType === 'PARENT')
        studentOptionList = studentData.parent.studentList.map((student) => ({
            label: `${student.user.firstName} ${student.user.lastName}`,
            value: JSON.stringify(
                student.enrollmentSet.map(({ course }) => course.id)
            ),
        }));

    return (
        <Grid item xs={12}>
            <Grid container direction="row">
                <Grid item xs={6}>
                    <Typography align="left" className="heading" variant="h1">
                        Course Management
                    </Typography>
                </Grid>

                {accountInfo.accountType === 'PARENT' && (
                    <Grid
                        item
                        align="right"
                        style={{ paddingRight: '2em' }}
                        xs={6}
                    >
                        <CourseFilterDropdown
                            filterList={studentOptionList}
                            initialValue="All Students"
                            setState={setStudentFilterValue}
                            filter={studentFilterValue}
                            filterKey="students"
                        />
                    </Grid>
                )}
            </Grid>

            <Grid
                container
                alignItems="center"
                className={classes.containerMargins}
            >
                <Grid item xs={3}>
                    <FormControl className={classes.margin}>
                        <Select
                            labelId="course-management-sort-tab"
                            id="course-management-sort-tab"
                            displayEmpty
                            value={sortByDate}
                            onChange={handleChange}
                            classes={{ select: classes.menuSelect }}
                            input={<BootstrapInput />}
                            MenuProps={{
                                classes: { list: classes.dropdown },
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                },
                                getContentAnchorEl: null,
                            }}
                        >
                            {sortByDate === '' && (
                                <MenuItem
                                    ListItemClasses={{
                                        selected: classes.menuSelected,
                                    }}
                                    value=""
                                >
                                    Sort By
                                </MenuItem>
                            )}
                            <MenuItem
                                className={classes.menuSelect}
                                value={'start_date'}
                                ListItemClasses={{
                                    selected: classes.menuSelected,
                                }}
                            >
                                Start Date (Latest)
                            </MenuItem>
                            <MenuItem
                                className={classes.menuSelect}
                                value={'class_name'}
                                ListItemClasses={{
                                    selected: classes.menuSelected,
                                }}
                            >
                                Class Name(A-Z)
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <CourseFilterDropdown
                    filterList={gradeOptions}
                    initialValue="All Grades"
                    setState={setGradeFilterValue}
                    filter={gradeFilterValue}
                    filterKey="grades"
                />
                <CourseFilterDropdown
                    filterList={subjectList}
                    initialValue="All Subjects"
                    setState={setSubjectFilterValue}
                    filter={subectFilterValue}
                    filterKey="subjects"
                />
                <CourseFilterDropdown
                    filterList={instructorsList}
                    initialValue="All Instructors"
                    setState={setInstructorFilterValue}
                    filter={instructorsFilterValue}
                    filterKey="instructors"
                />
            </Grid>
            <hr />

            {/* course data is displayed here */}
            {defaultCourseDisplay.map(
                ({
                    title,
                    endDate,
                    activeAvailabilityList,
                    startDate,
                    instructor,
                    id,
                    googleClassCode,
                }) => (
                    <ClassListItem
                        title={title}
                        endDate={endDate}
                        activeAvailabilityList={activeAvailabilityList}
                        startDate={startDate}
                        instructor={instructor}
                        id={id}
                        key={title}
                        studentList={studentOptionList}
                        googleClassCode={googleClassCode}
                    />
                )
            )}
        </Grid>
    );
};

export default CourseManagementContainer;
