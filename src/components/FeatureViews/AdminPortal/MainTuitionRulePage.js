import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField } from '@material-ui/core';
import { slateGrey, omouBlue, white, body1 } from '../../../theme/muiTheme';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';
import { makeStyles } from '@material-ui/styles';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
    editBtn: {
        marginTop: '1rem',
        marginBottom: '1rem',
    },
    label: {
        color: slateGrey,
    },
    marginVertLarge: {
        marginBottom: '2rem',
    },
    marginVertSm: {
        marginBottom: '0.5rem',
    },
    tuitionRateField: {
        ...body1,
        height: '2rem',
        width: '5.645rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
});

const MainTuitionRulePage = ({ location }) => {
    const classes = useStyles();

    const [showEdit, setShowEdit] = useState(false);
    const toggleShowEdit = () => setShowEdit(!showEdit);

    const {
        state: { id, name, privateRules, smallGroupRules },
    } = location;

    console.log(id);

    const tutoringType = privateRules
        ? 'Private'
        : smallGroupRules
        ? 'Small Group'
        : 'Class';

    const instructor =
        ((privateRules && privateRules.length === 0) ||
            (smallGroupRules && smallGroupRules.length === 0)) &&
        'All';

    return (
        <Grid
            container
            direction='column'
            justify='center'
            alignItems='flex-start'
        >
            <Grid className={classes.editBtn} item>
                <ResponsiveButton variant='outlined' onClick={toggleShowEdit}>
                    Edit
                </ResponsiveButton>
            </Grid>

            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Topic
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant='body1'>{name}</Typography>
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Tutoring Type
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant='body1'>{tutoringType}</Typography>
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Instructor
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant='body1'>{instructor}</Typography>
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Tuition Rate
                    </Typography>
                </Grid>

                <Grid item>
                    {showEdit ? (
                        <TextField
                            variant='outlined'
                            InputProps={{
                                classes: {
                                    root: classes.tuitionRateField,
                                },
                            }}
                        />
                    ) : (
                        <Typography variant='body1'>
                            <LabelBadge
                                style={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                }}
                                variant='round-negative'
                            >
                                !
                            </LabelBadge>
                            &nbsp; Not Set
                        </Typography>
                    )}
                </Grid>
            </Grid>

            {showEdit && (
                <Grid
                    item
                    container
                    direction='column'
                    justify='center'
                    alignItems='flex-start'
                    xs={12}
                    style={{ marginTop: '3rem' }}
                >
                    <Grid
                        item
                        xs={2}
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                    >
                        <Grid item>
                            <ResponsiveButton
                                onClick={toggleShowEdit}
                                variant='outlined'
                            >
                                cancel
                            </ResponsiveButton>
                        </Grid>
                        <Grid item>
                            <ResponsiveButton variant='contained'>
                                update
                            </ResponsiveButton>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

MainTuitionRulePage.propTypes = {
    location: PropTypes.object,
    // match: PropTypes.object,
};

export default withRouter(MainTuitionRulePage);
