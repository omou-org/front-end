import React, { useState, useCallback, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEnrollment } from 'actions/registrationActions';

import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { fullName, USER_TYPES } from '../../../utils';
import { highlightColor, omouBlue } from '../../../theme/muiTheme';
import IconButton from '@material-ui/core/IconButton';
import MobileMenu from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/es/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';
import StudentEnrollmentBackground from './ClassEnrollmentBackground';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 1460,
        [theme.breakpoints.between('md', 'lg')]: {
            minWidth: 910,
        },
        [theme.breakpoints.between('sm', 'md')]: {
            minWidth: 677,
        },
    },
    menuSelected: {
        '&:hover': { backgroundColor: highlightColor, color: '#28ABD5' },
        '&:focus': { backgroundColor: highlightColor },
    },
    center: {
        position: 'relative',
        top: '-15px',
    },
    dropdown: {
        border: '1px solid #43B5D9',
        borderRadius: '5px',
    },
    noBorderBottom: {
        borderBottom: 'none',
    },
    accordionNotes: {
        textAlign: 'left',
        display: 'inline-block',
        marginTop: '10px',
    },
    accordionNotesBorder: {
        border: '1px #E0E0E0 solid',
        borderRadius: '25px',
        margin: '0px 24px 25px 24px',
        paddingTop: '0px',
    },
    studentRenderAccordionSpacing: {
        width: '202px',
    },
    parentRenderAccordionSpacing: {
        width: '200px',
    },
    actionsRenderAccordionSpacing: {
        width: '200px',
    },
    iconRenderAccordionSpacing: {
        position: 'relative',
        left: '6.5em',
    },
    studentInfoSpacing: {
        margin: '15px',
    },
}));

const ClassEnrollmentRow = ({
    fullStudentName,
    accountType,
    studentId,
    studentInfo,
    parentAccountType,
    parentId,
    concatFullParentName,
    phoneNumber,
    handleOpenModal,
    enrollmentList,
    enrollmentID,
    courseTitle,
    studentEmail,
}) => {
    const { location } = useHistory();
    const paramsID = useParams();
    const dispatch = useDispatch();

    let courseID = paramsID.id ? paramsID.id : paramsID.courseID;

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const [studentMenuAnchorEl, setStudentMenuAnchorEl] = useState(null);
    const [unenroll, setUnenroll] = useState({
        enrollment: null,
        open: false,
    });

    const [inviteStatus, setInviteStatus] = useState('Unsent');
    const [
        googleClassroomStatusMessage,
        setGoogleClassroomStatusMessage,
    ] = useState('Send Invite');
    const { courses, google_courses, google_access_token } = useSelector(
        ({ auth }) => auth
    );

    const getGoogleClassCode = (courses, courseID) => {
        let googleClassCode;
        if (courses) {
            courses.forEach(function (course) {
                if (courseID == course.id) {
                    googleClassCode = course.googleClassCode;
                }
            });
            return googleClassCode;
        }
    };

    const getGoogleCourseID = (google_courses, courses, courseID) => {
        let googleCourseID;
        let googleClassCode = getGoogleClassCode(courses, courseID);
        if (google_courses && googleClassCode) {
            google_courses.forEach(function (course) {
                if (course.enrollmentCode == googleClassCode) {
                    googleCourseID = course.id;
                }
            });
            return googleCourseID;
        }
    };

    const handleInvite = async () => {
        let googleCourseID = getGoogleCourseID(
            google_courses,
            courses,
            courseID
        );
        if (
            googleClassroomStatusMessage == 'Resend Invite' ||
            inviteStatus == 'Unsent'
        ) {
            setGoogleClassroomStatusMessage('Resend Invite');
            try {
                if (googleCourseID && studentEmail) {
                    const resp = await axios.post(
                        `https://classroom.googleapis.com/v1/invitations`,
                        {
                            userId: studentEmail,
                            courseId: googleCourseID,
                            role: 'STUDENT',
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${google_access_token}`,
                            },
                        }
                    );
                    setInviteStatus('Sent');
                    setGoogleClassroomStatusMessage('Refresh');
                }
            } catch {
                setInviteStatus(<Typography color='error'>Unsent</Typography>);
                alert('Error creating invite');
            }
        } else if (googleClassroomStatusMessage == 'Refresh') {
            if (googleCourseID && studentEmail) {
                try {
                    const resp = await axios.get(
                        `https://classroom.googleapis.com/v1/courses/${googleCourseID}/students/${studentEmail}`,
                        {
                            headers: {
                                Authorization: `Bearer ${google_access_token}`,
                            },
                        }
                    );
                    setInviteStatus('Accepted');
                    setGoogleClassroomStatusMessage('Invite Accepted');
                } catch (error) {
                    setInviteStatus('Not Accepted');
                    setGoogleClassroomStatusMessage('Resend Invite');
                }
            }
        } else if (googleClassroomStatusMessage == 'Invite Accepted') {
            return;
        }
    };

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const handleOpen = (e) => {
        e.preventDefault();
        const currentValue = e.currentTarget.value;
        const dataType = e.currentTarget.dataset.type;
        handleOpenModal(currentValue, dataType);
        setAnchorEl(null);
    };

    const handleChange = () => {
        setExpanded(!expanded);
    };

    const handleClickStudentMenu = useCallback(({ currentTarget }) => {
        setStudentMenuAnchorEl(currentTarget);
    }, []);

    const handleCloseStudentMenu = useCallback(() => {
        setStudentMenuAnchorEl(null);
    }, []);

    const handleUnenroll = useCallback(
        (enrollment) => () => {
            setUnenroll({
                enrollment,
                open: true,
            });
        },
        []
    );

    const closeUnenrollDialog = useCallback(
        (toUnenroll) => () => {
            if (toUnenroll) {
                deleteEnrollment(unenroll.enrollment)(dispatch);
            }
            setUnenroll({
                enrollment: null,
                open: false,
            });
            setStudentMenuAnchorEl(null);
        },
        [dispatch, unenroll.enrollment]
    );

    return (
        <>
            <Accordion
                expanded={expanded}
                classes={{ root: classes.MuiAccordionroot }}
            >
                <AccordionSummary
                    expandIcon={
                        <ExpandMoreIcon
                            style={{ color: omouBlue }}
                            fontSize='large'
                            onClick={handleChange}
                        />
                    }
                    aria-controls={'studentinfo-' + studentId + '-content'}
                    id={'studentinfo-' + studentId + '-details'}
                    eventKey={'studentinfo-' + studentId + '-details'}
                >
                    <TableRow
                        key={fullStudentName}
                        className={
                            location.pathname !==
                                `/coursemanagement/class/${courseID}` &&
                            classes.center
                        }
                        style={{ wordBreak: 'break-word' }}
                    >
                        <TableCell
                            component='th'
                            scope='row'
                            component={Link}
                            to={`/accounts/${accountType.toLowerCase()}/${studentId}`}
                            style={{ textDecoration: 'none', fontWeight: 700 }}
                            className={`${classes.studentRenderAccordionSpacing} ${classes.noBorderBottom}`}
                        >
                            {fullStudentName}
                        </TableCell>
                        <TableCell
                            component={Link}
                            to={
                                parentAccountType &&
                                `/accounts/${parentAccountType.toLowerCase()}/${parentId}`
                            }
                            style={{ textDecoration: 'none' }}
                            className={`${classes.parentRenderAccordionSpacing} ${classes.noBorderBottom}`}
                        >
                            {concatFullParentName}
                        </TableCell>
                        <TableCell
                            className={`${classes.actionsRenderAccordionSpacing} ${classes.noBorderBottom}`}
                        >
                            {phoneNumber}
                        </TableCell>
                        <TableCell>{inviteStatus}</TableCell>
                        <TableCell>
                            <ResponsiveButton onClick={handleInvite}>
                                {googleClassroomStatusMessage}
                            </ResponsiveButton>
                        </TableCell>
                        <TableCell
                            align='right'
                            padding='none'
                            size='small'
                            className={classes.noBorderBottom}
                        >
                            <ResponsiveButton
                                aria-controls='simple-menu'
                                aria-haspopup='true'
                                onClick={handleClick}
                                className={`${classes.iconRenderAccordionSpacing} ${classes.noBorderBottom}`}
                            >
                                <MailOutlineIcon
                                    style={{ color: 'rgb(112,105,110)' }}
                                />
                            </ResponsiveButton>
                            <AccessControlComponent
                                permittedAccountTypes={[
                                    USER_TYPES.admin,
                                    USER_TYPES.instructor,
                                    USER_TYPES.receptionist,
                                ]}
                            >
                                <Menu
                                    id='simple-menu'
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    classes={{ list: classes.dropdown }}
                                >
                                    <MenuItem
                                        onClick={handleOpen}
                                        className={classes.menuSelected}
                                        value={studentId}
                                        data-type={accountType}
                                    >
                                        Email Student
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleOpen}
                                        className={classes.menuSelected}
                                        value={parentId}
                                        data-type={parentAccountType}
                                    >
                                        Email Parent
                                    </MenuItem>
                                </Menu>
                            </AccessControlComponent>
                        </TableCell>
                        {location.pathname ===
                        `/coursemanagement/class/${courseID}` ? (
                            <TableCell
                                align='right'
                                padding='none'
                                size='small'
                                className={`${classes.iconRenderAccordionSpacing} ${classes.noBorderBottom}`}
                            >
                                <ResponsiveButton
                                    disabled
                                    style={{ border: 'none' }}
                                >
                                    <ChatOutlinedIcon
                                        style={{ color: 'rgb(112,105,110)' }}
                                    />
                                </ResponsiveButton>
                            </TableCell>
                        ) : (
                            <TableCell
                                className={`${classes.iconRenderAccordionSpacing} ${classes.noBorderBottom}`}
                            >
                                <IconButton
                                    aria-controls='simple-menu'
                                    aria-haspopup='true'
                                    onClick={handleClickStudentMenu}
                                >
                                    <MobileMenu />
                                </IconButton>
                                <Menu
                                    anchorEl={studentMenuAnchorEl}
                                    id='simple-menu'
                                    keepMounted
                                    onClose={handleCloseStudentMenu}
                                    open={studentMenuAnchorEl !== null}
                                >
                                    <MenuItem
                                        component={Link}
                                        onClick={handleCloseStudentMenu}
                                        to={`/accounts/student/${studentId}/${courseID}`}
                                    >
                                        View Enrollment
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleUnenroll(enrollmentID)}
                                    >
                                        Unenroll
                                    </MenuItem>
                                </Menu>
                            </TableCell>
                        )}
                        <TableCell
                            align='right'
                            padding='none'
                            size='small'
                            className={classes.noBorderBottom}
                        ></TableCell>
                    </TableRow>
                </AccordionSummary>
                <StudentEnrollmentBackground studentInfo={studentInfo} />
            </Accordion>
            <Dialog
                aria-describedby='unenroll-dialog-description'
                aria-labelledby='unenroll-dialog-title'
                className='session-view-modal'
                fullWidth
                maxWidth='xs'
                onClose={closeUnenrollDialog(false)}
                open={unenroll.open}
            >
                <DialogTitle id='unenroll-dialog-title'>
                    Unenroll in {courseTitle}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText>
                        You are about to unenroll in <b>{courseTitle}</b> for{' '}
                        <b>
                            {unenroll.enrollment &&
                                fullName(
                                    enrollmentList.find(
                                        ({ id }) => id == unenroll.enrollment
                                    ).student.user
                                )}
                        </b>
                        . Performing this action will credit the remaining
                        enrollment balance back to the parent's account balance.
                        Are you sure you want to unenroll?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ResponsiveButton
                        variant='outlined'
                        color='secondary'
                        onClick={closeUnenrollDialog(true)}
                    >
                        Yes, unenroll
                    </ResponsiveButton>
                    <ResponsiveButton
                        variant='outlined'
                        color='primary'
                        onClick={closeUnenrollDialog(false)}
                    >
                        Cancel
                    </ResponsiveButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ClassEnrollmentRow;
