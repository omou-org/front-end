import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    // h4,
    h3,
    h5,
    slateGrey,
    white,
    darkGrey,
    // omouBlue,
    // body1,
    // body2,
} from '../../../../theme/muiTheme';
import { useMutation, gql } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import { ResponsiveButton } from '../../../../theme/ThemedComponents/Button/ResponsiveButton';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    root: {
        marginTop: '1rem',
    },
    breadcrumb: {
        width: '8.25rem',
        height: '1rem',
        ...h5,
    },
    codeHead: {
        ...h3,
    },
    label: {
        color: slateGrey,
    },
    vertMargin: {
        marginTop: '1rem',
    },
    marginVertSm: {
        marginBottom: '0.5rem',
    },
    modalStyle: {
        top: '50%',
        left: `50%`,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        width: '31.8em',
        height: '21em',
        background: white,
        boxShadow: '0px 0px 8px rgba(153, 153, 153, 0.8);',
        borderRadius: '5px',
    },
    modalTypography: {
        marginBottom: '1em',
    },
});

const RETIRE_DISCOUNT = gql`
    mutation($id: ID) {
        retireDiscount(id: $id) {
            retired
        }
    }
`;

const RetireModal = ({ closeModal, discountId }) => {
    const classes = useStyles();
    console.log(discountId);

    const [submitData] = useMutation(RETIRE_DISCOUNT, {
        onCompleted: () => {
            console.log('retired');
            closeModal();
        },
    });

    const onSubmit = () => {
        submitData({
            variables: {
                id: discountId
            },
        });
        // toggleShowEdit();
    };

    return (
        <Grid container className={classes.modalStyle}>
            <Grid item style={{ padding: '2rem' }} container>
                <Grid item>
                    <Typography align='left' variant='h3'>
                        Are you sure want to retire discount code?
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        align='left'
                        className={classes.modalTypography}
                        variant='h6'
                    >
                        This action cannot be undone. A retired discount will
                        not be valid if entered in the registration cart and
                        will not be auto applied. We advise to retire a discount
                        code if you wish to correct an incorrect discount code.
                    </Typography>
                </Grid>

                <Grid
                    item
                    container
                    direction='row'
                    justifyContent='flex-end'
                    alignItems='center'
                >
                    <Grid item xs={8}></Grid>
                    <Grid item xs={2}>
                        <ResponsiveButton
                            style={{
                                border: 'none',
                                color: darkGrey,
                            }}
                            variant='outlined'
                            onClick={closeModal}
                        >
                            cancel
                        </ResponsiveButton>
                    </Grid>
                    <Grid item xs={2}>
                        <ResponsiveButton
                            style={{
                                border: 'none',
                            }}
                            variant='outlined'
                            onClick={onSubmit}
                        >
                            retire
                        </ResponsiveButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

RetireModal.propTypes = {
    closeModal: PropTypes.func,
    discountId: PropTypes.string
};

export default RetireModal;
