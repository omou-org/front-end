import React, {useCallback, useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {Link, useHistory, useLocation} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

import {ResponsiveButton} from '../../../theme/ThemedComponents/Button/ResponsiveButton';

import './registration.scss';
import SelectParentDialog from './SelectParentDialog';
import {fullName, USER_TYPES} from '../../../utils';
import {useValidateRegisteringParent} from '../../OmouComponents/RegistrationUtils';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag';
import Loading from '../../OmouComponents/Loading';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import * as types from 'actions/actionTypes';

const GET_PARENT_QUERY = gql`
    query GetRegisteringParent($userId: ID!) {
        __typename
        parent(userId: $userId) {
            user {
                firstName
                id
                lastName
                email
            }
            studentList
        }
    }
`;

const RegistrationActions = () => {
    const AuthUser = useSelector(({ auth }) => auth);
    const { currentParent, ...registrationState } = useSelector(
        (state) => state.Registration
    );
    const { parentIsLoggedIn } = useValidateRegisteringParent();
    const dispatch = useDispatch();

    const [dialogOpen, setDialog] = useState(false);
    const { data, error, loading } = useQuery(GET_PARENT_QUERY, {
        variables: { userId: AuthUser.user.id },
        skip: AuthUser.accountType !== USER_TYPES.parent,
    });
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        dispatch({
            type: types.INIT_COURSE_REGISTRATION,
            payload: {},
        });
    }, [types.INIT_COURSE_REGISTRATION, dispatch]);

    const openDialog = useCallback(() => {
        setDialog(true);
    }, []);

    const closeDialog = useCallback(() => {
        setDialog(false);
    }, []);

    useEffect(() => {
        if (
            parentIsLoggedIn &&
            !loading &&
            Object.values(registrationState).length === 0
        ) {
            dispatch({
                type: types.SET_PARENT,
                payload: data.parent,
            });
        }
    }, [AuthUser.accountType, loading]);

    if (loading) return <Loading />;
    if (error) return <div>There has been an error: {error.message}</div>;

    const registeringParent = data?.parent || currentParent;

    const parentName = registeringParent && fullName(registeringParent.user);
    const { submitStatus = {}, ...registrationCartState } = registrationState;
    const numberOfRegistrationsInCart = Object.values(registrationState).reduce(
        (accumulator, currentStudent) => accumulator + currentStudent?.length,
        0
    );

    const toShoppingCart = () => {
        history.push('/registration/cart');
    };

    const isCompletingRegistrationForm = location.pathname.includes('form');
    const isInRegistrationCart = location.pathname.includes('cart');

    const displayRegistrationButton =
        (currentParent || parentIsLoggedIn) &&
        !isCompletingRegistrationForm &&
        !isInRegistrationCart;

    return (
        <>
            <Grid
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
                spacing={1}
                style={{
                    borderBottom: '1px solid #C4C4C4',
                    marginBottom: '24px',
                }}
            >
                <Grid item md={9}>
                    {displayRegistrationButton && (
                        <Grid item xs={2}>
                            <ResponsiveButton
                                aria-controls='simple-menu'
                                aria-haspopup='true'
                                component={Link}
                                to='/registration/form/class-registration'
                                variant='contained'
                                data-cy='register-class'
                            >
                                register class
                            </ResponsiveButton>
                        </Grid>
                    )}
                </Grid>
                <Grid item xs={2}>
                    {registeringParent ? (
                        !data && (
                            <Tooltip title='Registering Parent'>
                                <ResponsiveButton
                                    variant='contained'
                                    onClick={openDialog}
                                    disabled={isCompletingRegistrationForm}
                                >
                                    {parentName}
                                </ResponsiveButton>
                            </Tooltip>
                        )
                    ) : (
                        <ResponsiveButton
                            variant='contained'
                            onClick={openDialog}
                            data-cy='select-parent'
                        >
                            SET PARENT
                        </ResponsiveButton>
                    )}
                </Grid>
                <Grid
                    item
                    xs={1}
                    style={{ paddingRight: '6vh', verticalAlign: 'middle' }}
                >
                    <IconButton
                        onClick={toShoppingCart}
                        disabled={numberOfRegistrationsInCart === 0}
                        data-cy='registration-cart'
                    >
                        <Badge
                            data-cy='shopping-cart-num-registrations'
                            badgeContent={numberOfRegistrationsInCart}
                            color='primary'
                            showZero
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <ShoppingCartIcon style={{ fontSize: '1.4em' }} />
                        </Badge>
                    </IconButton>
                </Grid>
            </Grid>
            <SelectParentDialog onClose={closeDialog} open={dialogOpen} />
        </>
    );
};

export default RegistrationActions;
