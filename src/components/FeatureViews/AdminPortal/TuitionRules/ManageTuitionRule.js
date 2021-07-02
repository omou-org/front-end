import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    FormControl,
    FormControlLabel,
    Grid,
    Typography,
    TextField,
    TableContainer,
    TableCell,
    TableHead,
    Table,
    TableRow,
    TableBody,
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
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';
import { makeStyles } from '@material-ui/styles';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { withRouter } from 'react-router-dom';
import { dateTimeToDate } from '../../../../utils';
import { useMutation, gql } from '@apollo/client';

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

const CREATE_DEFAULT_TUITION_RULE = gql`
    mutation createDefaultTuitionRule(
        $hourlyTuition: Float = 1.5
        $category: Int = 10
        $courseType: CourseTypeEnum = SMALL_GROUP
    ) {
        createTuitionRule(
            hourlyTuition: $hourlyTuition
            category: $category
            courseType: $courseType
            allInstructorsApply: true
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
                tuitionPriceList {
                    hourlyTuition
                    createdAt
                    allInstructorsApply
                }
                business {
                    id
                }
            }
        }
    }
`;

const UPDATE_DEFAULT_RULE = gql`
    mutation updateDefaultRule(
        $id: ID, 
        $hourlyTuition: Float = 1.5
        $courseType: CourseTypeEnum = SMALL_GROUP
    ) {
        createTuitionRule(
            id: $id
            hourlyTuition: $hourlyTuition
            courseType: $courseType
            allInstructorsApply: true
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

const ManageTuitionRule = ({ location }) => {
    const classes = useStyles();

    const {
        state: { id, name, tuitionruleSet, privateRules, smallGroupRules },
    } = location;

    const tuitionRuleId = tuitionruleSet.length
        ? tuitionruleSet[0].id
        : undefined;

    const firstTimePrivate = (privateRules && privateRules.length === 0) && !smallGroupRules;
    const firstTimeSmallGroup = (smallGroupRules && smallGroupRules.length ===  0) && !privateRules;

    const tutoringType = privateRules
        ? 'Private'
        : smallGroupRules
        ? 'Small Group'
        : 'Class';

    const getRuleEditHistory = (tuitionruleSet) => {
        let priceLists = tuitionruleSet.map(rule => rule.tuitionPriceList);
        // return priceLists;
        let ruleEditHistory;

        if (tutoringType === 'Private') {
            ruleEditHistory = priceLists.filter((priceList) => priceList[0].tuitionRule.courseType === 'TUTORING');
        } else if (tutoringType === 'Small Group') {
            ruleEditHistory = priceLists.filter((priceList) => priceList[0].tuitionRule.courseType === 'SMALL_GROUP');  
        } else {
            ruleEditHistory = priceLists.filter((priceList) => priceList[0].tuitionRule.courseType === 'CLASS');
        }
        // tuitionPriceList[0].tuitionRule.courseType
        return ruleEditHistory.flat(1);
    };

    const ruleEditHistory = getRuleEditHistory(tuitionruleSet);

    const instructor =
        ((privateRules &&
            (privateRules.length === 0 ||
                privateRules[0].allInstructorsApply)) ||
            (smallGroupRules &&
                (smallGroupRules.length === 0 ||
                    smallGroupRules[0].allInstructorsApply))) &&
        'All';

    const [showEdit, setShowEdit] = useState(false);
    const [hourlyTuition, setHourlyTuition] = useState();

    const [submitData] = useMutation(CREATE_DEFAULT_TUITION_RULE, {
        onCompleted: (data) => {
            console.log(data);
        },
        // update: (data, cache) => {
        //     console.log(data);
        //     console.log(cache);
        // }
    });

    const [submitUpdatedData] = useMutation(UPDATE_DEFAULT_RULE, {
        onCompleted: (data) => {
            console.log(data);
        },
    });

    const handleOnChange = (e) => {
        const hourlyTuition = e.target.value;
        setHourlyTuition(hourlyTuition);
    };

    const onSubmit = () => {
        submitData({
            variables: {
                hourlyTuition: hourlyTuition,
                category: id,
                courseType:
                    tutoringType === 'Private'
                        ? 'TUTORING'
                        : tutoringType === 'Small Group'
                        ? 'SMALL_GROUP'
                        : 'CLASS',
            },
        });
        // toggleShowEdit();
    };

    const onSubmitUpdate = () => {
        submitUpdatedData({
            variables: {
                hourlyTuition: hourlyTuition,
                id: tuitionRuleId,
                courseType:
                    tutoringType === 'Private'
                        ? 'TUTORING'
                        : tutoringType === 'Small Group'
                        ? 'SMALL_GROUP'
                        : 'CLASS',
            },
        });
        // toggleShowEdit();
    };

    const toggleShowEdit = () => setShowEdit(!showEdit);

    return (
        <Grid
            container
            direction='column'
            justify='center'
            alignItems='flex-start'
        >
            {!showEdit && (
                <Grid className={classes.editBtn} item>
                    <ResponsiveButton
                        variant='outlined'
                        onClick={toggleShowEdit}
                    >
                        Edit
                    </ResponsiveButton>
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
                            value={hourlyTuition}
                            onChange={handleOnChange}
                            InputProps={{
                                classes: {
                                    root: classes.tuitionRateField,
                                },
                            }}
                        />
                    ) : privateRules && privateRules[0] ? (
                        <Typography variant='body1'>
                            ${privateRules[0].hourlyTuition}.00
                        </Typography>
                    ) : smallGroupRules && smallGroupRules[0] ? (
                        <Typography variant='body1'>
                            ${smallGroupRules[0].hourlyTuition}.00
                        </Typography>
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
                <>
                    {((privateRules && privateRules[0]) ||
                        (smallGroupRules && smallGroupRules[0])) && (
                        <Grid
                            item
                            container
                            direction='column'
                            justify='center'
                            alignItems='flex-start'
                            xs={12}
                        >
                            <Grid item>
                                <FormControl component='fieldset'>
                                    <RadioGroup
                                    // name='gender1'
                                    // value={value}
                                    // onChange={handleChange}
                                    >
                                        <FormControlLabel
                                            value='newStudents'
                                            control={<Radio />}
                                            label='Apply update only to new students enrolled to this tuition rule for new invoices'
                                        />
                                        <FormControlLabel
                                            value='allStudents'
                                            control={<Radio />}
                                            label='Apply update to new invoices for both existing and new students enrolled with this tuition rule for new invoices'
                                        />
                                    </RadioGroup>
                                </FormControl>
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
                                <ResponsiveButton
                                    onClick={(firstTimeSmallGroup || firstTimePrivate) ? onSubmit : onSubmitUpdate}
                                    variant='contained'
                                >
                                    update
                                </ResponsiveButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            )}
            {((privateRules && privateRules[0]) ||
                (smallGroupRules && smallGroupRules[0])) &&
                !showEdit && (
                    <>
                        <Grid item xs={12}>
                            <Typography variant='h4'>
                                Rule Edit History
                            </Typography>
                        </Grid>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            className={classes.headCells}
                                            style={{ minWidth: 170 }}
                                        >
                                            Change Date
                                        </TableCell>
                                        <TableCell
                                            className={classes.headCells}
                                            style={{ minWidth: 170 }}
                                        >
                                            Tuition Rate
                                        </TableCell>
                                        <TableCell
                                            className={classes.headCells}
                                            style={{ minWidth: 170 }}
                                        >
                                            Rule ID
                                        </TableCell>
                                        <TableCell
                                            className={classes.headCells}
                                            style={{ minWidth: 170 }}
                                        >
                                            Rule Setting
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ruleEditHistory && 
                                     ruleEditHistory.map(({ id, hourlyTuition, tuitionRule }) => (
                                         <TableRow key={id}>
                                             <TableCell>
                                                 {dateTimeToDate(tuitionRule.updatedAt)}
                                             </TableCell>
                                             <TableCell>
                                                 ${hourlyTuition}.00
                                             </TableCell>
                                             <TableCell>
                                                 #{id}
                                            </TableCell>
                                            <TableCell>
                                                setting
                                            </TableCell>
                                         </TableRow>
                                     ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
        </Grid>
    );
};

ManageTuitionRule.propTypes = {
    location: PropTypes.object,
};

export default withRouter(ManageTuitionRule);
