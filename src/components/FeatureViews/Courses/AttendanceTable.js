import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from "moment";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Divider from '@material-ui/core/Divider';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment"
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { ExpandLess, ExpandMore, Add, Check, Search } from "@material-ui/icons"
import { BootstrapInput } from './CourseManagementContainer'
import Loading from 'components/OmouComponents/Loading';
import { buttonBlue, highlightColor } from "../../../theme/muiTheme";
import { fullName } from '../../../utils'

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: '75.2vw',
    overflowY: 'auto',
    [theme.breakpoints.down('lg')] : {
      maxWidth: '69vw',
    }
  },
  tableCell: {
    color: 'black',
    whiteSpace: 'nowrap',
    fontWeight: 500
  },
  buttonDropDown: {
    border: '1px solid #43B5D9',
    marginLeft: '1em',
    width: '.5em', 
    height: '2.5em',
    maxWidth: '.5em',
    maxHeight: "2.5em"
  },
  attendanceButton: {
    border: '1px solid #43B5D9',
    borderRadius: 5,
    background: buttonBlue,
    color: 'white',
    paddingTop: 10,
    paddingRight: 14,
    paddingBottom: 10,
    paddingLeft: 14,
    letterSpacing: '0.02em'
  },
  checkbox: {
    borderRadius: 2,
    backgroundColor: buttonBlue,
    color: 'white',
    width: '1em',
    height: '1em',
    marginLeft: '.5em',
    '&:hover': {
      backgroundColor: buttonBlue
    }
  },
  checkbox2: {
    '&:hover': {
      backgroundColor: "rgba(39, 143, 195, 1) !important"
    }
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
}));

function createData(name, sessionsId, studentId) {
  return { name, ...sessionsId, studentId };
}


const StudentFilterOrSortDropdown = ({ students, sortByAlphabet, setSortByAlphabet }) => {
  const classes = useStyles();
  const [student, setStudent] = useState(students);
  const [open, setOpen] = useState(false);
  const handleChange = (event) => setSortByAlphabet(event.target.value);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleInputSelect = e => {
    e.stopPropagation();
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
    <FormControl className={classes.margin}>
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
        <MenuItem
          ListItemClasses={{ selected: classes.menuSelected }}
          value="input"
          onClick={handleInputSelect}
        >
      <TextField
        className={classes.input}
        InputProps={{
          endAdornment: (
          <InputAdornment>
                  <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <Search />
      </IconButton>
          </InputAdornment>
          ),
          disableUnderline: true,
          onKeyDown: handleKeyDown
        }}
        
      />
        </MenuItem>
        {student.map(studentName => (
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

const SessionButton = ({ attendanceArray, id, setAttendanceRecord, editState, setEditState, setCurrentSessionId, sortAttendanceArray }) => {
  const classes = useStyles();
  const handleOpen = e => {
    const sessionId = e.currentTarget.getAttribute("data-session-id")
      setAttendanceRecord({[sessionId]: e.currentTarget})
  };

  const handleSort = e => {
    const sessionId = e.currentTarget.getAttribute("data-session-id");
    setAttendanceRecord({[sessionId]: null});
    setCurrentSessionId(sessionId); 
    sessionId !== null && setEditState({...editState, [sessionId]: e.target.getAttribute("value")})
    sortAttendanceArray()
  }

  const handleClose = e => {
    const sessionId = e.currentTarget.getAttribute("data-session-id");
    setAttendanceRecord({[sessionId]: null});
    setCurrentSessionId(sessionId); 
    sessionId !== null && setEditState({...editState, [sessionId]: e.target.getAttribute("value")})
  };
  
  return (
    <>
    <Button
      aria-controls="session-action"
      aria-haspopup="true"
      onClick={handleOpen}
      className={classes.buttonDropDown} 
      data-session-id={id}
      // size="small"
    >
    {attendanceArray[id] ? <ExpandLess /> : <ExpandMore />}
    </Button>
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
      <MenuItem onClick={handleSort} value="sort" data-session-id={id}>Sort</MenuItem>
      <MenuItem onClick={handleClose} value="beginEdit" data-session-id={id}>Edit</MenuItem>
    </Menu>
    </>
  )
}

export const GET_ATTENDANCE = gql`
query getAttendance($courseId: ID!) {
    __typename
    sessions(courseId: $courseId) {
      id
      startDatetime
    }
    enrollments(courseId: $courseId) {
      student {
        user {
          firstName
          id
          lastName
        }
      }
    }
  }`;
  


const AttendanceTable = ({ setIsEditing, editingState }) => {
    const { id } = useParams();
    const classes = useStyles();
    const [editState, setEditState] = useState();
    const [attendanceRecord, setAttendanceRecord] = useState();
    const [isEdit, setIsEdit] = useState();
    const [currentSessionId, setCurrentSessionId] = useState("");
    const [studentAttendanceData, setStudentAttendanceData] = useState();
    const [sortByAlphabet, setSortByAlphabet] = useState("")
    const { data, loading, error} = useQuery(GET_ATTENDANCE, {
        variables: { courseId: id },
        onCompleted: () => {
          const { sessions, enrollments } = data;
          setEditState(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: "noSelect" }), {}))
          setAttendanceRecord(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: null }), {}))
          setIsEdit(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: false }), {}));
          const newClassData = sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: "" }), {});
          const newData = enrollments.map(data => createData(fullName(data.student.user), newClassData, data.student.user.id))
                                     .sort((firstEl, secondEl) => firstEl.name < secondEl.name ? -1 : (firstEl.name > secondEl.name) ? 1 : 0)
          setStudentAttendanceData(newData)
        },
    });

    if(loading) return <Loading />;
    if(!isEdit) return <Loading />;
    if(error) return console.error(error);
    const { enrollments, sessions } = data;

    const handleEdit = e => {
      const sessionId = e.currentTarget.getAttribute("id")
        if(isEdit[sessionId] === false) {
          setIsEdit({...isEdit, [sessionId]: true})
          setIsEditing(true);
          setEditState({...editState, [sessionId]: "edited"})
        } else {
          setIsEdit({...isEdit, [sessionId]: false});
          setIsEditing(false);
          studentAttendanceData.map(x => x[sessionId] !== "" && setEditState({...editState, [sessionId]: "done"}))
        }  
    };

    const handleClick = (e) => {
      const attendanceValue = e.currentTarget.value;
      const arrayIndex = e.currentTarget.getAttribute("data-arrayIndex");
      const sessionId = e.currentTarget.getAttribute("data-keys");
      const arrOfObj = { ...studentAttendanceData[arrayIndex], [sessionId]: attendanceValue }
      let newArr = [...studentAttendanceData]
      newArr[arrayIndex] = arrOfObj
      if(attendanceValue !== "") {
        setStudentAttendanceData(newArr)
        setEditState({...editState, [sessionId]: "edited"})
      }
    };

    const studentsFullName = enrollments.map(({student}) => fullName(student.user));

    // const sortStudentList = studentAttendanceData.sort((firstEl, secondEl) => {
    //     if(firstEl.name < secondEl.name) {
    //       return -1;
    //     } else if (firstEl.name > secondEl.name) {
    //       return 1;
    //     } else {
    //       return 0;
    //     }        
    // });



    // console.log(sortAttendanceList)

    const colorHighlight = {
      "PRESENT": '#6CE086',
      "TARDY": '#FFDD59',
      "ABSENT": '#FF6766'
    }

    const renderAttendanceChip = (row, keys, editState) => {
      const renderEachButton = ["PRESENT", "TARDY", "ABSENT"].indexOf((row[keys])) >= 0 && editState[keys] !== "edited"
      if(renderEachButton) {
        return (<Button style={{backgroundColor: colorHighlight[row[keys]], color: 'black'}} disabled>{row[keys]}</Button>)
      } else {
        return null
      }
    };

    const sortAttendanceArray = () => {
      const sortAttendanceList = studentAttendanceData.sort((firstEl, secondEl) => {
        if(!firstEl[currentSessionId] && !secondEl[currentSessionId]) return;
        const attendanceValue = ["PRESENT", "TARDY", "ABSENT"];
        const firstValue = attendanceValue.indexOf(firstEl[currentSessionId]);
        const secondValue = attendanceValue.indexOf(secondEl[currentSessionId]);
        if(firstValue === secondValue) {
          return firstEl.name - secondEl.name
        }
        return firstValue - secondValue
      });
      setStudentAttendanceData(sortAttendanceList);
    };
    const sortDescOrder = (firstEl, secondEl) => (firstEl < secondEl ? -1 : 0);
    const sortAscOrder = (firstEl, secondEl) => (firstEl > secondEl ? -1 : 0);

    const studentAttendanceDisplay = studentAttendanceData
      .filter(student => (
        sortByAlphabet === "asc" || sortByAlphabet === "desc" || sortByAlphabet === "" ? student :
        {
          [student.name]: student.name
        }[sortByAlphabet]
      ))
      .sort(
        (firstEl, secondEl) => ({
          "asc": sortAscOrder(firstEl.name, secondEl.name),
          "desc": sortDescOrder(firstEl.name, secondEl.name),
        }[sortByAlphabet])
      );
    
      // console.log(sortByAlphabet)
    // console.log(studentAttendanceDisplay)
    // console.log(sortStudentList)
    // console.log(currentSessionId);
    // console.log(newData)
    // console.log(color)
    // console.log(newClassData)
    // console.log(isEdit);
    // console.log(studentAttendanceData)
    // console.log(sessions)
    // console.log(editState)
    // console.log(attendanceRecord)
  return (
    <TableContainer className={classes.table}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{color: 'black'}}>
              <StudentFilterOrSortDropdown students={studentsFullName} setSortByAlphabet={setSortByAlphabet} sortByAlphabet={sortByAlphabet}/>
            </TableCell>
            {sessions
            .sort((a,b) => a.id - b.id)
            .map(({ startDatetime, id }, i) => {
      const startingDate = moment(startDatetime).calendar();
      return (
        <TableCell className={classes.tableCell}>
          {`Session ${i + 1} (${startingDate})`}
        {editState[id] === "noSelect" || editState[id] === "beginEdit" || editState[id] === "edited" ? 
        <Checkbox
        checked={isEdit[id]}
        onChange={handleEdit}
        checkedIcon={<Check fontSize="small" style={{color: 'white'}} />}
        icon={<Add fontSize="small"/>}
        id={id}
        disableRipple
        classes={{ root: classes.checkbox, checked: classes.checkbox2 }}
      /> : <SessionButton attendanceArray={attendanceRecord} id={id} setAttendanceRecord={setAttendanceRecord} editState={editState} setEditState={setEditState} setCurrentSessionId={setCurrentSessionId} studentAttendanceData={studentAttendanceData} setStudentAttendanceData={setStudentAttendanceData} sortAttendanceArray={sortAttendanceArray}/>}
        </TableCell>
      )
    })}
          </TableRow>
        </TableHead>
        <TableBody>
          {studentAttendanceDisplay.map((row, i, arr) => {
            const filteredKey = Object.keys(row).filter(name => name !== "name" && name !== "studentId");
            return (
              <TableRow key={row.studentId}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
                {filteredKey.map(keys => {
                  return <TableCell align="right"id={row.studentId}>
                    {renderAttendanceChip(row, keys, editState)}                  {
                    isEdit[keys] && (
                      <ButtonGroup>
            <Button data-arrayIndex={i} data-keys={keys} value="PRESENT" onClick={handleClick} style={{backgroundColor: `${row[keys] === "PRESENT" || row[keys] === "" ? '#6CE086' : '#C9FFD5'}`}}><Typography style={{fontWeight: 500, color: 'black'}}>P</Typography></Button>
      <Button data-arrayIndex={i} data-keys={keys} value="TARDY" onClick={handleClick} style={{backgroundColor: `${row[keys] === "TARDY" || row[keys] === "" ? '#FFDD59' : '#FFF6D4'}`}}><Typography style={{fontWeight: 500, color: 'black'}}>T</Typography></Button>
      <Button data-arrayIndex={i} data-keys={keys} value="ABSENT" onClick={handleClick} style={{backgroundColor: `${row[keys] === "ABSENT" || row[keys] === "" ? '#FF6766' : '#FFD8D8'}`}}><Typography style={{fontWeight: 500, color: 'black'}}>A</Typography></Button>
    </ButtonGroup>
                    )
                  }
                  </TableCell>
                })}
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendanceTable;
