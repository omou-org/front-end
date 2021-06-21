import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { white, darkGrey, body1 } from '../../../theme/muiTheme';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';

const useStyles = makeStyles({
    modalStyle: {
        top: '50%',
        left: `50%`,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        width: '31rem',
        height: '15.5rem',
        background: white,
        boxShadow: '0px 0px 8px rgba(153, 153, 153, 0.8);',
        borderRadius: '5px',
    },
    subjectInput: {
        ...body1,
        height: '2rem',
        width: '13rem',
        color: darkGrey,
        marginBottom: '1rem',
    },
    descriptionInput: {
        ...body1,
        height: '2rem',
        width: '16.0625rem',
        color: darkGrey,
    },
    topicNameBorderStyles: {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid #404143',
        borderRadius: '0px',
        width: '14.25rem',
    },
    topicDescriptionBorderStyles: {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid #404143',
        borderRadius: '0px',
        width: '27rem',
    },
    topicNamePlaceholder: {},
});

const CREATE_COURSE_TAG = gql`
    mutation createCourseTag($name: String, $description: String) {
        createCourseCategory(name: $name, description: $description) {
            courseCategory {
                __typename
                name
                description
                id
            }
        }
    }
`;

// const UPDATE_COURSE_TAG = gql`
//     mutation createCourseTag(
//         $id: ID,
//         $name: String,
//         $description: String
//         ) {
//             createCourseCategory(
//                 id: $id,
//                 name: $name,
//                 description: $description
//             ) {
//                 courseCategory {
//                     id
//                     description
//                     name
//                 }
//             }
//     }
// `;

const GET_COURSE_TAGS = gql`
    query getCourseTags {
        courseCategories {
            name
            description
            id
        }
    }
`;

const CreateTopicModal = ({ closeModal }) => {
    const [courseTopicValue, setCourseTopicValue] = useState({
        topicName: '',
        topicDescription: '',
    });

    const [submitData] = useMutation(CREATE_COURSE_TAG, {
        onCompleted: () => {
            closeModal();
        },
        update: (cache, { data }) => {
            const updatedCourseTopic = data.createCourseCategory.courseCategory;
            const cachedCourseTopics = cache.readQuery({
                query: GET_COURSE_TAGS,
            }).courseCategories;
            const updatedCache = [...cachedCourseTopics, updatedCourseTopic];
            cache.writeQuery({
                data: {
                    courseCategories: updatedCache,
                },
                query: GET_COURSE_TAGS,
            });
        },
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setCourseTopicValue((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onSubmit = () => {
        submitData({
            variables: {
                name: courseTopicValue.topicName,
                description: courseTopicValue.topicDescription,
            },
        });
    };

    const classes = useStyles();
    return (
        <Grid container className={classes.modalStyle}>
            <Grid item style={{ padding: '2rem 1rem 0rem 2rem' }}>
                <Typography variant='h3'>Create New Topic</Typography>

                <Grid
                    item
                    direction='column'
                    justify='center'
                    alignItems='flex-start'
                    style={{
                        marginTop: '1.5rem',
                        marginBottom: '2rem',
                        width: '27rem',
                    }}
                >
                    <TextField
                        type='text'
                        placeholder='* Topic (max 30 characters)'
                        value={courseTopicValue.topicName}
                        name='topicName'
                        variant='outlined'
                        required
                        InputProps={{
                            classes: {
                                root: classes.subjectInput,
                                notchedOutline: classes.topicNameBorderStyles,
                                input: classes.topicNamePlaceholder,
                            },
                        }}
                        onChange={handleOnChange}
                    />

                    <TextField
                        type='text'
                        placeholder='Description (max 80 characters)'
                        value={courseTopicValue.topicDescription}
                        name='topicDescription'
                        variant='outlined'
                        InputProps={{
                            classes: {
                                root: classes.descriptionInput,
                                notchedOutline:
                                    classes.topicDescriptionBorderStyles,
                            },
                        }}
                        onChange={handleOnChange}
                    />
                </Grid>

                <Grid
                    style={{ textAlign: 'right', marginBottom: '2rem' }}
                    item
                    xs={12}
                >
                    <ResponsiveButton
                        style={{ border: 'none', color: darkGrey }}
                        variant='outlined'
                        onClick={closeModal}
                    >
                        cancel
                    </ResponsiveButton>
                    <ResponsiveButton
                        style={{
                            border: 'none',
                            background: white,
                        }}
                        variant='outlined'
                        onClick={onSubmit}
                    >
                        create topic
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

CreateTopicModal.propTypes = {
    closeModal: PropTypes.func,
};

export default CreateTopicModal;
