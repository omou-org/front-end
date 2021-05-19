import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/EditOutlined';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import Loading from '../../OmouComponents/Loading';
import TabPanel from '../../OmouComponents/TabPanel';
import ClassInfo from './ClassInfo';
import Announcements from './Announcements';
import ClassEnrollmentList from './ClassEnrollmentList';
import ClassSessionContainer from './ClassSessionContainer';
import { useSelector } from 'react-redux';
import { fullName, gradeLvl, USER_TYPES } from 'utils';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';
import AttendanceContainer from './AttendanceContainer';
import { StudentCourseLabel } from './StudentBadge';
import { GET_STUDENTS } from './CourseManagementContainer';
import { CourseAvailabilites } from '../../OmouComponents/CourseAvailabilities';
import Notes from '../Notes/Notes';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GoolgeClassroomIntegrationicon from '../../OmouComponents/GoogleClassroomIntegrationIcon';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    editcoursebutton: {
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

export const GET_CLASS = gql`
    query getClass($id: ID!) {
        course(courseId: $id) {
            id
            academicLevel
            title
            startDate
            endDate
            description
            googleClassCode
            courseLink
            courseLinkDescription
            courseLinkUpdatedAt
            courseLinkUser {
                firstName
                lastName
                id
            }
            courseCategory {
                name
                id
            }
            activeAvailabilityList {
                dayOfWeek
                endTime
                startTime
                id
            }
            instructor {
                user {
                    firstName
                    lastName
                    id
                }
            }
            enrollmentSet {
                id
                student {
                    user {
                        firstName
                        lastName
                        id
                        email
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
                        studentIdList
                    }
                    studentschoolinfoSet {
                        textbook
                        teacher
                        name
                        id
                    }
                    accountType
                    userUuid
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
                id
            }
            courseId
        }
        enrollments(courseId: $id) {
            id
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
                        email
                        id
                    }
                    accountType
                    phoneNumber
                }
            }
        }
        announcements(courseId: $id) {
            subject
            id
            body
            createdAt
            updatedAt
            poster {
                firstName
                lastName
                id
            }
        }
    }
`;

const CourseClass = () => {
    const { id } = useParams();
    const classes = useStyles();
    const [index, setIndex] = useState(0);

    const { accountType, user } = useSelector(({ auth }) => auth) || [];
    const [studentInCourse, setStudentInCourse] = useState([]);

    const adminTabs = [
        { label: 'About Course' },
        { label: 'Announcements' },
        { label: 'Student Enrolled' },
        { label: 'Sessions' },
        { label: 'Attendance' },
        { label: 'Notes' },
    ];

    const parentTabWithStudentEnrolledTabs = [
        { label: 'About Course' },
        { label: 'Announcements' },
        { label: 'Student Enrolled' },
        { label: 'Sessions' },
    ];

    const parentNostudentEnrolledTab = [{ label: 'About Course' }];
    const { data, loading, error } = useQuery(GET_CLASS, {
        fetchPolicy: 'network-only',
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
        skip: accountType !== 'PARENT',
        onCompleted: () => {
            if (accountType === 'PARENT') {
                const identifyCourseHasEnrolledStudent = ({
                    course,
                    student: { user },
                }) => {
                    const isStudentEnrolledInCurrentCourse = (courseId) =>
                        courseId === id;
                    if (isStudentEnrolledInCurrentCourse(course.id)) {
                        const updateStudentsInCourseList = (prevState) => [
                            ...prevState,
                            `${user.firstName} ${user.lastName}`,
                        ];
                        setStudentInCourse(updateStudentsInCourseList);
                    }
                };
                studentData.parent.studentList.forEach(({ enrollmentSet }) => {
                    enrollmentSet.forEach(identifyCourseHasEnrolledStudent);
                });
            }
        },
    });

    if (loading || studentLoading) return <Loading />;
    if (error || studentError) return console.error(error);

    const {
        academicLevel,
        courseLink,
        courseLinkDescription,
        courseLinkUpdatedAt,
        endDate,
        enrollmentSet,
        startDate,
        description,
        title,
        activeAvailabilityList,
        sessionSet,
        courseLinkUser,
        googleClassCode,
    } = data.course;

    const { name: courseCategory } = data.course.courseCategory;

    const startingDate = moment(startDate).format('L');
    const endingDate = moment(endDate).format('L');

    const handleChange = (_, i) => setIndex(i);

    const setTabsForAccountTypes = (
        accountType,
        studentList,
        enrollmentArray
    ) => {
        switch (accountType) {
            case 'PARENT':
                if (
                    checkIfParentHasStudentEnrolled(
                        studentList,
                        enrollmentArray
                    )
                ) {
                    return parentTabWithStudentEnrolledTabs;
                }
                return parentNostudentEnrolledTab;
            default:
                return adminTabs;
        }
    };

    const checkIfParentHasStudentEnrolled = (studentList, enrollmentArray) => {
        if (accountType === 'PARENT') {
            for (const studentId of enrollmentArray) {
                return studentList?.includes(studentId.student.user.id);
            }
        } else {
            return true;
        }
    };

    const tabSelection = () => {
        switch (index) {
            case 0:
                return classes.chromeTabStart;
            case adminTabs.length - 1:
                return classes.chromeTabEnd;
            default:
                return classes.chromeTab;
        }
    };
    return (
        <Grid item xs={12}>
            <Grid container justify='space-between' alignContent='center'>
                <Grid item />
                <Grid item>
                    {accountType === 'PARENT' &&
                        studentInCourse.map((student, i) => (
                            <StudentCourseLabel label={student} key={i} />
                        ))}
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={6}>
                    <Typography
                        align='left'
                        className='heading'
                        variant='h1'
                        style={{ marginTop: '.65em' }}
                    >
                        {title}
                        {accountType === 'ADMIN' && (
                            <GoolgeClassroomIntegrationicon
                                googleCode={googleClassCode}
                                style={{ marginLeft: '24px' }}
                            />
                        )}
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
                            size='small'
                            component={Link}
                            to={`/form/course_details/edit/${id}`}
                        >
                            <EditIcon />
                        </IconButton>
                    </AccessControlComponent>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' style={{ marginTop: '2.5em' }}>
                <Grid item xs={2} md={4} lg={3} xl={2}>
                    <Typography
                        variant='body2'
                        align='left'
                        className={classes.alignTitleLeft}
                    >
                        Date
                    </Typography>
                    <Typography
                        variant='body1'
                        align='left'
                        className={classes.dataFontDate}
                    >
                        {`${startingDate} - ${endingDate}`}
                    </Typography>
                </Grid>
                <Grid item xs={2} md={4} lg={3} xl={2}>
                    <Typography
                        variant='body2'
                        align='left'
                        className={classes.alignTitleLeft}
                    >
                        Time(s)
                    </Typography>
                    <Typography
                        variant='body1'
                        align='left'
                        className={classes.dataFontDate}
                    >
                        <CourseAvailabilites
                            availabilityList={activeAvailabilityList}
                        />
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' style={{ marginTop: '2em' }}>
                <Grid item xs={2} md={4} lg={2} xl={2}>
                    <Typography
                        variant='body2'
                        align='left'
                        className={classes.alignTitleLeft}
                    >
                        Instructor
                    </Typography>
                    <Typography
                        variant='body1'
                        align='left'
                        className={classes.dataFontDate}
                    >
                        {fullName(data.course.instructor.user)}
                    </Typography>
                </Grid>
                <Grid item xs={2} md={4} lg={2} xl={2}>
                    <Typography
                        variant='body2'
                        align='left'
                        className={classes.alignTitleLeft}
                    >
                        Grade
                    </Typography>
                    <Typography
                        variant='body1'
                        align='left'
                        className={classes.dataFontDate}
                    >
                        {gradeLvl(academicLevel)}
                    </Typography>
                </Grid>
                <Grid item xs={2} md={4} lg={2} xl={2}>
                    <Typography
                        variant='body2'
                        align='left'
                        className={classes.alignTitleLeft}
                    >
                        Subject
                    </Typography>
                    <Typography
                        variant='body1'
                        align='left'
                        className={classes.dataFontDate}
                    >
                        {courseCategory}
                    </Typography>
                </Grid>
            </Grid>

            <Grid
                container
                style={{ marginTop: '2.5em' }}
                direction='column'
                spacing={2}
            >
                <Grid item xs={12} sm={12}>
                    <Tabs
                        className={tabSelection()}
                        value={index}
                        onChange={handleChange}
                    >
                        {setTabsForAccountTypes(
                            accountType,
                            data.parent?.studentList,
                            data.enrollments
                        ).map((tab) => (
                            <Tab
                                key={tab.label}
                                {...tab}
                                styles={{
                                    bgColor: '#ffffff',
                                    selectedBgColor: '#EBFAFF',
                                    color: 'rgba(102, 102, 102, 0.87)',
                                    topMargin: '1.1em',
                                    leftValue: 0,
                                    rightValue: 0,
                                }}
                            />
                        ))}
                    </Tabs>
                </Grid>
                <>
                    <TabPanel
                        index={0}
                        value={index}
                        backgroundColor='#FFFFFF'
                        style={{ width: '100%' }}
                    >
                        <ClassInfo
                            id={id}
                            courseLink={courseLink}
                            description={description}
                            courseLinkDescription={courseLinkDescription}
                            courseLinkUpdatedAt={courseLinkUpdatedAt}
                            courseLinkUser={courseLinkUser}
                        />
                    </TabPanel>

                    <TabPanel index={1} value={index}>
                        <Announcements announcementsData={data.announcements} />
                    </TabPanel>

                    <TabPanel index={2} value={index}>
                        <ClassEnrollmentList enrollmentList={enrollmentSet} />
                    </TabPanel>
                    <TabPanel index={3} value={index}>
                        <ClassSessionContainer sessionList={sessionSet} />
                    </TabPanel>
                    <TabPanel index={4} value={index} style={{ width: '100%' }}>
                        <AttendanceContainer />
                    </TabPanel>
                    <TabPanel
                        index={5}
                        value={index}
                        style={{ width: '100%', marginTop: '48px' }}
                    >
                        <Notes ownerID={id} ownerType='course' />
                    </TabPanel>
                </>
            </Grid>
        </Grid>
    );
};

export default CourseClass;
