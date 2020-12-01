import React, { useEffect, useState } from 'react';
import { useMutation, useApolloClient, useQuery } from '@apollo/react-hooks';
import {
    Typography,
    Grid,
    IconButton,
    Button,
    InputBase,
    fade,
    withStyles,
} from '@material-ui/core/';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import moment from 'moment';
import gql from 'graphql-tag';
import { USER_TYPES } from '../../../utils';
import { fullName } from '../../../utils';
import { GET_CLASSES } from './CourseClasses';

const useStyles = makeStyles({
    courseLink: {
        width: '100%',
    },
    cancelButton: {
        color: '#289FC3',
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
            availabilities: {
                dayOfWeek: MONDAY
                endTime: "10:00"
                startTime: "12:00"
            }
        ) {
            course {
                id
                courseType
                courseLinkDescription
                courseLinkUpdatedAt
                courseLink
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
}) => {
    const [courseURL, setCourseURL] = useState('');
    const [linkDescription, setLinkDescription] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [isEditActive, setEditActive] = useState(false);
    const { email, accountType, user } = useSelector(({ auth }) => auth) || [];

    const [updateCourseLink, { data }] = useMutation(UPDATE_COURSE_LINK, {
        onCompleted: () => {
            setEditActive(false);
        },
        update: (cache, { data }) => {
            const newCourseLink = data?.createCourse.course;

            const cachedCourseLink = cache.readQuery({
                query: GET_CLASSES[accountType],
                variables: { id: id, email: email },
            }).course;

            cache.writeQuery({
                data: {
                    course: { ...cachedCourseLink, ...newCourseLink },
                },
                query: GET_CLASSES[accountType],
                variables: { id: id },
            });
        },
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
        // Should take the form input and pass that into a graphql mutaion
        updateCourseLink({
            variables: {
                id: id,
                courseLink: courseURL,
                courseDescription: linkDescription,
            },
        });

        setEditActive(false);
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
            fullName(user)
        );
    };

    return (
        <>
            <Grid item xs={7}>
                <Typography
                    className={classes.aboutCourseDescription}
                    align="left"
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
                                    id="courseLink"
                                    variant="outlined"
                                    defaultValue={courseURL}
                                    style={{ width: '100%' }}
                                    InputProps={{
                                        className: classes.inputBorderStyle,
                                    }}
                                    onChange={handleLinkChange}
                                />
                                <BootstrapInput
                                    multiline
                                    variant="outlined"
                                    rows={4}
                                    defaultValue={courseLinkDescription}
                                    style={{ width: '100%', paddingTop: '1em' }}
                                    InputProps={{
                                        className: classes.inputBorderStyle,
                                    }}
                                    onChange={handleDescriptionChange}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={cancelUpdate}
                                    className={classes.cancelButton}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={updateLinkAndDescription}
                                    className={classes.updateButton}
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                ) : (
                    <Grid container>
                        <Grid item xs={7} align={'left'}>
                            <a href={courseLink} target="_blank">
                                <Typography>{courseLink}</Typography>
                            </a>
                            <Typography>{courseLinkDescription}</Typography>
                            <Typography className={classes.updatedAtText}>
                                {courseLinkUpdatedAt
                                    ? updatedAtText(courseLinkUpdatedAt)
                                    : ' Insert course link here'}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <IconButton onClick={editLinkAndDescription}>
                                <CreateIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default ClassInfo;
