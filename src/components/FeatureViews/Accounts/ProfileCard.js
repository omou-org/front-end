import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import Grid from '@material-ui/core/Grid';
import { NavLink } from 'react-router-dom';
import PhoneIcon from '@material-ui/icons/PhoneOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { stringToColor } from './accountUtils';
import theme from '../../../theme/muiTheme';

import './Accounts.scss';
import { addDashes } from './accountUtils';
import { capitalizeString } from 'utils';
import { ReactComponent as IDIcon } from 'components/identifier.svg';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const useStyles = makeStyles({
    linkUnderline: {
        textDecoration: 'none',
        color: 'black',
    },
    inviteButton: {
        color: '#999999',
        marginBottom: '15px',
        marginRight: '10px',
    },
    ...theme.accountCardStyle,
});

const INVITE_STUDENT = gql`
    mutation InviteStudent($email: String!) {
        inviteStudent(email: $email) {
            errorMessage
            status
        }
    }
`;

const ProfileCard = ({ user, route, studentInvite = false }) => {
    const [invite] = useMutation(INVITE_STUDENT, {
        ignoreResults: true,
    });
    const inviteStudent = useCallback(
        (event) => {
            event.stopPropagation();
            invite({
                variables: {
                    email: user?.email,
                },
            });
        },
        [invite, user]
    );

    const classes = useStyles();

    return (
        <Grid item sm={4} xs={12}>
            {user && (
                <Card className={classes.cardContainer}>
                    <Grid className={classes.gridContainer} container>
                        <Grid
                            style={{ background: stringToColor(user.name) }}
                            className={classes.leftStripe}
                            item
                            xs={2}
                        >
                            {user.name[0]}
                            {user.name[user.name.indexOf(' ') + 1]}
                        </Grid>

                        <Grid className={classes.cardRight} item xs={10}>
                            <Grid className={classes.cardHeader} container>
                                <NavLink
                                    className={classes.linkUnderline}
                                    to={route}
                                >
                                    <CardHeader
                                        style={{ textAlign: 'left' }}
                                        title={user.name}
                                        subheader={capitalizeString(
                                            user.accountType
                                        )}
                                    />
                                </NavLink>
                                {/* {studentInvite && 
                                    <Button className={classes.inviteButton} onClick={inviteStudent}>
                                        Invite
                                    </Button>
                                } */}
                            </Grid>

                            <Grid container style={{ marginLeft: '2px' }}>
                                <Grid
                                    className={classes.iconStyles}
                                    item
                                    xs={2}
                                >
                                    <IDIcon height={22} width={20.5} />
                                </Grid>

                                <Grid
                                    className={classes.accountInfo}
                                    item
                                    xs={10}
                                >
                                    <Typography variant='body1'>
                                        #{user.user.id}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container style={{ marginLeft: '4px' }}>
                                <Grid
                                    className={classes.iconStyles}
                                    item
                                    xs={2}
                                >
                                    <PhoneIcon height={22} width={20.5} />
                                </Grid>

                                <Grid
                                    className={classes.accountInfo}
                                    item
                                    xs={10}
                                >
                                    <Typography variant='body1'>
                                        {addDashes(user.phoneNumber)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container style={{ marginLeft: '5px' }}>
                                <Grid
                                    className={classes.iconStyles}
                                    item
                                    xs={2}
                                >
                                    <EmailIcon height={22} width={20.5} />
                                </Grid>

                                <Grid
                                    className={classes.accountInfo}
                                    item
                                    xs={10}
                                >
                                    <Typography variant='body1'>
                                        {user.user.email}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            )}
        </Grid>
    );
};

ProfileCard.propTypes = {
    route: PropTypes.string,
    studentInvite: PropTypes.bool,
    user: PropTypes.shape({
        email: PropTypes.string,
        name: PropTypes.string,
        phone_number: PropTypes.string,
        role: PropTypes.oneOf([
            'instructor',
            'parent',
            'receptionist',
            'student',
        ]).isRequired,
        user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

export default ProfileCard;
