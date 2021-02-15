import React, { useState, useEffect, useRef } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { ExpandLess, ExpandMore, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { BootstrapInput } from './CourseManagementContainer';
import { highlightColor, omouBlue } from '../../../theme/muiTheme';

const useStyles = makeStyles((theme) => ({
    buttonDropDown: {
        marginLeft: '.5em',
        borderRadius: 5,
        '&:hover': { backgroundColor: 'white' },
    },
    arrowHover: {
        '&:hover': { color: omouBlue },
    },
    arrowMenu: {
        border: `1px solid ${omouBlue}`,
        borderRadius: 5,
        width: '6.5em',
        padding: 0,
    },
    dropdown: {
        border: '1px solid #43B5D9',
        borderRadius: '5px',
    },
    menuSelect: {
        '&:hover': { backgroundColor: highlightColor, borderRadius: 5 },
        '&:focus': highlightColor,
    },
    menuSelected: {
        backgroundColor: `${highlightColor} !important`,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        border: '1px solid #999999',
    },
    iconButton: {
        padding: 10,
    },
}));

export const StudentFilterOrSortDropdown = ({
    students,
    sortByAlphabet,
    setSortByAlphabet,
}) => {
    const classes = useStyles();
    const [student, setStudent] = useState(students);
    const [open, setOpen] = useState(false);
    const [filterName, setFilterName] = useState('');

    useEffect(() => setStudent(students), [sortByAlphabet]);

    const handleChange = (event) => setSortByAlphabet(event.target.value);
    const handleOpen = () => {
        setOpen(true);
        setSortByAlphabet('');
    };
    const handleClose = () => {
        setOpen(false);
        setFilterName('');
    };

    const studentNameList = student.filter((name) => name.includes(filterName));

    const handleFilter = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const { value } = e.target;
        setFilterName(value);
    };
    const handleInputSelect = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(true);
    };
    // This is needed to stop immediate selection of the student name when a user starts typing
    const handleKeyDown = (event) => {
        if (event.which === 13) {
            if (!student.find((val) => val === event.currentTarget.value)) {
                setStudent(...student, event.currentTarget.value);
            }
            event.currentTarget.value = '';
        }
        event.stopPropagation();
    };

    return (
        <Grid item xs={3}>
            <FormControl>
                <Select
                    labelId='student-management-sort-tab'
                    id='student-management-sort-tab'
                    displayEmpty
                    value={sortByAlphabet}
                    open={open}
                    onChange={handleChange}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    classes={{ select: classes.menuSelect }}
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
                    {sortByAlphabet === '' && (
                        <MenuItem
                            ListItemClasses={{ selected: classes.menuSelected }}
                            value=''
                        >
                            Student
                        </MenuItem>
                    )}
                    <MenuItem
                        ListItemClasses={{ selected: classes.menuSelected }}
                        value='desc'
                    >
                        Sort A-Z
                    </MenuItem>
                    <MenuItem
                        ListItemClasses={{ selected: classes.menuSelected }}
                        value='asc'
                    >
                        Sort Z-A
                    </MenuItem>
                    <TextField
                        className={classes.input}
                        onChange={handleFilter}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton
                                        type='submit'
                                        className={classes.iconButton}
                                        aria-label='search'
                                    >
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            disableUnderline: true,
                            onKeyDown: handleKeyDown,
                            onClick: handleInputSelect,
                        }}
                    />
                    {studentNameList.map((studentName) => (
                        <MenuItem
                            key={studentName}
                            value={studentName}
                            className={classes.menuSelect}
                            ListItemClasses={{ selected: classes.menuSelected }}
                        >
                            {studentName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
};

export const SessionDropdownButton = ({
    id,
    attendanceEditStates,
    setAttendanceEditStates,
    setCourseAttendanceMatrix,
    index,
    setSortByAlphabet,
    studentAttendanceDataToDisplay,
}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [buttonPosition, setButtonPosition] = useState();
    const buttonRef = useRef();
    const handleOpen = () => {
        setOpen(true);
        setButtonPosition(buttonRef.current);
    };

    const sortStudentAttendanceListByStatus = (
        studentList,
        sessionId,
        attendanceIndex
    ) => {
        const matrix = {
            PRESENT: 1,
            TARDY: 2,
            ABSENT: 3,
            UNSET: 4,
        };
        return studentList.sort((studentA, studentB) => {
            const attendanceAStatus =
                studentA.attendanceList[attendanceIndex][sessionId];
            const attendanceBStatus =
                studentB.attendanceList[attendanceIndex][sessionId];
            return matrix[attendanceAStatus] - matrix[attendanceBStatus];
        });
    };

    const handleSort = (e) => {
        const sessionId = e.currentTarget.getAttribute('data-session-id');
        const attendanceIndex = e.currentTarget.getAttribute(
            'data-attendanceArrayIndex'
        );
        setAttendanceEditStates({
            ...attendanceEditStates,
            [sessionId]: e.target.getAttribute('value'),
        });
        const sortedAttendanceMatrix = sortStudentAttendanceListByStatus(
            studentAttendanceDataToDisplay,
            sessionId,
            attendanceIndex
        );
        setCourseAttendanceMatrix(sortedAttendanceMatrix);
        setSortByAlphabet('');
        setOpen(false);
    };

    const handleClose = (e) => {
        const sessionId = e.currentTarget.getAttribute('data-session-id');
        setAttendanceEditStates({
            ...attendanceEditStates,
            [sessionId]: e.target.getAttribute('value'),
        });
        setOpen(false);
    };

    return (
        <>
            <IconButton
                aria-controls='session-action'
                aria-haspopup='true'
                onClick={handleOpen}
                ref={buttonRef}
                disableRipple
                className={classes.buttonDropDown}
                data-session-id={id}
                classes={{ root: classes.buttonDropDown }}
            >
                {open ? (
                    <ExpandLess className={classes.arrowHover} />
                ) : (
                    <ExpandMore className={classes.arrowHover} />
                )}
            </IconButton>
            <Menu
                id='session-action'
                anchorEl={buttonPosition}
                keepMounted
                open={Boolean(open)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 35 }}
                classes={{ list: classes.arrowMenu }}
                data-session-id={id}
            >
                <MenuItem
                    onClick={handleSort}
                    value='sort'
                    data-session-id={id}
                    data-attendanceArrayIndex={index}
                    ListItemClasses={{ button: classes.menuSelect }}
                >
                    Sort
                </MenuItem>
                <MenuItem
                    onClick={handleClose}
                    value='beginEdit'
                    data-session-id={id}
                    ListItemClasses={{ button: classes.menuSelect }}
                >
                    Edit
                </MenuItem>
            </Menu>
        </>
    );
};
