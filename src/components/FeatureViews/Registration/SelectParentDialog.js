import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

import * as types from 'actions/actionTypes';
import AccountCard from '../Search/cards/AccountCard';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fullName } from '../../../utils';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

const GET_PARENTS_QUERY = gql`
    query GetParents($query: String!) {
        accountSearch(query: $query, profile: "PARENT") {
            results {
                ... on ParentType {
                    user {
                        firstName
                        lastName
                        id
                        email
                    }
                    studentIdList
                }
            }
        }
    }
`;

export const GET_REGISTRATION_CART = gql`
    query GetRegisteringCart($parent: ID!) {
        registrationCart(parentId: $parent) {
            registrationPreferences
        }
    }
`;

const SelectParentDialog = ({ onClose, open }) => {
    const dispatch = useDispatch();
    const [parent, setParent] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [searching, setSearching] = useState(false);
    const { currentParent } = useSelector((state) => state.Registration);
    const [getSavedParentCart, getSavedParentCartResult] = useLazyQuery(
        GET_REGISTRATION_CART,
        {
            onCompleted: (data) => {
                const savedParentCart =
                    data.registrationCart.registrationPreferences;
                if (savedParentCart !== '') {
                    const studentRegistration = JSON.parse(
                        getSavedParentCartResult.data?.registrationCart
                            ?.registrationPreferences
                    );
                    dispatch({
                        type: types.INIT_COURSE_REGISTRATION,
                        payload: studentRegistration,
                    });
                }
            },
            skip: !currentParent,
        }
    );

    const [getParents, { loading, data }] = useLazyQuery(GET_PARENTS_QUERY);

    const handleClose = useCallback(() => {
        // if there's something in the input
        if (parent) {
            const registeringParent = parent;

            dispatch({
                type: types.SET_PARENT,
                payload: registeringParent,
            });
            getSavedParentCart({
                variables: {
                    parent: registeringParent.user.id,
                },
            });
        }
        // close the dialogue
        onClose(!!parent);
    }, [parent, dispatch, onClose, getSavedParentCart]);

    const handleExitParent = useCallback(
        (event) => {
            event.preventDefault();
            setParent(null);
            dispatch({
                type: types.CLOSE_COURSE_REGISTRATION,
                payload: {},
            });
            onClose();
        },
        [dispatch, onClose]
    );

    const handleOnChange = useCallback(
        (_, newValue) => {
            setSearching(false);
            setParent(newValue?.value);
        },
        [setParent]
    );

    const handleOnInputChange = useCallback(
        (_, newValue) => {
            if (typeof newValue === 'string') {
                setSearching(true);
                setInputValue(newValue || '');
                getParents({ variables: { query: newValue } });
            }
        },
        [getParents, setSearching, setInputValue]
    );

    const SelectParentInput = (params) => (
        <TextField
            {...params}
            label='Search Parent'
            variant='outlined'
            InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <React.Fragment>
                        {loading ? (
                            <CircularProgress color='inherit' size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                    </React.Fragment>
                ),
            }}
        />
    );

    const options = data
        ? data.accountSearch.results.map((parent) => ({
              label: fullName(parent.user),
              value: parent,
          }))
        : [];

    return (
        <Dialog
            aria-labelledby='simple-dialog-title'
            className='select-parent-dialog'
            onClose={handleClose}
            open={open}
        >
            <DialogTitle disableTypography id='simple-dialog-title'>
                Currently helping
            </DialogTitle>
            <DialogContent>
                {currentParent ? (
                    <div className='active-parent-dialog-content'>
                        <Grid container direction='row' justify='center'>
                            <Grid item>
                                <AccountCard
                                    accountType='PARENT'
                                    userID={currentParent.user.id}
                                />
                            </Grid>
                        </Grid>
                    </div>
                ) : (
                    <div
                        className={`select-parent-search-wrapper ${
                            searching && 'active'
                        }`}
                    >
                        <Autocomplete
                            data-cy='select-parent-input'
                            loading={loading}
                            options={options}
                            selectOnFocus
                            autoHighlight
                            onChange={handleOnChange}
                            onInputChange={handleOnInputChange}
                            getOptionLabel={(option) => option.label}
                            renderOption={(option) => (
                                <div data-cy={`parent-option`}>
                                    {option.label}
                                </div>
                            )}
                            renderInput={SelectParentInput}
                            inputValue={inputValue}
                            noOptionsText="We haven't found a parent yet"
                            loadingText="We're searching for a parent..."
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                {currentParent ? (
                    <ResponsiveButton
                        variant='outlined'
                        onClick={handleExitParent}
                        data-cy='exit-parent-action'
                    >
                        exit parent
                    </ResponsiveButton>
                ) : (
                    <ResponsiveButton
                        variant='outlined'
                        data-cy='set-parent-action'
                        onClick={handleClose}
                    >
                        set parent
                    </ResponsiveButton>
                )}
            </DialogActions>
        </Dialog>
    );
};

SelectParentDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default SelectParentDialog;
