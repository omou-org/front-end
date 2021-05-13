import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { white, darkGrey, body1 } from '../../../theme/muiTheme';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    modalStyle: {
        top: '50%',
        left: `50%`,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        width: '31rem',
        // height: '15.5rem',
        height: '15rem',
        background: white,
        boxShadow: '0px 0px 8px rgba(153, 153, 153, 0.8);',
        borderRadius: '5px',
    },
    subjectInput: {
        ...body1,
        height: '2rem',
        width: '13rem',
        color: darkGrey
    },
    descriptionInput: {
        ...body1,
        height: '2rem',
        width: '16.0625rem',
        color: darkGrey
    },
    borderStyles: {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid #404143',
    }
});

const CreateSubjectModal = ({ closeModal }) => {
    const classes = useStyles();
    return (
        <Grid container className={classes.modalStyle}>
            <Grid item style={{ padding: '2rem 1rem 0rem 2rem' }}>
                <Typography variant='h3'>Create New Subject</Typography>

                <Grid
                    item
                    direction='column'
                    justify='center'
                    alignItems='flex-start'
                    style={{ marginTop: '1.5rem', marginBottom: '2rem', width: '27rem' }}
                >
                    <TextField
                        // size='small'
                        // type='text'
                        placeholder='* Subject (max 30 characters)'
                        // value={}
                        variant='outlined'
                        InputProps={{
                            classes: {
                                root: classes.subjectInput,
                                notchedOutline:classes.borderStyles
                            },
                        }}
                        // onChange={(e) =>}
                    />

                    <TextField
                        // size='small'
                        // type='text'
                        placeholder='Description (max 80 characters)'
                        // value={}
                        variant='outlined'
                        InputProps={{
                            classes: {
                                root: classes.descriptionInput,
                                notchedOutline:classes.borderStyles
                            },
                        }}
                        // onChange={(e) =>}
                    />
                </Grid>

                <Grid style={{ textAlign: 'right' }} item xs={12}>
                    <ResponsiveButton
                        style={{ border: 'none', color: darkGrey }}
                        variant='outlined'
                        onClick={closeModal}
                    >
                        cancel
                    </ResponsiveButton>
                    <ResponsiveButton
                        style={{
                            border: 'none',
                            background: white,
                        }}
                        variant='outlined'
                    >
                        create subject
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

CreateSubjectModal.propTypes = {
    closeModal: PropTypes.func,
};

export default CreateSubjectModal;
