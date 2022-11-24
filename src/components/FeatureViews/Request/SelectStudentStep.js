import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
    StudentSelect,
    CourseTopicSelect,
} from '../../Form/FieldComponents/Fields';

import { highlightColor, slateGrey } from '../../../theme/muiTheme';
import { BootstrapInput } from '../Courses/CourseManagementContainer';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    selectHeader: {
        textAlign: 'left',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        fontWeight: 500,
        fontSize: '17px',
        textTransform: 'uppercase',
        color: slateGrey,
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
}));

const SelectStudentStep = ({ studentIdList }) => {
    const classes = useStyles();

    return (
        <Grid container direction='column' justify='flex-start'>
            <Grid item xs={2}>
                <Typography className={classes.selectHeader}>
                    Select Student
                </Typography>
                <StudentSelect
                    studentIdList={studentIdList}
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
                />
            </Grid>
            <Grid item xs={2}>
                <Typography className={classes.selectHeader}>
                    Select Topic
                </Typography>
                <CourseTopicSelect
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
                />
            </Grid>
        </Grid>
    );
};

export default SelectStudentStep;

SelectStudentStep.propTypes = {
    studentIdList: PropTypes.array,
    activeStep: PropTypes.number,
};
