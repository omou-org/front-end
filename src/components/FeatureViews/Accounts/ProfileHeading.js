import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/EditOutlined';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MoneyIcon from '@material-ui/icons/LocalAtmOutlined';
import PhoneIcon from '@material-ui/icons/PhoneOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import './Accounts.scss';
import { addDashes } from './accountUtils';
import { ReactComponent as GradeIcon } from '../../grade.svg';
import { ReactComponent as IDIcon } from '../../identifier.svg';
import InstructorAvailability from './InstructorAvailability';
import OutOfOffice from './OutOfOffice';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';
import { ReactComponent as SchoolIcon } from '../../school.svg';
import CakeOutlinedIcon from '@material-ui/icons/CakeOutlined';
import { USER_TYPES } from 'utils';
import { capitalizeString } from 'utils';
import { darkGrey } from 'theme/muiTheme';
import Loading from 'components/OmouComponents/Loading';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { useSelector } from 'react-redux';

const useStyles = makeStyles({
    icon: {
        fill: darkGrey,
    },
    text: {
        color: darkGrey,
    },
    link: {
        textDecoration: 'none',
    },
    iconContainer: {
        paddingTop: '3px',
    },
});

const GET_PROFILE_HEADING_QUERY = {
    admin: gql`
        query getAdmimUserInfo($userID: ID!) {
            userInfo(userId: $userID) {
                ... on AdminType {
                    birthDate
                    accountType
                    adminType
                    phoneNumber
                    user {
                        firstName
                        lastName
                        lastLogin
                        email
                        id
                    }
                }
            }
        }
    `,
    instructor: gql`
        query getInstructorUserInfo($userID: ID!) {
            userInfo(userId: $userID) {
                ... on InstructorType {
                    birthDate
                    accountType
                    phoneNumber
                    user {
                        firstName
                        lastName
                        email
                        id
                    }
                }
            }
        }
    `,
    parent: gql`
        query getParentUserInfo($userID: ID!) {
            userInfo(userId: $userID) {
                ... on ParentType {
                    birthDate
                    accountType
                    phoneNumber
                    balance
                    user {
                        firstName
                        lastName
                        email
                        id
                    }
                }
            }
        }
    `,
    student: gql`
        query getStudentUserInfo($userID: ID!) {
            userInfo(userId: $userID) {
                ... on StudentType {
                    birthDate
                    accountType
                    phoneNumber
                    grade
                    school {
                        name
                        id
                    }
                    user {
                        firstName
                        lastName
                        email
                        id
                    }
                }
            }
        }
    `,
};

const ProfileHeading = ({ ownerID }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const { accountType } = useParams();

    const loggedInUserID = useSelector(({ auth }) => auth.user.id);

    const { data, loading, error } = useQuery(
        GET_PROFILE_HEADING_QUERY[accountType],
        {
            variables: { userID: ownerID },
        }
    );

    if (loading) return <Loading />;

    if (error) return `Error: ${error}`;
    const { userInfo } = data;

    const isAdmin = userInfo.accountType === USER_TYPES.admin;
    const isAuthUser = userInfo.user.id === loggedInUserID;

    const handleOpen = ({ currentTarget }) => {
        setAnchorEl(currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // if logged in user is admin

    const renderEditandAwayButton = () => (
        <Grid container item xs={4}>
            {accountType === 'instructor' && (
                <Grid align="left" className="schedule-button" item xs={12}>
                    <ResponsiveButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleOpen}
                        variant="outlined"
                        startIcon={<CalendarIcon />}
                    >
                        Schedule Options
                    </ResponsiveButton>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        onClose={handleClose}
                        open={anchorEl !== null}
                    >
                        {/* <InstructorAvailability
                            button={false}
                            instructorID={ownerID}
                        />
                        <OutOfOffice button={false} instructorID={ownerID} /> */}
                    </Menu>
                </Grid>
            )}
            {(isAdmin || isAuthUser) && (
                <>
                    <Grid component={Hidden} item mdDown xs={12}>
                        <ResponsiveButton
                            component={Link}
                            to={`/form/${userInfo.accountType}/${userInfo.user.id}`}
                            variant="outlined"
                            startIcon={<EditIcon />}
                        >
                            Edit Profile
                        </ResponsiveButton>
                    </Grid>
                    <Grid component={Hidden} item lgUp xs={12}>
                        <Button
                            component={Link}
                            to={`/form/${userInfo.accountType}/${userInfo.user.id}`}
                            variant="outlined"
                        >
                            <EditIcon />
                        </Button>
                    </Grid>
                </>
            )}
        </Grid>
    );

    const profileDetails = () => {
        const InfoRow = ({ variant, width = 6 }) => {
            const type = {
                ID: {
                    icon: <IDIcon className={classes.icon} />,
                    text: `#${userInfo.user.id}`,
                },
                Phone: {
                    icon: <PhoneIcon className={classes.icon} />,
                    text: addDashes(userInfo.phoneNumber),
                },
                Birthday: {
                    icon: <CakeOutlinedIcon className={classes.icon} />,
                    text: userInfo.birthday,
                },
                Grade: {
                    icon: <GradeIcon className={classes.icon} />,
                    text: `Grade ${userInfo?.grade}`,
                },
                School: {
                    icon: <SchoolIcon className={classes.icon} />,
                    text: userInfo.school?.name,
                },
                Balance: {
                    icon: <MoneyIcon className={classes.icon} />,
                    text: `$${userInfo.balance}`,
                },
                Email: {
                    icon: <EmailIcon className={classes.icon} />,
                    text: userInfo.user.email,
                },
            };

            if (variant === 'Email' && userInfo.user.email !== '') {
                return (
                    <>
                        <Grid item md={1} className={classes.iconContainer}>
                            <a href={`mailto:${userInfo.user.email}`}>
                                <EmailIcon className={classes.icon} />
                            </a>
                        </Grid>
                        <Grid item md={width - 1}>
                            <a
                                className={classes.link}
                                href={`mailto:${userInfo.user.email}`}
                            >
                                <Typography
                                    variant="body1"
                                    className={classes.text}
                                >
                                    {userInfo.user.email}
                                </Typography>
                            </a>
                        </Grid>
                    </>
                );
            } else {
                return (
                    <>
                        <Grid item xs={1} className={classes.iconContainer}>
                            {type[variant].icon}
                        </Grid>
                        <Grid item xs={width - 1}>
                            <Typography
                                variant="body1"
                                className={classes.text}
                            >
                                {type[variant].text}
                            </Typography>
                        </Grid>
                    </>
                );
            }
        };

        switch (accountType) {
            case 'student':
                return (
                    <>
                        <InfoRow variant="ID" />
                        <InfoRow variant="Grade" />
                        <InfoRow variant="Phone" />
                        <InfoRow variant="School" />
                        <InfoRow variant="Email" />
                        <InfoRow variant="Birthday" />
                    </>
                );
            case 'instructor':
                return (
                    <>
                        <InfoRow variant="ID" />
                        <InfoRow variant="Email" />
                        <InfoRow variant="Phone" />
                        <InfoRow variant="Birthday" />
                    </>
                );
            case 'parent':
                return (
                    <>
                        <InfoRow variant="ID" />
                        <InfoRow variant="Email" />
                        <InfoRow variant="Phone" />
                        <InfoRow variant="Balance" />
                    </>
                );
            default:
                return (
                    <>
                        <InfoRow variant="ID" />
                        <InfoRow variant="Email" />
                        <InfoRow variant="Phone" />
                    </>
                );
        }
    };

    return (
        <Grid
            alignItems="center"
            container
            item
            xs={12}
            style={{ margin: accountType === 'INSTRUCTOR' ? '-20px 0' : '0' }}
        >
            <Grid align="left" alignItems="center" container item xs={8}>
                <Grid className="profile-name" item style={{ marginRight: 20 }}>
                    <Typography variant="h3">
                        {userInfo.user.firstName} {userInfo.user.lastName}
                    </Typography>
                </Grid>
                <Grid item>
                    <Hidden smDown>
                        <LabelBadge variant="outline-gray">
                            {accountType}
                        </LabelBadge>
                    </Hidden>
                </Grid>
            </Grid>
            {renderEditandAwayButton()}
            <Grid
                container
                align="left"
                alignItems="center"
                style={{
                    width: '430px',
                    margin: accountType === 'INSTRUCTOR' ? '-10px 0' : '10px 0',
                }}
            >
                {profileDetails()}
            </Grid>
        </Grid>
    );
};

ProfileHeading.propTypes = {
    // user: PropTypes.shape({
    // 	balance: PropTypes.string,
    // 	birthday: PropTypes.string,
    // 	email: PropTypes.string,
    // 	grade: PropTypes.number,
    // 	name: PropTypes.string,
    // 	phone_number: PropTypes.string,
    // 	// role: PropTypes.oneOf(["instructor", "parent", "receptionist", "student"]),
    // 	school: PropTypes.string,
    // 	summit_id: PropTypes.string,
    // 	user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // }).isRequired,
};

export default ProfileHeading;
