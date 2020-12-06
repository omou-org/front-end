import { Grid, Hidden, makeStyles } from '@material-ui/core';
import React from 'react';
import { h2, white } from 'theme/muiTheme';
import ProfileHeading from './ProfileHeading';
import UserAvatar from './UserAvatar';

const useStyles = makeStyles({
    profileInfo: {
        paddingBottom: '4%',
        paddingTop: '3%',
    },
});

const UserProfileInfo = ({ user }) => {
    const classes = useStyles();

    return (
        <Grid className={classes.profileInfo} container layout="row">
            <Grid item md={2} style={{ maxWidth: '195px' }}>
                <Hidden smDown>
                    <UserAvatar
                        margin="0"
                        name={`${user.user.firstName} ${user.user.lastName}`}
                        size="136px"
                        style={{ ...h2, color: white }}
                    />
                </Hidden>
            </Grid>
            <Grid item md={10} xs={12}>
                <ProfileHeading ownerID={user.user.id} />
            </Grid>
        </Grid>
    );
};

export default UserProfileInfo;
