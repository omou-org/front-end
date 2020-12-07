import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks';
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
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from "@material-ui/core/Checkbox";
import { Add, Check } from "@material-ui/icons"
import Loading from '../../OmouComponents/Loading';
import { StudentFilterOrSortDropdown, SessionButton } from './AttendanceButtons';
import { buttonThemeBlue } from "../../../theme/muiTheme";
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
  checkbox: {
    borderRadius: 2,
    backgroundColor: buttonThemeBlue,
    color: 'white',
    width: '1em',
    height: '1em',
    marginLeft: '.5em',
    '&:hover': {
      backgroundColor: buttonThemeBlue
    }
  },
  checkbox2: {
    '&:hover': {
      backgroundColor: "rgba(39, 143, 195, 1) !important"
    }
  }
}));

function createData(name, sessionsId, studentId) {
  return { name, ...sessionsId, studentId };
};


export const GET_ATTENDANCE = gql`query getAttendance($courseId: ID!) {
  __typename
  attendances(courseId: $courseId) {
    id
    status
    session {
      startDatetime
      id
    }
    enrollment {
      student {
        user {
          lastName
          id
          firstName
        }
      }
    }
  }
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

export const UPDATE_ATTENDANCE_STATUS = gql`mutation UpdateAttendanceStatus($attendanceId: ID!, $status: String) {
  __typename
  updateAttendance(id: $attendanceId, status: $status) {
    attendance {
      updatedAt
    }
  }
}`
  


const AttendanceTable = ({ setIsEditing, editingState }) => {
    const { id } = useParams();
    const classes = useStyles();
    const [editState, setEditState] = useState();
    const [attendanceRecord, setAttendanceRecord] = useState();
    const [isEdit, setIsEdit] = useState();
    const [currentSessionId, setCurrentSessionId] = useState("");
    const [studentAttendanceData, setStudentAttendanceData] = useState();
    const [sortByAlphabet, setSortByAlphabet] = useState("");

    const { data, loading, error} = useQuery(GET_ATTENDANCE, {
        variables: { courseId: id },
        onCompleted: () => {
          const { sessions, enrollments, attendances } = data;
          setEditState(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: "noSelect" }), {}))
          setAttendanceRecord(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: null }), {}))
          setIsEdit(sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: false }), {}));
          const newClassData = sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: "" }), {});
          const formattedAttendanceTableData = attendances.reduce((studentIdHashMap, {id, enrollment, status, session }) => {
            const { user } = enrollment.student;
            studentIdHashMap[user.id] = studentIdHashMap[user.id]  || {idSet: [] };
            // studentIdHashMap[session.id] = studentIdHashMap[session.id] || {[session.id]: {attendanceId: id, status}}
            studentIdHashMap[user.id].idSet.push({attendanceId: id, status, sessionId: session.id});
            return studentIdHashMap
          }, {});
          // const newData = enrollments.map(data => createData(fullName(data.student.user), newClassData, data.student.user.id))
          // .sort((firstEl, secondEl) => firstEl.name < secondEl.name ? -1 : (firstEl.name > secondEl.name) ? 1 : 0)

          const newData = enrollments.map(data => createData(fullName(data.student.user), formattedAttendanceTableData[data.student.user.id], data.student.user.id))
                                     .sort((firstEl, secondEl) => firstEl.name < secondEl.name ? -1 : (firstEl.name > secondEl.name) ? 1 : 0)
          setStudentAttendanceData(newData)
        },
    });

    const [updateAttendance, updateAttendanceResult] = useMutation(UPDATE_ATTENDANCE_STATUS, {
      error: (err) => console.error(err),
      update: (cache, { data }) => {
        
      }
    });
  
    // const attendance = useQuery(GET_ATTENDANCE1, {
    //   variables: { courseId: id }
    // });

    // if(attendance.loading) return <Loading />
    // console.log(attendance.data.attendances);
    if(loading) return <Loading />;
    if(!isEdit) return <Loading />;
    if(!editState) return <Loading />;
    if(error) return error.message;
    const { enrollments, sessions, attendances } = data;

    const checkEditState = (id) => editState[id] === "noSelect" || editState[id] === "beginEdit" || editState[id] === "edited";
    const checkEditState2 = (id) => editState[id] === "noSelect"|| editState[id] === "edited";

    const handleEdit = e => {
      const sessionId = e.currentTarget.getAttribute("id")
        if(isEdit[sessionId] === false) {
          setIsEdit({...isEdit, [sessionId]: true})
          setIsEditing(true);
          setEditState({...editState, [sessionId]: "edited"})
        } else {
          setIsEdit({...isEdit, [sessionId]: false});
          setIsEditing(false);
          studentAttendanceData.forEach(iterate => iterate.idSet.forEach(attendance => attendance.status !== "UNSET" && setEditState({...editState, [sessionId]: "done"})))
          console.log('mutation fires here');
        }  
    };

    const handleClick = (e) => {
      const attendanceValue = e.currentTarget.value;
      const arrayIndex = e.currentTarget.getAttribute("data-studentIndex");
      const attendanceIndex = e.currentTarget.getAttribute("data-attendanceIndex");
      const attendanceId = e.currentTarget.getAttribute("data-keys");
      const updatedAttendanceStatus = studentAttendanceData[arrayIndex].idSet.map((id) => id.attendanceId === attendanceId ? {...id, status: attendanceValue} : id);
      const arrOfObj = { ...studentAttendanceData[arrayIndex], idSet: updatedAttendanceStatus }
      studentAttendanceData[arrayIndex] = arrOfObj
      if(attendanceValue !== "") {
        setStudentAttendanceData(studentAttendanceData)
        setEditState({...editState, [attendanceIndex]: "edited"})
      };
    };

    const studentsFullNameList = studentAttendanceData
    .map(({ name }) => name)
    .sort((firstName, secondName) => firstName.name < secondName.name ? -1 : (firstName.name > secondName.name) ? 1 : 0);


    const colorHighlight = {
      "PRESENT": '#6CE086',
      "TARDY": '#FFDD59',
      "ABSENT": '#FF6766'
    };

    const renderAttendanceChip = (attendanceIdArray, attendanceId, keys, editState) => {
      const renderEachButton = ["PRESENT", "TARDY", "ABSENT"].indexOf((attendanceIdArray[keys].status)) >= 0 && editState[keys] !== "edited";
      if(renderEachButton) {
        return (<Button style={{backgroundColor: colorHighlight[attendanceIdArray[keys].status], color: 'black'}} disabled>{attendanceIdArray[keys].status}</Button>)
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
              <StudentFilterOrSortDropdown students={studentsFullNameList} setSortByAlphabet={setSortByAlphabet} sortByAlphabet={sortByAlphabet}/>
            </TableCell>
            {sessions
            .sort((a,b) => a.id - b.id)
            .map(({ startDatetime, id }, i) => (
        <TableCell className={classes.tableCell}>
          {`Session ${i + 1} (${moment(startDatetime).calendar()})`}
        {checkEditState(id) ? 
        <Checkbox
        checked={isEdit[id]}
        onChange={handleEdit}
        checkedIcon={<Check fontSize="small" style={{color: 'white'}} />}
        icon={<Add fontSize="small"/>}
        id={id}
        disableRipple
        classes={{ root: classes.checkbox, checked: classes.checkbox2 }}
      /> : <SessionButton 
            attendanceArray={attendanceRecord} 
            id={id} 
            setAttendanceRecord={setAttendanceRecord} 
            editState={editState} setEditState={setEditState} 
            setCurrentSessionId={setCurrentSessionId} 
            studentAttendanceData={studentAttendanceData} 
            setStudentAttendanceData={setStudentAttendanceData} 
            sortAttendanceArray={sortAttendanceArray}
          />}
        </TableCell>
      )
    )}
          </TableRow>
        </TableHead>
        <TableBody>
          {studentAttendanceDisplay.map((row, i) => (
              <TableRow key={row.studentId}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                {row.idSet.map((id, index) => (
                    <TableCell align="right" id={row.studentId}>
                      {!checkEditState2(id.sessionId) && renderAttendanceChip(row.idSet, id.attendanceId, index, editState)}
                      {isEdit[index + 1] && (
                        <ButtonGroup>
                          <Button 
                            data-studentIndex={i}
                            data-attendanceIndex={index + 1} 
                            data-keys={id.attendanceId} 
                            value="PRESENT" 
                            onClick={handleClick} 
                            style={{backgroundColor: `${id.status === "PRESENT" || id.status === "UNSET" ? '#6CE086' : '#C9FFD5'}`}}
                          >
                            <Typography style={{fontWeight: 500, color: 'black'}}>P</Typography>
                          </Button>
                          <Button 
                            data-studentIndex={i}
                            data-attendanceIndex={index + 1} 
                            data-keys={id.attendanceId} 
                            value="TARDY" 
                            onClick={handleClick} 
                            style={{backgroundColor: `${id.status === "TARDY" || id.status === "UNSET" ? '#FFDD59' : '#FFF6D4'}`}}
                          >
                            <Typography style={{fontWeight: 500, color: 'black'}}>T</Typography>
                          </Button>
                          <Button 
                            data-studentIndex={i}
                            data-attendanceIndex={index + 1} 
                            data-keys={id.attendanceId} 
                            value="ABSENT" 
                            onClick={handleClick} 
                            style={{backgroundColor: `${id.status === "ABSENT" || id.status === "UNSET" ? '#FF6766' : '#FFD8D8'}`}}
                          >
                            <Typography style={{fontWeight: 500, color: 'black'}}>A</Typography>
                          </Button>
                        </ButtonGroup>
                      )}
                    </TableCell>
                  )
                )}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendanceTable;
