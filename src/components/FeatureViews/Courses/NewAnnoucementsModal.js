import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { omouBlue } from '../../../theme/muiTheme';
import { GET_ANNOUNCEMENTS } from './CourseClasses';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    rootContainer: {
        width: '37%',
        [theme.breakpoints.between('md', 'lg')]: {
            width: '60%',
        },
        [theme.breakpoints.between('sm', 'md')]: {
            width: '100%',
        },
    },
    inputUnderline: {
        '&&&:before': {
            borderBottom: 'none',
        },
        '&&:after': {
            borderBottom: 'none',
        },
    },
    textFieldStyle: {
        border: '1px solid #666666',
        borderRadius: '5px',
    },
    textBox: {
        paddingTop: '.625em',
        paddingLeft: '.625em',
        paddingRight: '.625em',
    },
    cancelButton: {
        color: '#747D88',
        border: '1px solid #747D88',
        borderRadius: '5px',
        fontSize: '.75rem',
        fontFamily: 'Roboto',
        fontWeight: 500,
        width: '17%',
        marginRight: '.75em',
    },
    submitButton: {
        backgroundColor: omouBlue,
        borderRadious: '5px',
        fontFamily: 'Roboto',
        fontWeight: 500,
        fontSize: '.75rem',
        width: '17%',
        color: '#FFFFFF',
        marginRight: '4em',
    },
    textArea: {
        padding: '56px 56px 24px 56px',
    },
    subjectUnderline: {
        marginBottom: '.75em',
        borderBottom: '1px solid #666666',
        paddingRight: '3em',
    },
    buttonGroup: {
        marginLeft: '5em',
        marginBottom: '3.5em',
    },
    checkboxLabel: {
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        fontSize: '.875rem',
        color: '#333333',
    },
    checkBox: {
        color: omouBlue,
    },
    checkBoxPseudo: {
        '&:hover': {
            color: omouBlue,
        },
    },
}));

const CREATE_ANNOUNCEMENTS = gql`
    mutation CreateAnnouncement(
        $subject: String!
        $body: String!
        $courseId: ID!
        $userId: ID!
        $shouldEmail: Boolean
        $id: ID
    ) {
        __typename
        createAnnouncement(
            body: $body
            course: $courseId
            subject: $subject
            user: $userId
            shouldEmail: $shouldEmail
            id: $id
        ) {
            announcement {
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
    }
`;

const NewAnnouncementsModal = ({
    handleClose,
    open,
    subject,
    id,
    body,
    buttonState,
}) => {
    const classes = useStyles();
    const [sendEmailCheckbox, setSendEmailCheckbox] = useState(false);
    const [sendSMSCheckbox, setSendSMSCheckbox] = useState(false);
    const [announcementBody, setAnnouncementBody] = useState('');
    const [announcementSubject, setAnnouncementSubject] = useState('');
    const courseId = useParams();
    const { user } = useSelector(({ auth }) => auth) || [];
    const user_id = user.id;

    // Move announcemenet query variable out of this component outside of this component

    const [createAnnouncement, createAnnouncementResult] = useMutation(
        CREATE_ANNOUNCEMENTS,
        {
            onCompleted: () => handleClose(false),
            error: (err) => console.error(err),
            update: (cache, { data }) => {
                const [newAnnouncement] = Object.values(
                    data.createAnnouncement
                );
                const cachedAnnouncement = cache.readQuery({
                    query: GET_ANNOUNCEMENTS,
                    variables: { id: courseId.id },
                })['announcements'];
                let updatedAnnouncements = [...cachedAnnouncement];
                const matchingIndex = updatedAnnouncements.findIndex(
                    ({ id }) => id === newAnnouncement.id
                );
                if (matchingIndex === -1) {
                    updatedAnnouncements = [
                        ...cachedAnnouncement,
                        newAnnouncement,
                    ];
                } else {
                    updatedAnnouncements[matchingIndex] = newAnnouncement;
                }
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

    const handleCloseForm = () => handleClose(false);

    const handleCheckboxChange = (setCheckbox) => (e) =>
        setCheckbox(e.target.checked);

    const handleSubjectChange = useCallback((event) => {
        setAnnouncementSubject(event.target.value);
    }, []);

    const handleBodyChange = useCallback((event) => {
        setAnnouncementBody(event.target.value);
    }, []);

    const handlePostForm = async (event) => {
        event.preventDefault();
        const createdCurrentAnnouncement = await createAnnouncement({
            variables: {
                subject: announcementSubject,
                body: announcementBody,
                id: id,
                userId: user_id,
                courseId: courseId.id,
                shouldEmail: sendEmailCheckbox,
            },
        });
    };

    return (
        <Dialog
            PaperProps={{
                classes: { root: classes.rootContainer },
                square: true,
            }}
            open={open}
            onClose={handleCloseForm}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
        >
            <DialogContent classes={{ root: classes.textArea }}>
                <Input
                    placeholder="Subject"
                    disableUnderline
                    onChange={handleSubjectChange}
                    defaultValue={buttonState === 'edit' ? subject : ''}
                    className={classes.subjectUnderline}
                />
                <TextField
                    InputProps={{
                        disableUnderline: true,
                        classes: { inputMarginDense: classes.textBox },
                    }}
                    autoFocus
                    onChange={handleBodyChange}
                    className={classes.textFieldStyle}
                    margin="dense"
                    id="name"
                    placeholder="Body"
                    defaultValue={buttonState === 'edit' ? body : ''}
                    type="email"
                    fullWidth
                    multiline
                    rows={12}
                />
            </DialogContent>
            <FormGroup className={classes.buttonGroup}>
                <FormControlLabel
                    style={{ fontSize: '.5rem' }}
                    control={
                        <Checkbox
                            checked={sendEmailCheckbox}
                            onChange={handleCheckboxChange(
                                setSendEmailCheckbox
                            )}
                            name="email"
                            className={classes.checkBoxPseudo}
                            checkedIcon={
                                <CheckBoxIcon className={classes.checkBox} />
                            }
                            icon={<CheckBoxOutlineBlankOutlinedIcon />}
                            color="primary"
                        />
                    }
                    label={
                        <Typography className={classes.checkboxLabel}>
                            Send as email to parent of students enrolled in
                            class
                        </Typography>
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={sendSMSCheckbox}
                            onChange={handleCheckboxChange(setSendSMSCheckbox)}
                            name="sms"
                            className={classes.checkBoxPseudo}
                            checkedIcon={
                                <CheckBoxIcon className={classes.checkBox} />
                            }
                            icon={<CheckBoxOutlineBlankOutlinedIcon />}
                            color="primary"
                        />
                    }
                    label={
                        <Typography className={classes.checkboxLabel}>
                            Send as SMS to parents of students enrolled in class
                        </Typography>
                    }
                />
            </FormGroup>
            <DialogActions style={{ marginBottom: '2em' }}>
                <ResponsiveButton variant="outlined" onClick={handleCloseForm}>
                    Cancel
                </ResponsiveButton>
                <ResponsiveButton variant="contained" onClick={handlePostForm}>
                    {buttonState === 'post' ? 'Post' : 'Edit'}
                </ResponsiveButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewAnnouncementsModal;
