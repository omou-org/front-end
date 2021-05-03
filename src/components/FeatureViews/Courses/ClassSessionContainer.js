import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { BootstrapInput } from './CourseManagementContainer';
import ClassSessionView from './ClassSessionView';
import moment from 'moment';
import { highlightColor } from '../../../theme/muiTheme';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        minWidth: 1460,
        backgroundColor: theme.palette.background.paper,
    },
    listItems: {
        paddingTop: '3em',
        paddingBottom: '1em',
    },
    margin: {
        float: 'left',
        marginTop: '2em',
        marginBottom: '2em',
    },
    menuSelected: {
        '&:hover': { backgroundColor: highlightColor, color: '#28ABD5' },
        '&:focus': { backgroundColor: highlightColor },
    },
    menuSelect: {
        backgroundColor: `${highlightColor} !important`,
    },
    dropdown: {
        border: '1px solid #43B5D9',
        borderRadius: '5px',
    },
}));

const ClassSessionContainer = ({ sessionList, loggedInUser }) => {
    const classes = useStyles();
    const [sortBySession, setSortBySession] = useState('');

    const handleChange = (e) => setSortBySession(e.target.value);

    return (
        <>
            <Grid container justify='flex-start'>
                <Grid item xs={12}>
                    <FormControl className={classes.margin}>
                        <Select
                            labelId='session-sort-tab'
                            id='session-sort-tab'
                            displayEmpty
                            value={sortBySession}
                            onChange={handleChange}
                            classes={{ select: classes.menuSelected }}
                            input={<BootstrapInput />}
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
                            {sortBySession === '' && (
                                <MenuItem
                                    ListItemClasses={{
                                        selected: classes.menuSelect,
                                    }}
                                    value=''
                                >
                                    Select Session...
                                </MenuItem>
                            )}
                            {sessionList.map(({ startDatetime, id }, index) => {
                                const startingDate = moment(
                                    startDatetime
                                ).calendar();
                                return (
                                    <MenuItem
                                        key={id}
                                        className={classes.menuSelected}
                                        value={id}
                                        ListItemClasses={{
                                            selected: classes.menuSelect,
                                        }}
                                    >
                                        {`Session ${
                                            index + 1
                                        } (${startingDate})`}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                {sortBySession !== '' && (
                    <ClassSessionView
                        sessionId={sortBySession}
                        loggedInUser={loggedInUser}
                    />
                )}
            </Grid>
        </>
    );
};

ClassSessionContainer.propTypes = {
    sessionList: PropTypes.array,
    loggedInUser: PropTypes.object,
};

export default ClassSessionContainer;
