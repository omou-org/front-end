import React, {useCallback, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';
import {omouBlue} from '../../../theme/muiTheme';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/client';
import {GET_SESSION_NOTES} from './ClassSessionView';
import {useSelector} from 'react-redux';
import {ResponsiveButton} from '../../../theme/ThemedComponents/Button/ResponsiveButton';

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
        padding: '56px 56px 120px 56px',
    },
    subjectUnderline: {
        marginBottom: '.75em',
        borderBottom: '1px solid #666666',
        paddingRight: '3em',
    },
}));

const ModalTextEditor = ({
    open,
    handleCloseForm,
    userId,
    origin,
    posterId,
    sessionId,
    noteId,
    noteSubject,
    noteBody,
    buttonState,
}) => {
    const classes = useStyles();
    const [subject, setSubject] = useState(noteSubject);
    const [body, setBody] = useState(noteBody);
    const { user } = useSelector(({ auth }) => auth) || [];

    const poster_id = user.id;

    const SEND_EMAIL = gql`
        mutation SendEmail(
            $body: String!
            $subject: String!
            $userId: ID!
            $posterId: ID!
        ) {
            __typename
            sendEmail(
                body: $body
                posterId: $posterId
                userId: $userId
                subject: $subject
            ) {
                created
            }
        }
    `;

    const CREATE_SESSION_NOTE = gql`
        mutation createSessionNote(
            $body: String!
            $subject: String!
            $user: ID!
            $sessionId: ID!
            $id: ID
        ) {
            __typename
            createSessionNote(
                body: $body
                user: $user
                subject: $subject
                sessionId: $sessionId
                id: $id
            ) {
                sessionNote {
                    id
                    body
                    subject
                    poster {
                        firstName
                        lastName
                        id
                    }
                    createdAt
                    updatedAt
                }
            }
        }
    `;

    const [sendEmail, sendEmailResult] = useMutation(SEND_EMAIL, {
        onCompleted: () => handleClose(false),
        error: (err) => console.error(err),
    });

    const [createSessionNote, createSessionNoteResult] = useMutation(
        CREATE_SESSION_NOTE,
        {
            onCompleted: () => handleClose(false),
            error: (err) => console.error(err),
            update: (cache, { data }) => {
                const [newSessionNote] = Object.values(data.createSessionNote);
                const cachedSessionNote = cache.readQuery({
                    query: GET_SESSION_NOTES,
                    variables: { sessionId: sessionId },
                })['sessionNotes'];
                let updatedSessionNotes = [...cachedSessionNote];
                const matchingIndex = updatedSessionNotes.findIndex(
                    ({ id }) => id === newSessionNote.id
                );
                if (matchingIndex === -1) {
                    updatedSessionNotes = [
                        ...cachedSessionNote,
                        newSessionNote,
                    ];
                } else {
                    updatedSessionNotes[matchingIndex] = newSessionNote;
                }
                cache.writeQuery({
                    data: {
                        ['sessionNotes']: updatedSessionNotes,
                    },
                    query: GET_SESSION_NOTES,
                    variables: { sessionId: sessionId },
                });
            },
        }
    );

    const handleClose = () => handleCloseForm(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (origin === 'STUDENT_ENROLLMENT') {
            const sentEmail = await sendEmail({
                variables: {
                    subject: subject,
                    body: body,
                    userId: userId,
                    posterId: poster_id,
                },
            });
        } else {
            const createdSessionNote = await createSessionNote({
                variables: {
                    subject: subject,
                    body: body,
                    user: poster_id,
                    sessionId: sessionId,
                    id: noteId,
                },
            });
        }
    };

    const handleSubjectChange = useCallback((event) => {
        setSubject(event.target.value);
    }, []);

    const handleBodyChange = useCallback((event) => {
        setBody(event.target.value);
    }, []);

    return (
        <Dialog
            PaperProps={{
                classes: { root: classes.rootContainer },
                square: true,
            }}
            open={open}
            onClose={handleClose}
            aria-labelledby='form-dialog-title'
            maxWidth='md'
        >
            <DialogContent classes={{ root: classes.textArea }}>
                <Input
                    placeholder='Subject'
                    className={classes.subjectUnderline}
                    disableUnderline
                    onChange={handleSubjectChange}
                    defaultValue={buttonState === 'edit' ? noteSubject : ''}
                />
                <TextField
                    InputProps={{
                        disableUnderline: true,
                        classes: { inputMarginDense: classes.textBox },
                    }}
                    autoFocus
                    className={classes.textFieldStyle}
                    margin='dense'
                    id='name'
                    onChange={handleBodyChange}
                    placeholder='Body'
                    type='email'
                    fullWidth
                    defaultValue={buttonState === 'edit' ? noteBody : ''}
                    multiline
                    rows={12}
                />
            </DialogContent>
            <DialogActions style={{ marginBottom: '2em' }}>
                <ResponsiveButton onClick={handleClose} variant='outlined'>
                    Cancel
                </ResponsiveButton>
                <ResponsiveButton variant='contained' onClick={handleSubmit}>
                    {origin === 'STUDENT_ENROLLMENT'
                        ? 'Send Email'
                        : buttonState === 'edit'
                        ? 'EDIT NOTE'
                        : 'ADD NOTE'}
                </ResponsiveButton>
            </DialogActions>
        </Dialog>
    );
};

export default ModalTextEditor;
