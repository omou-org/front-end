import React, { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Button,
    MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import gql from 'graphql-tag';
import { Form as ReactForm } from 'react-final-form';
import { Select } from 'mui-rff';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { BootstrapInput } from '../Courses/CourseManagementContainer';
import {
    StudentSelect,
    CourseTopicSelect,
    DatePicker,
    ToggleButton,
} from '../../Form/FieldComponents/Fields';
import { highlightColor } from '../../../theme/muiTheme';
import Eyebrow from '../../OmouComponents/Eyebrow';
// const GET_STUDENT_LIST = gql`
//     query GetStudents {
//         parents {
//             studentList {
//                 user {
//                     id
//                     lastName
//                     firstName
//                 }
//             }
//         }
//     }
// `;

const GET_STUDENT_LIST = gql`
    query GET_STUDENT_LIST($parentID: ID) {
        parent(userId: $parentID) {
            studentIdList
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    contentMargin: {
        marginLeft: '20px',
        marginRight: '20px',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    contentSpacing: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    dropdown: {
        border: '1px solid #43B5D9',
        borderRadius: '5px',
    },
    selectDuration: {
        textAlign: 'left',
    },
    menuSelect: {
        '&:hover': { backgroundColor: highlightColor, color: '#28ABD5' },
        '&:focus': highlightColor,
        display: 'flex',
    },
    stepper: {
        // LoginPage.scss is overriding the MUI stepper component,
        // recommend fixing that to use MUI classes in stepper component instead of
        // changing it globaly
        // This needs !important
        background: '#FAFAFA !important',
        margin: '1em 1em !important',
    },
}));

function getSteps() {
    return ['Select Student', 'Select Schedule', 'Review'];
}

const RequestScheduler = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const loggedInParentID = useSelector(({ auth }) => auth.user.id);
    const [initalFormState, setInitalFormState] = useState({});
    const { data, loading, error } = useQuery(GET_STUDENT_LIST, {
        variables: { parentID: loggedInParentID },
    });
    useEffect(() => {
        const studentIdList = data.parent.studentIdList;
        if (studentIdList.length === 1) {
            setInitalFormState({ selectStudent: studentIdList[0] });
        }
    }, [data.parent.studentIdList]);
    if (loading) return 'loading';
    if (error) return console.error(error);

    const checkboxData = [
        { label: 'Monday', value: false },
        { label: 'Tuesday', value: false },
        { label: 'Wednesday', value: false },
        { label: 'Thursday', value: false },
        { label: 'Friday', value: false },
        { label: 'Saturday', value: false },
        { label: 'Sunday', value: false },
    ];

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return (
                    <>
                        <StudentSelect
                            studentIdList={data.parent.studentIdList}
                        />
                        <CourseTopicSelect />
                    </>
                );
            case 1:
                return (
                    <Grid container direction='row' justify='flex-start'>
                        <Grid
                            item
                            xs={2}
                            className={classes.contentSpacing}
                            style={{ textAlign: 'left' }}
                        >
                            <DatePicker
                                style={{ width: '200px' }}
                                tutoring={true}
                                name='startDate'
                                label='Start Date'
                                format='MM/DD/YYYY'
                            />
                        </Grid>
                        <Grid
                            item
                            xs={2}
                            className={classes.contentSpacing}
                            style={{ textAlign: 'left' }}
                        >
                            <DatePicker
                                style={{ width: '200px' }}
                                tutoring={true}
                                name='endDate'
                                label='End Date'
                                format='MM/DD/YYYY'
                            />
                        </Grid>

                        <Grid item xs={12} className={classes.contentSpacing}>
                            <Eyebrow
                                title={'DAY(S) OF REOCCURANCE'}
                                subText='Select at least 1 day of meeting that will reoccur on weekly basis'
                            />
                        </Grid>

                        <Grid
                            item
                            container
                            justify='space-between'
                            direction='row'
                            xs={10}
                        >
                            {checkboxData.map((date, i) => (
                                <Grid key={i} item>
                                    <ToggleButton
                                        name={date.label}
                                        initialValues={checkboxData}
                                        // onChange={(e) => console.log(e)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid
                            item
                            container
                            xs={2}
                            className={classes.contentSpacing}
                        >
                            <h3>Duration Of meeting</h3>
                            <Select
                                name='duration'
                                input={<BootstrapInput />}
                                className={classes.selectDuration}
                                classes={{ select: classes.menuSelect }}
                                MenuProps={{
                                    classes: { list: classes.dropdown },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                    getContentAnchorEl: null,
                                }}
                            >
                                <MenuItem value='.5'>30 min</MenuItem>
                                <MenuItem value='1'>1 hour</MenuItem>
                                <MenuItem value='1.5'>1.5 hours</MenuItem>
                                <MenuItem value='2'>2 hours</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                );
            case 2:
                return 'Review';
            default:
                return 'Unknown Step';
        }
    };

    const submit = () => {
        // submit the form on complete
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const validate = (formData) => {
        console.log(formData);
    };
    return (
        <>
            <Grid container direction='row'>
                <Grid item xs={5}>
                    <Typography align='left' variant='h1'>
                        Submit Tutoring Request
                    </Typography>
                </Grid>
            </Grid>

            <Grid
                container
                direction='row'
                justify='center'
                alignItems='center'
            >
                <ReactForm
                    onSubmit={submit}
                    initialValues={initalFormState}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Stepper
                                        activeStep={activeStep}
                                        alternativeLabel
                                        classes={{
                                            root: classes.stepper,
                                        }}
                                    >
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    <div>
                                        {activeStep === steps.length ? (
                                            <div>
                                                <Typography
                                                    className={
                                                        classes.instructions
                                                    }
                                                >
                                                    All steps completed
                                                </Typography>
                                                <Button onClick={handleReset}>
                                                    Reset
                                                </Button>
                                            </div>
                                        ) : (
                                            <Grid
                                                container
                                                justify='center'
                                                direction='row'
                                                className={
                                                    classes.contentMargin
                                                }
                                            >
                                                {getStepContent(activeStep)}

                                                <div>
                                                    <Button
                                                        disabled={
                                                            activeStep === 0
                                                        }
                                                        onClick={handleBack}
                                                        className={
                                                            classes.backButton
                                                        }
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        onClick={handleNext}
                                                    >
                                                        {activeStep ===
                                                        steps.length - 1
                                                            ? 'Finish'
                                                            : 'Next'}
                                                    </Button>
                                                </div>
                                            </Grid>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                />
            </Grid>
        </>
    );
};

export default RequestScheduler;
