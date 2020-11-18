import React, { useState, useRef } from 'react';
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

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

const StudentFilterOrSortDropdown = ({ students }) => {
  const classes = useStyles();
  const [student, setStudent] = useState(students);
  const [state, setState] = useState("");
  const handleChange = (event) => setState(event.target.value);

  return (
    <Grid item xs={3}>
    <FormControl className={classes.margin}>
      <Select
        labelId="student-management-sort-tab"
        id="student-management-sort-tab"
        displayEmpty
        value={state}
        onChange={handleChange}
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
        {state === "" ? <MenuItem
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
          disableUnderline: true
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

const SessionButton = ({ attendanceArray, id, setAttendanceRecord, editState, setEditState }) => {
  const classes = useStyles();
  const handleOpen = e => {
    const sessionId = e.currentTarget.getAttribute("data-session-id")
      setAttendanceRecord({[sessionId]: e.currentTarget})
  };

  const handleClose = e => {
    const sessionId = e.currentTarget.getAttribute("data-session-id");
    setAttendanceRecord({[sessionId]: null}); 
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
      <MenuItem onClick={handleClose} value="sort" data-session-id={id}>Sort</MenuItem>
      <MenuItem onClick={handleClose} value="edit" data-session-id={id}>Edit</MenuItem>
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
  


const AttendanceTable = ({ setIsEditing }) => {
    const { id } = useParams();
    const classes = useStyles();
    const [editState, setEditState] = useState();
    const [attendanceRecord, setAttendanceRecord] = useState();
    const [isEdit, setIsEdit] = useState();
    const [attendnanceState, setAttendanceState] = useState("");
    const [studentAttendanceData, setStudentAttendanceData] = useState();
    const { data, loading, error} = useQuery(GET_ATTENDANCE, {
        variables: { courseId: id },
        onCompleted: () => {
          const { sessions, enrollments } = data;
          setEditState(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: "noSelect" }), {}))
          setAttendanceRecord(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: null }), {}))
          setIsEdit(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: false }), {}));
          // setStudentAttendanceData(enrollments);
          const newClassData = sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: "Present" }), {});
          const newData = enrollments.map(data => createData(fullName(data.student.user), newClassData, data.student.user.id));
          newData.map(row => {
            const filteredKey = Object.keys(row).filter(name => name !== "name" && name !== "studentId");
            const filteredArray = filteredKey.reduce((obj, key) => ({ ...obj, [key]: "" }), []);
            setStudentAttendanceData(filteredArray)
          });
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
        } else {
          setIsEdit({...isEdit, [sessionId]: false});
          setIsEditing(false);
          setEditState({...editState, [sessionId]: "noSelect"})
        }  
    };

    const handleClick = (e) => {
      const attendanceValue = e.currentTarget.value;
      const studentId = e.currentTarget.getAttribute("data-id");
      const sessionId = e.currentTarget.getAttribute("data-keys");
      setStudentAttendanceData({...studentAttendanceData, [sessionId]: attendanceValue})
    }

    const studentsFullName = enrollments.map(({student}) => fullName(student.user));
    const newClassData = sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: "Present" }), {});
    const newData = enrollments.map(data => createData(fullName(data.student.user), newClassData, data.student.user.id));


    // console.log(newData)
    // console.log(newClassData)
    // console.log(isEdit);
    console.log(studentAttendanceData)
  return (
    <TableContainer className={classes.table}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{color: 'black'}}>
              <StudentFilterOrSortDropdown students={studentsFullName}/>
            </TableCell>
            {sessions.map(({ startDatetime, id }, i) => {
      const startingDate = moment(startDatetime).calendar();
      return (
        <TableCell className={classes.tableCell}>
          {`Session ${i + 1} (${startingDate})`}
        {editState[id] === "edit" ? <Checkbox
        checked={isEdit[id]}
        onChange={handleEdit}
        checkedIcon={<Check fontSize="small" style={{color: 'white'}} />}
        icon={<Add fontSize="small"/>}
        id={id}
        disableRipple
        classes={{ root: classes.checkbox, checked: classes.checkbox2 }}
      /> : <SessionButton attendanceArray={attendanceRecord} id={id} setAttendanceRecord={setAttendanceRecord} editState={editState} setEditState={setEditState}/>}
        </TableCell>
      )
    })}
          </TableRow>
        </TableHead>
        <TableBody>
          {newData.map(row => {
            const filteredKey = Object.keys(row).filter(name => name !== "name" && name !== "studentId");
            const filteredArray = filteredKey.reduce((obj, key) => ({ ...obj, [key]: "" }), []);
            return (
            <TableRow key={row.studentId}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
                {filteredKey.map(keys => (
                <TableCell align="right"id={row.studentId}>
                  {console.log(studentAttendanceData[keys])}
                  {row[keys] === null ? null : (isEdit[keys]) ? 
                  (<ButtonGroup>
                    <Button data-id={row.studentId} data-keys={keys} value="PRESENT" onClick={handleClick} style={{backgroundColor: '#6CE086'}}><Typography style={{fontWeight: 500, color: 'black'}}>P</Typography></Button>
                    <Button data-id={row.studentId} data-keys={keys} value="TARDY" onClick={handleClick} style={{backgroundColor: '#FFDD59'}}><Typography style={{fontWeight: 500, color: 'black'}}>T</Typography></Button>
                    <Button data-id={row.studentId} data-keys={keys} value="ABSENT" onClick={handleClick} style={{backgroundColor: '#FF6766'}}><Typography style={{fontWeight: 500, color: 'black'}}>A</Typography></Button>
                  </ButtonGroup>) 
                  :
                  (studentAttendanceData[keys] === "PRESENT" ? <Button style={{backgroundColor: '#6CE086', color: 'black'}} disabled>{studentAttendanceData[keys]}</Button> : <div>{filteredArray[keys]}</div>)
                  }
                </TableCell>))}
            </TableRow>
            )
          })}
          {/* {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendanceTable;