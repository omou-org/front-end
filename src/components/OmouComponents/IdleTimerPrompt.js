import React, {useCallback, useEffect, useState} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {ResponsiveButton} from '../../theme/ThemedComponents/Button/ResponsiveButton';
import Dialog from '@material-ui/core/Dialog';
import {closeRegistrationCart} from './RegistrationUtils';
import {logout, setToken} from '../../actions/authActions';
import {useIdleTimer} from 'react-idle-timer';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

const REFRESH_TOKEN = gql`
    mutation RefreshToken($token: String!) {
        __typename
        refreshToken(token: $token) {
            token
        }
    }
`;

export default function IdleTimerPrompt() {
    const savedToken = useSelector(({ auth }) => auth.token);
    const [openIdlePrompt, setIdlePrompt] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const [refreshToken] = useMutation(REFRESH_TOKEN, {
        onCompleted: async (data) => {
            dispatch(await setToken(data.refreshToken.token, true));
        },
    });

    const handleOnIdle = (event) => {
        setIdlePrompt(true);
    };

    const handleOnActive = (event) => {
        const refreshTokenTime = 1000 * 60 * 5;
        const remainingTimeBeforeLogout = getRemainingTime();
        if (remainingTimeBeforeLogout <= refreshTokenTime && !openIdlePrompt) {
            refreshToken({
                variables: {
                    token: savedToken,
                },
            });
        }
    };

    const handleOnPromptClose = () => {
        setIdlePrompt(false);
        refreshToken({
            variables: {
                token: savedToken,
            },
        });
    };

    const handleLogout = useCallback(() => {
        if (openIdlePrompt) {
            closeRegistrationCart();
            dispatch(logout());
            history.push('/login');
        }
    }, [dispatch, history]);

    useEffect(() => {
        if (openIdlePrompt) {
            setInterval(() => {
                setIdlePrompt(false);
                handleLogout();
            }, 1000 * 60 * 2);
        }
    }, [openIdlePrompt]);

    const { getRemainingTime } = useIdleTimer({
        timeout: 1000 * 60 * 18,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        debounce: 500,
    });

    return (
        <Dialog open={openIdlePrompt}>
            <DialogTitle disableTypography>
                <Typography variant='h4'>Are you still there?</Typography>
            </DialogTitle>
            <DialogContent>
                Looks like you've been idle for a while. To make sure no one
                will use your account behind your back, you will be logged out
                automatically within 2 minutes.
            </DialogContent>
            <DialogActions>
                <ResponsiveButton
                    onClick={handleOnPromptClose}
                    color='primary'
                    variant='contained'
                >
                    Yes
                </ResponsiveButton>
            </DialogActions>
        </Dialog>
    );
}
