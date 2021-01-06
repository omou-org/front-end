import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";

import { ResponsiveButton } from "../../../theme/ThemedComponents/Button/ResponsiveButton";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/EditOutlined";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import MoneyIcon from "@material-ui/icons/LocalAtmOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';
import { darkGrey } from 'theme/muiTheme';
import CakeOutlinedIcon from '@material-ui/icons/CakeOutlined';

import ResetPasswordDialogs from "./ResetPasswordDialogs"

import { useSearchParams } from "actions/hooks";
import Loading from "components/OmouComponents/Loading";
import "./Accounts.scss";
import { addDashes } from "./accountUtils";
import { ReactComponent as GradeIcon } from "../../grade.svg";
import { ReactComponent as IDIcon } from "../../identifier.svg";
import { ReactComponent as SchoolIcon } from "../../school.svg";

import { fullName, USER_TYPES } from "utils";
import generatePassword from "password-generator";
import UserProfileInfo from "./UserProfileInfo";
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
const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $userId: ID!) {
    resetPassword(newPassword: $password, userId: $userId) {
      status
    }
  }
`;

const ProfileHeading = ({ ownerID }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const { accountType } = useParams();

    const [open, setOpen] = useState(false);
    const [openReset, setResetOpen] = useState(false);
    const [password, setPassword] = useState();

    const loggedInUserID = useSelector(({ auth }) => auth.user.id);
    const loggedInAuth = useSelector(({ auth }) => auth);

    const { data, loading, error } = useQuery(
        GET_PROFILE_HEADING_QUERY[accountType],
        {
            variables: { userID: ownerID },
        }
    );
  const [resetPassword, resetStatus] = useMutation(RESET_PASSWORD);
    if (loading) return <Loading />;

    if (error) return `Error: ${error}`;
    const { userInfo } = data;

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClosePassword = () => {
      setOpen(false);
    };
  
    const handleClosePasswordReset = () => {
      setOpen(false);
      setResetOpen(true);
      const newPassword = generatePassword(8, false, /[\w\?\-]/);
      setPassword(newPassword);
  
      resetPassword({
        variables: {
          password: newPassword,
          userId: userInfo.user.id,
        },
      });
    };

    const handleCloseReset = () => {
      setResetOpen(false);
    };


    const handleOpen = ({ currentTarget }) => {
        setAnchorEl(currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isAdmin = loggedInAuth.accountType === USER_TYPES.admin;
    const isAuthUser = userInfo.user.id === loggedInUserID;
    const isStudentProfile = userInfo.accountType === "STUDENT";

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
                        
                    <EditIcon className="editIcon" />
                    <div className="editResetDiv">
                        <ResponsiveButton
                            component={Link}
                            to={`/form/${userInfo.accountType.toLowerCase()}/${userInfo.user.id}`}
                            className="edit"
                        >
                            Edit Profile
                        </ResponsiveButton>
                        {isAdmin && (
                <ResponsiveButton
                  className="reset"
                  disabled={isStudentProfile}
                  onClick={handleClickOpen}
                >
                  Reset Password
                </ResponsiveButton>
              )}
            </div>
            <ResetPasswordDialogs
                userInfo = {userInfo}
                handleClosePassword = {handleClosePassword}
                handleClosePasswordReset = {handleClosePasswordReset}
                handleCloseReset = {handleCloseReset}
                open = {open}
                openReset = {openReset}
                password = {password}

             />
                    </Grid>
                    <Grid component={Hidden} item lgUp xs={12}>
                        <ResponsiveButton
                            component={Link}
                            to={`/form/${userInfo.accountType.toLowerCase()}/${userInfo.user.id}`}
                            variant="outlined"
                        >
                            <EditIcon />
                        </ResponsiveButton>
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
                        {fullName(userInfo.user)}
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
