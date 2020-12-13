import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Create, Cancel } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import { highlightColor } from '../../../theme/muiTheme';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import NewAnnouncementModal from './NewAnnoucementsModal';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';

import AddIcon from '@material-ui/icons/Add';
import { GET_ANNOUNCEMENTS } from './CourseClasses';
import { fullName, USER_TYPES, sortTime } from '../../../utils';
import theme, { omouBlue } from '../../../theme/muiTheme';

import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

const useStyles = makeStyles({
    announcementContainer: {
        padding: '10px',
        fontFamily: 'Arial',
        fontStyle: 'normal',
        '&:hover': {
            backgroundColor: highlightColor,
        },
    },
    announcementBody: {
        paddingTop: '10px',
        paddingBottom: '20px',
    },
    newNoteButton: {
        marginBottom: '2em',
        height: '2.5em',
        marginTop: '2em',
        marginLeft: '.75em',
    },
    plusSpan: {
        fontSize: '1rem',
        fontWeight: 500,
        color: '#666666',
        paddingRight: '.25em',
    },
});

const AnnouncementCard = ({
    id,
    fullName,
    subject,
    body,
    updatedAt,
    handleEdit,
    handleDelete,
}) => {
    const classes = useStyles();
    const date = moment(updatedAt).format('MM/DD');
    const time = moment(updatedAt).format('h:mma');
    const subjectRef = useRef();
    const bodyRef = useRef();
    const handleOpenForm = () => {
        const currentSubject = subjectRef.current.textContent;
        const currentBody = bodyRef.current.textContent;
        handleEdit(true, id, currentSubject, currentBody);
    };

    const handleDeleteForm = () => handleDelete(id);

    return (
        <Grid
            className={classes.announcementContainer}
            container
            justify="flex-start"
            data-active="inactive"
        >
            <Grid item xs={6}>
                <Typography
                    variant="h6"
                    align="left"
                    gutterBottom
                    ref={subjectRef}
                >
                    {subject}
                </Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'end' }}>
                <AccessControlComponent
                    permittedAccountTypes={[
                        USER_TYPES.admin,
                        USER_TYPES.receptionist,
                        USER_TYPES.instructor,
                    ]}
                >
                    <Button onClick={handleOpenForm} name="edit" value="edit">
                        <Create style={{ color: omouBlue }} />
                    </Button>
                    <Button onClick={handleDeleteForm}>
                        <Cancel style={{ color: omouBlue }} />
                    </Button>
                </AccessControlComponent>
            </Grid>
            <Grid item xs={12} className={classes.announcementBody}>
                <Typography variant="body1" align="left" ref={bodyRef}>
                    {body}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" align="left">
                    Posted by:
                    <span
                        style={{
                            color: omouBlue,
                            fontWeight: '550',
                            padding: theme.spacing(1),
                        }}
                    >
                        {fullName}
                    </span>
                    <span style={{ padding: theme.spacing(1) }}>• </span>
                    <span style={{ padding: theme.spacing(1) }}>
                        {date}{' '}
                        <span style={{ padding: theme.spacing(1) }}>•</span>{' '}
                        {time}
                    </span>
                </Typography>
            </Grid>
        </Grid>
    );
};

const Announcements = ({ announcementsData }) => {
    const [openNewAnnouncementForm, setNewAnnouncementForm] = useState(false);
    const [announcementId, setAnnouncementId] = useState();
    const [announcementSubject, setAnnouncementSubject] = useState('');
    const [announcementBody, setAnnouncementBody] = useState('');
    const [editOrPost, setEditOrPost] = useState('post');
    const classes = useStyles();
    const courseId = useParams();

    const DELETE_ANNOUNCEMENT = gql`
        mutation removeAnnouncement($id: ID!) {
            __typename
            deleteAnnouncement(id: $id) {
                deleted
                id
            }
        }
    `;

    const [deleteAnnouncement, deleteAnnouncementResult] = useMutation(
        DELETE_ANNOUNCEMENT,
        {
            error: (err) => console.error(err),
            update: (
                cache,
                {
                    data: {
                        deleteAnnouncement: { id },
                    },
                }
            ) => {
                const cachedAnnouncement = cache.readQuery({
                    query: GET_ANNOUNCEMENTS,
                    variables: { id: courseId.id },
                })['announcements'];
                let updatedAnnouncements = [...cachedAnnouncement];
                const removedIndex = updatedAnnouncements.findIndex(
                    (announcement) => announcement.id === id
                );
                updatedAnnouncements.splice(removedIndex, 1);
                cache.writeQuery({
                    data: {
                        ['announcements']: updatedAnnouncements,
                    },
                    query: GET_ANNOUNCEMENTS,
                    variables: { id: courseId.id },
                });
            },
        }
    );

    const handleEdit = (boolean, id, subject, body) => {
        setEditOrPost('edit');
        setAnnouncementId(id);
        setNewAnnouncementForm(boolean);
        setAnnouncementSubject(subject);
        setAnnouncementBody(body);
    };

    const handleClose = (boolean) => setNewAnnouncementForm(boolean);

    const handleDeleteAnnouncement = async (id) => {
        const deletedAnnouncement = await deleteAnnouncement({
            variables: { id: id },
        });
    };

    const announcementRender = announcementsData.sort((firstVal, secondVal) =>
        sortTime(firstVal.updatedAt, secondVal.updatedAt)
    );

    return (
        <Grid container justify="flex-start" data-active="inactive">
            <AccessControlComponent
                permittedAccountTypes={[
                    USER_TYPES.admin,
                    USER_TYPES.receptionist,
                    USER_TYPES.instructor,
                ]}
            >
                <ResponsiveButton
                    variant="outlined"
                    className={classes.newNoteButton}
                    onClick={() =>
                        setNewAnnouncementForm(true, setEditOrPost('post'))
                    }
                    value="post"
                    name="post"
                    startIcon={<AddIcon />}
                >
                    <span className={classes.plusSpan}>+</span> New Announcement
                </ResponsiveButton>
            </AccessControlComponent>

            {announcementRender.map(
                ({ poster, subject, body, updatedAt, id }) => (
                    <>
                        <AnnouncementCard
                            key={id}
                            id={id}
                            fullName={fullName(poster)}
                            subject={subject}
                            body={body}
                            updatedAt={updatedAt}
                            handleEdit={handleEdit}
                            handleDelete={handleDeleteAnnouncement}
                        />
                    </>
                )
            )}
            <NewAnnouncementModal
                handleClose={handleClose}
                open={openNewAnnouncementForm}
                id={announcementId}
                subject={announcementSubject}
                body={announcementBody}
                buttonState={editOrPost}
            />
        </Grid>
    );
};

export default Announcements;
