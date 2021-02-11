import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
    Button,
    fade,
    Grid,
    IconButton,
    InputBase,
    Link,
    Typography,
    withStyles,
} from '@material-ui/core/';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import moment from 'moment';
import gql from 'graphql-tag';
import { fullName, USER_TYPES } from '../../../utils';
import {GET_COURSE} from "../../../queries/CoursesQuery/CourseQuery"


const useStyles = makeStyles({
    courseLink: {
        paddingTop: '1em',
        width: '100%',
    },
    cancelButton: {
        color: '#289FC3',
        marginRight: '1em',
        marginLeft: '1em',
    },

    updateButton: {
        backgroundColor: '#289FC3',
        color: 'white',
        '&:hover': {
            backgroundColor: '#d3d3d3',
            color: '#FFF',
        },
    },
    aboutCourseDescription: {
        fontSize: '16px',
        lineHeight: '22px',
    },
    updatedAtText: {
        paddingTop: '10px',
        color: '#999999',
        fontSize: '14px',
        fontStyle: 'italic',
    },
});
// Copy pasta from material-ui
const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        borderColor: '#289FC3',
        fontSize: 16,
        width: '100%',
        padding: '10px 12px',
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
            boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}))(InputBase);

const UPDATE_COURSE_LINK = gql`
    mutation updateCourseLink(
        $id: ID!
        $courseLink: String!
        $courseDescription: String!
    ) {
        createCourse(
            courseLink: $courseLink
            courseLinkDescription: $courseDescription
            id: $id
            availabilities: [
                { dayOfWeek: SATURDAY, startTime: "01:00", endTime: "09:00" }
                { dayOfWeek: SUNDAY, startTime: "01:00", endTime: "09:00" }
            ]
        ) {
            course {
                courseId
                courseType
                courseLinkDescription
                courseLinkUpdatedAt
                courseLink
                courseLinkUser {
                    firstName
                    lastName
                }
            }
        }
    }
`;

const ClassInfo = ({
    description,
    courseLink,
    courseLinkDescription,
    courseLinkUpdatedAt,
    id,
    courseLinkUser,
}) => {
    const [courseURL, setCourseURL] = useState('');
    const [linkDescription, setLinkDescription] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [isEditActive, setEditActive] = useState(false);

    const [updateCourseLink, { data }] = useMutation(UPDATE_COURSE_LINK, {
        onCompleted: () => {
            setEditActive(false);
        },
        update: (cache, { data }) => {
            const newCourseLink = data.createCourse.course;
            const cachedCourseLink = cache.readQuery({
                query: GET_COURSE,
                variables: { id: id },
            }).course;

            cache.writeQuery({
                data: {
                    course: { ...cachedCourseLink, ...newCourseLink },
                },
                query: GET_COURSE,
                variables: { id: id },
            });
        },
        onError: (error) => console.log(error),
        //Add error
    });

    const classes = useStyles();

    useEffect(() => {
        setCourseURL(courseLink);
        setLinkDescription(courseLinkDescription);
        setUpdatedAt(courseLinkUpdatedAt);
    }, [courseLink, courseLinkDescription]);

    const editLinkAndDescription = () => {
        setEditActive(true);
    };

    const cancelUpdate = () => {
        setEditActive(false);
    };

    const updateLinkAndDescription = () => {
        updateCourseLink({
            variables: {
                id: id,
                courseLink: courseURL,
                courseDescription: linkDescription,
            },
        });
    };

    const handleLinkChange = (event) => {
        setCourseURL(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setLinkDescription(event.target.value);
    };

    const updatedAtText = (time) => {
        return (
            moment(time).format('[Last updated on] MMM D YYYY [at] h:mm:a') +
            ' ' +
            fullName(courseLinkUser)
        );
    };

    return (
        <>
            <Grid item xs={7}>
                <Typography
                    className={classes.aboutCourseDescription}
                    align='left'
                    style={{ marginBottom: '1em', marginTop: '2em' }}
                >
                    {description}
                </Typography>
            </Grid>

            <Grid item container>
                <Typography style={{ fontSize: '17px' }}>
                    Course Link
                </Typography>
                {isEditActive ? (
                    <form className={classes.courseLink}>
                        <Grid container>
                            <Grid item xs={7}>
                                <BootstrapInput
                                    id='courseLink'
                                    variant='outlined'
                                    defaultValue={courseURL}
                                    style={{ width: '100%' }}
                                    InputProps={{
                                        className: classes.inputBorderStyle,
                                    }}
                                    onChange={handleLinkChange}
                                />
                                <BootstrapInput
                                    multiline
                                    variant='outlined'
                                    rows={4}
                                    defaultValue={courseLinkDescription}
                                    style={{ width: '100%', paddingTop: '1em' }}
                                    InputProps={{
                                        className: classes.inputBorderStyle,
                                        maxLength: 20,
                                    }}
                                    onChange={handleDescriptionChange}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={cancelUpdate}
                                    className={classes.cancelButton}
                                    variant='outlined'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={updateLinkAndDescription}
                                    className={classes.updateButton}
                                    variant='contained'
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                ) : (
                    <Grid container>
                        <Grid item xs={7} align={'left'}>
                            <Typography className={classes.courseLink}>
                                <Link
                                    href={courseLink}
                                    color='inherit'
                                    target='_blank'
                                >
                                    {courseLink}
                                </Link>
                            </Typography>

                            <Typography style={{ paddingTop: '1em' }}>
                                {courseLinkDescription}
                            </Typography>
                            <Typography className={classes.updatedAtText}>
                                {courseLinkUpdatedAt
                                    ? updatedAtText(courseLinkUpdatedAt)
                                    : ' Insert course link here'}
                            </Typography>
                        </Grid>
                        <AccessControlComponent
                            permittedAccountTypes={[
                                USER_TYPES.admin,
                                USER_TYPES.receptionist,
                                USER_TYPES.instructor,
                            ]}
                        >
                            <Grid item xs={4}>
                                <IconButton onClick={editLinkAndDescription}>
                                    <CreateIcon />
                                </IconButton>
                            </Grid>
                        </AccessControlComponent>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default ClassInfo;
