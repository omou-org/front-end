import React, { useState } from 'react';

import {
    FormControl,
    FormControlLabel,
    Grid,
    Typography,
    TextField,
    // TableContainer,
    // TableCell,
    // TableHead,
    // Table,
    // TableRow,
    // TableBody,
    Radio,
    RadioGroup,
} from '@material-ui/core';
import {
    h4,
    slateGrey,
    omouBlue,
    white,
    body1,
} from '../../../../theme/muiTheme';
import Modal from '@material-ui/core/Modal';
import RetireModal from './RetireModal';
import Select from 'react-select';
import { makeStyles } from '@material-ui/styles';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TUITION_RULE = gql`
    query MyQuery($tuitionRuleId: ID) {
        tuitionRule(tuitionRuleId: $tuitionRuleId) {
            courseType
            instructors {
                user {
                    firstName
                    lastName
                }
            }
            id
            tuitionPriceList {
                hourlyTuition
            }
            category {
                name
            }
        }
    }
`;

const GET_INSTRUCTORS = gql`
    query getInstructors {
        instructors {
            user {
                id
                firstName
                lastName
            }
        }
    }
`;

const UPDATE_INSTRUCTOR_RULE = gql`
    mutation updateInstructorRule($id: ID, $hourlyTuition: Float) {
        createTuitionRule(
            id: $id
            hourlyTuition: $hourlyTuition
            allInstructorsApply: false
        ) {
            tuitionRule {
                id
                name
                category {
                    name
                }
                courseType
                instructors {
                    user {
                        id
                        firstName
                    }
                }
                business {
                    id
                }
                tuitionPriceList {
                    hourlyTuition
                    createdAt
                    allInstructorsApply
                }
            }
        }
    }
`;

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
    headCells: {
        ...h4,
        color: omouBlue,
    },
    header: {
        ...h4,
        color: slateGrey,
    },
});

const customStyles = {
    control: (base) => {
        return {
            ...base,
            border: `1px solid ${omouBlue}`,
            width: '28rem',
            height: '2rem',
            marginBottom: '2rem',
        };
    },
};

const ManageInstructorTuition = ({ location }) => {
    const {
        state: { id },
    } = location;
    const classes = useStyles();

    const [showEdit, setShowEdit] = useState(false);
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [hourlyTuition, setHourlyTuition] = useState();
    const [updateStatus, setUpdateStatus] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const handleUpdateChange = (e) => {
        const updateStatus = e.target.value;
        setUpdateStatus(updateStatus);
    };

    const handleOnChange = (e) => {
        const hourlyTuition = e.target.value;
        console.log(hourlyTuition);
        setHourlyTuition(hourlyTuition);
    };

    const handleInstructorChange = (e) => {
        console.log(e);
        setSelectedInstructors(e);
    };

    const toggleShowEdit = () => setShowEdit(!showEdit);

    const { loading: ruleLoading, error: ruleError, data: ruleData } = useQuery(
        GET_TUITION_RULE,
        {
            variables: {
                tuitionRuleId: id,
            },
            fetchPolicy: 'cache-and-network',
        }
    );

    console.log(ruleData);

    const [submitData] = useMutation(UPDATE_INSTRUCTOR_RULE, {
        onCompleted: (data) => {
            console.log(data);
        }
    });

    const onSubmit = () => {
        submitData({
            variables: {
                id: ruleData.id,
                hourlyTuition: hourlyTuition,
                instructors: selectedInstructors.map((item) => item.value),
            },
        });
    };

    const {
        loading: instructorLoading,
        error: instructorError,
        data: instructorData,
    } = useQuery(GET_INSTRUCTORS);

    if (ruleLoading || instructorLoading) return null;
    if (ruleError || instructorError)
        return `Error! ${ruleError || instructorError}`;

    const formatInstructorInfo = (instructorsArr) => {
        let instructors = [];

        instructorsArr.forEach(({ user }) => {
            instructors.push({
                value: Number(user.id),
                label: `${user.firstName} ${user.lastName}`,
            });
        });

        return instructors;
    };

    const instructorInfo = formatInstructorInfo(instructorData.instructors);

    const {
        tuitionRule: { courseType, category, instructors, tuitionPriceList },
    } = ruleData;

    console.log(ruleData);

    const tutoringType =
        courseType === 'TUTORING'
            ? 'Private'
            : courseType === 'SMALL_GROUP'
            ? 'Small Group'
            : 'Class';

    return (
        <Grid
            container
            direction='column'
            justify='center'
            alignItems='flex-start'
        >
            {!showEdit && (
                <Grid
                    className={classes.editBtn}
                    item
                    container
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    xs={12}
                >
                    <Grid item>
                        <ResponsiveButton
                            variant='outlined'
                            onClick={toggleShowEdit}
                        >
                            Edit
                        </ResponsiveButton>
                    </Grid>

                    <Grid item style={{ marginLeft: '1rem' }}>
                        <ResponsiveButton
                            variant='outlined'
                            onClick={handleModalOpen}
                        >
                            Retire
                        </ResponsiveButton>
                    </Grid>
                    <Modal
                        disableBackdropClick
                        open={modalOpen}
                        onClose={handleModalClose}
                    >
                        <RetireModal closeModal={handleModalClose} />
                    </Modal>
                </Grid>
            )}
            <Grid
                item
                container
                direction='column'
                justify='center'
                alignItems='flex-start'
                xs={12}
                className={classes.marginVertLarge}
                style={{ marginTop: showEdit && '2rem' }}
            >
                <Grid className={classes.marginVertSm} item>
                    <Typography className={classes.label} variant='h5'>
                        Topic
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant='body1'>{category.name}</Typography>
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

            {showEdit ? (
                <Select
                    isMulti
                    options={instructorInfo}
                    styles={customStyles}
                    placeholder='Select Instructors'
                    value={selectedInstructors}
                    onChange={handleInstructorChange}
                />
            ) : (
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
                        <Typography variant='body1'>
                            {instructors.map(({ user }, i) => (
                                <span key={user.id}>
                                    {user.firstName} {user.lastName}
                                    {i !== instructors.length - 1 && ','}{' '}
                                </span>
                            ))}
                        </Typography>
                    </Grid>
                </Grid>
            )}

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
                {showEdit ? (
                    <Grid item>
                        <TextField
                            variant='outlined'
                            value={hourlyTuition}
                            onChange={handleOnChange}
                            InputProps={{
                                classes: {
                                    root: classes.tuitionRateField,
                                },
                            }}
                        />{' '}
                    </Grid>
                ) : (
                    <Grid item>
                        <Typography variant='body1'>
                            ${tuitionPriceList[0].hourlyTuition}.00
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {showEdit && (
                <>
                    <Grid
                        item
                        container
                        direction='column'
                        justify='center'
                        alignItems='flex-start'
                        xs={12}
                        style={{ marginBottom: '3rem' }}
                    >
                        <Grid item>
                            <FormControl component='fieldset'>
                                <RadioGroup
                                    value={updateStatus}
                                    onChange={handleUpdateChange}
                                >
                                    <FormControlLabel
                                        value='newStudents'
                                        control={<Radio color='primary' />}
                                        label='Apply update only to new students enrolled to this tuition rule for new invoices'
                                    />
                                    <FormControlLabel
                                        value='allStudents'
                                        control={<Radio color='primary' />}
                                        label='Apply update to new invoices for both existing and new students enrolled with this tuition rule for new invoices'
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

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
                            <ResponsiveButton
                                onClick={onSubmit}
                                variant='contained'
                                disabled={ updateStatus ? false : true }
                            >
                                update
                            </ResponsiveButton>
                        </Grid>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

ManageInstructorTuition.propTypes = {
    location: PropTypes.object,
};

export default withRouter(ManageInstructorTuition);
