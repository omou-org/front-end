import React, { useState, useEffect } from 'react';
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment"
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { ExpandLess, ExpandMore, Search } from "@material-ui/icons";
import { makeStyles } from '@material-ui/core/styles';
import { BootstrapInput } from './CourseManagementContainer';
import { highlightColor } from "../../../theme/muiTheme";

const useStyles = makeStyles((theme) => ({
    buttonDropDown: {
      border: '1px solid #43B5D9',
      marginLeft: '.5em',
      width: '100%', 
      height: 'auto',
      maxWidth: '2em',
      maxHeight: "2em",
      borderRadius: 5,
    },
    dropdown: {
      border: "1px solid #43B5D9",
      borderRadius: "5px",
    },
    menuSelect: {
      "&:hover": { backgroundColor: highlightColor, color: "#28ABD5" },
      "&:focus": highlightColor,
    },
    menuSelected: {
      backgroundColor: `${highlightColor} !important`,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      border: "1px solid #999999"
    },
    iconButton: {
      padding: 10,
    },
    // margin: {
    //     margin: theme.spacing(1.5),
    //     minWidth: "12.8125em",
    //     [theme.breakpoints.down("md")]: {
    //       minWidth: "10em",
    //     },
    //   },
  }));

export const StudentFilterOrSortDropdown = ({ students, sortByAlphabet, setSortByAlphabet }) => {
    const classes = useStyles();
    const [student, setStudent] = useState(students);
    const [open, setOpen] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    useEffect(() => setStudent(students), [sortByAlphabet]);
    const handleChange = (event) => setSortByAlphabet(event.target.value);
    const handleOpen = () => {
      setOpen(true)
      setSortByAlphabet("")
    };
    const handleClose = () => {
      setOpen(false);
      setFilterValue("");
    };

    const studentNameList = student.filter(name => name.includes(filterValue));
    
    const handleFilter = e => {
      e.stopPropagation();
      e.preventDefault();
      const { value } = e.target;
      setFilterValue(value)
      // const set = new Set(value);
      // console.log(student.filter(name => name.includes(value)));
    };
    const handleInputSelect = e => {
      e.stopPropagation();
      e.preventDefault();
      setOpen(true);
    }
    const handleKeyDown = event => {
      if(event.which === 13) {
        if(!student.find(val => val === event.currentTarget.value)) {
          setStudent(...student, event.currentTarget.value);
        }
        event.currentTarget.value = ""; 
      }
      event.stopPropagation();
    }

    return (
      <Grid item xs={3}>
      <FormControl>
        <Select
          labelId="student-management-sort-tab"
          id="student-management-sort-tab"
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
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
        >
          {sortByAlphabet === "" ? <MenuItem
            ListItemClasses={{ selected: classes.menuSelected }}
            value=""
          >
            Student
          </MenuItem> : null}
          <MenuItem
            ListItemClasses={{ selected: classes.menuSelected }}
            value="desc"
          >
            Sort A-Z
          </MenuItem>
          <MenuItem
            ListItemClasses={{ selected: classes.menuSelected }}
            value="asc"
          >
            Sort Z-A
          </MenuItem>
          {/* <MenuItem
            ListItemClasses={{ selected: classes.menuSelected }}
            value="input"
            onClick={handleInputSelect}
          > */}
        <TextField
          className={classes.input}
          onChange={handleFilter}
          InputProps={{
            endAdornment: (
            <InputAdornment>
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
          <Search />
        </IconButton>
            </InputAdornment>
            ),
            disableUnderline: true,
            onKeyDown: handleKeyDown,
            onClick: handleInputSelect,
            // onChange: handleChange,
          }}
          
        />
          {/* </MenuItem> */}
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
    )
  };

  export const SessionButton = ({ attendanceArray, id, setAttendanceRecord, attendanceEditStates, setAttendanceEditStates, setCurrentSessionId, studentAttendanceDisplay, setCourseAttendanceMatrix, index, setSortByAlphabet, courseAttendanceMatrix }) => {
    const classes = useStyles();
    const handleOpen = e => {
      const sessionId = e.currentTarget.getAttribute("data-session-id")
        setAttendanceRecord({[sessionId]: e.currentTarget})
    };

    const sortStudentAttendanceListByStatus = (studentList, sessionId, attendanceIndex) => {
      const matrix = {
        PRESENT: 1,
        ABSENT: -1
    }
    return studentList.sort((stuA, stuB) => {
        const attA = stuA.attendanceList[attendanceIndex][sessionId];
        const attB = stuB.attendanceList[attendanceIndex][sessionId];
        if (attA === attB) return 0;
        if (attA === "PRESENT") return -1;
        if (attA === "ABSENT") return 1;
        return matrix[attB];
    })
      
    }

    const handleSort = e => {
      const sessionId = e.currentTarget.getAttribute("data-session-id");
      const attendanceIndex = e.currentTarget.getAttribute("data-attendanceArrayIndex");
      console.log(attendanceIndex);
      console.log(sessionId);
      setAttendanceRecord({[sessionId]: null});
      // setCurrentSessionId(sessionId); 
      // setSortByAlphabet(e.target.getAttribute("value"));
      sessionId !== null && setAttendanceEditStates({...attendanceEditStates, [sessionId]: e.target.getAttribute("value")})
      // studentAttendanceDisplay
      const x = sortStudentAttendanceListByStatus(courseAttendanceMatrix, sessionId, attendanceIndex)
      // console.log(sortStudentAttendanceListByStatus(studentAttendanceDisplay, sessionId));
      setCourseAttendanceMatrix(x)
      setSortByAlphabet("")
    }
  
    const handleClose = e => {
      const sessionId = e.currentTarget.getAttribute("data-session-id");
      setAttendanceRecord({[sessionId]: null});
      setCurrentSessionId(sessionId); 
      sessionId !== null && setAttendanceEditStates({...attendanceEditStates, [sessionId]: e.target.getAttribute("value")})
    };

    // console.log(studentAttendanceDisplay);
    
    return (
      <>
      <IconButton
        aria-controls="session-action"
        aria-haspopup="true"
        onClick={handleOpen}
        className={classes.buttonDropDown} 
        data-session-id={id}
        classes={{ root: classes.buttonDropDown}}
      >
      {attendanceArray[id] ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      <Menu
        id="session-action"
        anchorEl={attendanceArray[id]}
        keepMounted
        open={Boolean(attendanceArray[id])}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        data-session-id={id}
      >
        <MenuItem onClick={handleSort} value="sort" data-session-id={id} data-attendanceArrayIndex={index} >Sort</MenuItem>
        <MenuItem onClick={handleClose} value="beginEdit" data-session-id={id}>Edit</MenuItem>
      </Menu>
      </>
    )
  };