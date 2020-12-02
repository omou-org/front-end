import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/EditOutlined';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import gql from 'graphql-tag';

import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import Loading from '../../OmouComponents/Loading';
import BackgroundPaper from '../../OmouComponents/BackgroundPaper';
import BackButton from '../../OmouComponents/BackButton';
import ChromeTabs from '../../OmouComponents/ChromeTabs';
import TabPanel from '../../OmouComponents/TabPanel';
import ClassInfo from './ClassInfo';
import Announcements from './Announcements';
import ClassEnrollmentList from './ClassEnrollmentList';
import ClassSessionContainer from './ClassSessionContainer';
import { useSelector } from 'react-redux';
import { gradeLvl } from '../../../utils';
import theme from '../../../theme/muiTheme';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';
import { USER_TYPES } from '../../../utils';
import { StudentCourseLabel } from './StudentBadge';
import { filterEvent } from 'actions/calendarActions';
import { GET_STUDENTS } from './CourseManagementContainer';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    editcoursebutton: {
        border: '1px solid #999999',
        height: '2.25em',
        borderRadius: '0',
        width: '2.25em',
        float: 'right',
        marginRight: '2.3em',
        marginTop: '2.1em',
    },
    alignTitleLeft: {
        textAlign: 'left',
        fontWeight: '300',
        [theme.breakpoints.between('sm', 'lg')]: {
            fontSize: '.75rem',
        },
    },
    dataFontDate: {
        fontWeight: '400',
        [theme.breakpoints.between('sm', 'lg')]: {
            fontSize: '.8rem',
        },
    },
    dividerColor: {
        backgroundColor: 'black',
    },
}));

export const GET_ANNOUNCEMENTS = gql`
    query getAnnouncement($id: ID!) {
        announcements(courseId: $id) {
            subject
            id
            body
            createdAt
            updatedAt
            poster {
                firstName
                lastName
            }
        }
    }
`;

export const GET_CLASSES = gql`
    query getClass($id: ID!) {
        course(courseId: $id) {
            academicLevel
            courseCategory {
                name
                id
            }
            title
            startDate
            endDate
            description
            courseLink
            courseLinkDescription
            courseLinkUpdatedAt
            instructor {
                user {
                    firstName
                    lastName
                }
            }
            enrollmentSet {
                student {
                    user {
                        firstName
                        lastName
                        id
                    }
                    primaryParent {
                        user {
                            firstName
                            lastName
                            id
                            email
                        }
                        accountType
                        phoneNumber
                    }
                    accountType
                }
            }
            sessionSet {
                startDatetime
                id
            }
            availabilityList {
                startTime
                endTime
                dayOfWeek
            }
        }
        enrollments(courseId: $id) {
            student {
                user {
                    id
                }
            }
        }
    }
`;

const CourseClasses = () => {
    const { id } = useParams();
    const classes = useStyles();
    const [index, setIndex] = useState(0);

    const { email, accountType, user } = useSelector(({ auth }) => auth) || [];
    const [studentInCourse, setStudentInCourse] = useState([]);

    const tabLabels =
        accountType === 'PARENT'
            ? [
                  { label: 'About Course' },
                  { label: 'Announcements' },
                  { label: 'Attendance' },
              ]
            : [
                  { label: 'About Course' },
                  { label: 'Announcements' },
                  { label: 'Student Enrolled' },
                  { label: 'Sessions' },
              ];

    const { data, loading, error } = useQuery(GET_CLASSES, {
        variables: {
            id: id,
        },
    });

    const getAnnouncements = useQuery(GET_ANNOUNCEMENTS, {
        variables: {
            id: id,
        },
    });

    const {
        data: studentData,
        loading: studentLoading,
        error: studentError,
    } = useQuery(GET_STUDENTS, {
        variables: { accountId: user.id },
        onCompleted: () => {
            studentData.parent.studentList.map(({ enrollmentSet, user }) => {
                enrollmentSet.map(({ course }) => {
                    if (course.id === id) {
                        setStudentInCourse((prevState) => [
                            ...prevState,
                            `${user.firstName} ${user.lastName}`,
                        ]);
                    }
                });
            });
        },
    });

    if (loading || getAnnouncements.loading || studentLoading)
        return <Loading />;
    if (error) return console.error(error);
    if (studentError) return console.error(studentError);

    if (getAnnouncements.error)
        return console.error(getAnnouncements.error.message);

    const {
        academicLevel,
        courseLink,
        courseLinkDescription,
        courseLinkUpdatedAt,
        endDate,
        endTime,
        enrollmentSet,
        startDate,
        startTime,
        title,
        sessionSet,
    } = data.course;

    const { name } = data.course.courseCategory;
    const { firstName, lastName } = data.course.instructor.user;

    const abbreviatedDay = moment(startDate).format('ddd');
    const startingTime = moment(startTime, 'HH:mm').format('h:mm A');
    const endingTime = moment(endTime, 'HH:mm').format('h:mm A');
    const startingDate = moment(startDate).calendar();
    const endingDate = moment(endDate).calendar();

    const handleChange = (_, i) => setIndex(i);

    const comparison = (studentList, enrollmentArray) => {
        if (accountType === 'PARENT') {
            for (const studentId of enrollmentArray) {
                return studentList?.includes(studentId.student.user.id);
            }
        } else {
            return true;
        }
    };

    // match the enrollment set course id with current course id.

    // set in state students are in this class

    const tabSelection = () => {
        switch (index) {
            case 0:
                return classes.chromeTabStart;
            case tabLabels.length - 1:
                return classes.chromeTabEnd;
            default:
                return classes.chromeTab;
        }
    };

    return (
        <Grid item xs={12}>
            <BackgroundPaper elevation={2}>
                <Grid container justify="space-between" alignContent="center">
                    <Grid item>
                        <BackButton />
                    </Grid>
                    <Grid item>
                        {studentInCourse.map((student, i) => (
                            <StudentCourseLabel label={student} key={i} />
                        ))}
                    </Grid>
                </Grid>
                <Hidden xsDown>
                    <hr />
                </Hidden>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography
                            align="left"
                            className="heading"
                            variant="h3"
                            style={{ marginTop: '.65em' }}
                        >
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <AccessControlComponent
                            permittedAccountTypes={[
                                USER_TYPES.admin,
                                USER_TYPES.receptionist,
                                USER_TYPES.instructor,
                            ]}
                        >
                            <IconButton
                                className={classes.editcoursebutton}
                                size="small"
                                component={Link}
                                to={`/registration/form/course_details/${id}`}
                            >
                                <EditIcon />
                            </IconButton>
                        </AccessControlComponent>
                    </Grid>
                </Grid>
                <Grid
                    container
                    justify="flex-start"
                    style={{ marginTop: '2.5em' }}
                >
                    <Grid item xs={2} md={4} lg={3} xl={2}>
                        <Typography
                            variant="body2"
                            align="left"
                            className={classes.alignTitleLeft}
                        >
                            Date
                        </Typography>
                        <Typography
                            variant="body1"
                            align="left"
                            className={classes.dataFontDate}
                        >
                            {`${startingDate} - ${endingDate}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} md={4} lg={3} xl={2}>
                        <Typography
                            variant="body2"
                            align="left"
                            className={classes.alignTitleLeft}
                        >
                            Time
                        </Typography>
                        <Typography
                            variant="body1"
                            align="left"
                            className={classes.dataFontDate}
                        >
                            {`${abbreviatedDay} ${startingTime} - ${endingTime}`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    justify="flex-start"
                    style={{ marginTop: '2em' }}
                >
                    <Grid item xs={2} md={4} lg={2} xl={2}>
                        <Typography
                            variant="body2"
                            align="left"
                            className={classes.alignTitleLeft}
                        >
                            Instructor
                        </Typography>
                        <Typography
                            variant="body1"
                            align="left"
                            className={classes.dataFontDate}
                        >
                            {`${firstName} ${lastName}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} md={4} lg={2} xl={2}>
                        <Typography
                            variant="body2"
                            align="left"
                            className={classes.alignTitleLeft}
                        >
                            Grade
                        </Typography>
                        <Typography
                            variant="body1"
                            align="left"
                            className={classes.dataFontDate}
                        >
                            {gradeLvl(academicLevel)}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} md={4} lg={2} xl={2}>
                        <Typography
                            variant="body2"
                            align="left"
                            className={classes.alignTitleLeft}
                        >
                            Subject
                        </Typography>
                        <Typography
                            variant="body1"
                            align="left"
                            className={classes.dataFontDate}
                        >
                            {name}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container style={{ marginTop: '2.5em' }}>
                    <Grid item xs={12} sm={12}>
                        <ThemeProvider theme={theme}>
                            <Toolbar disableGutters>
                                <ChromeTabs
                                    className={tabSelection()}
                                    tabs={
                                        comparison(
                                            data.parent?.studentList,
                                            data.enrollments
                                        )
                                            ? tabLabels
                                            : [{ label: 'About Course' }]
                                    }
                                    tabStyle={{
                                        bgColor: '#ffffff',
                                        selectedBgColor: '#EBFAFF',
                                        color: 'rgba(102, 102, 102, 0.87)',
                                        topMargin: '1.1em',
                                        leftValue: 0,
                                        rightValue: 0,
                                    }}
                                    tabProps={{
                                        disableRipple: true,
                                    }}
                                    value={index}
                                    onChange={handleChange}
                                />
                            </Toolbar>
                            <Divider classes={{ root: classes.dividerColor }} />
                            <Grid container>
                                <TabPanel
                                    index={0}
                                    value={index}
                                    backgroundColor="#FFFFFF"
                                    style={{ width: '100%' }}
                                >
                                    <ClassInfo
                                        id={id}
                                        courseLink={courseLink}
                                        courseLinkDescription={
                                            courseLinkDescription
                                        }
                                        courseLinkUpdatedAt={
                                            courseLinkUpdatedAt
                                        }
                                    />
                                </TabPanel>

                                <TabPanel index={1} value={index}>
                                    <Announcements
                                        announcementsData={
                                            getAnnouncements.data.announcements
                                        }
                                        loggedInUser={data.accountSearch}
                                    />
                                </TabPanel>
                                <AccessControlComponent
                                    permittedAccountTypes={[USER_TYPES.parent]}
                                >
                                    <TabPanel index={2} value={index}>
                                        <h1>Hello</h1>
                                    </TabPanel>
                                </AccessControlComponent>

                                <AccessControlComponent
                                    permittedAccountTypes={[
                                        USER_TYPES.admin,
                                        USER_TYPES.receptionist,
                                        USER_TYPES.instructor,
                                    ]}
                                >
                                    <TabPanel index={2} value={index}>
                                        <ClassEnrollmentList
                                            enrollmentList={enrollmentSet}
                                        />
                                    </TabPanel>
                                    <TabPanel index={3} value={index}>
                                        <ClassSessionContainer
                                            sessionList={sessionSet}
                                        />
                                    </TabPanel>
                                </AccessControlComponent>
                            </Grid>
                        </ThemeProvider>
                    </Grid>
                </Grid>
            </BackgroundPaper>
        </Grid>
    );
};

export default CourseClasses;
