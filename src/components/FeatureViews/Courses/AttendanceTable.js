import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Checkbox from "@material-ui/core/Checkbox";
import { Add, Check } from "@material-ui/icons";
import Loading from "../../OmouComponents/Loading";
import {
  StudentFilterOrSortDropdown,
  SessionButton,
} from "./AttendanceButtons";
import { buttonThemeBlue } from "../../../theme/muiTheme";
import { fullName } from "../../../utils";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "75.2vw",
    overflowY: "auto",
    [theme.breakpoints.down("lg")]: {
      maxWidth: "69vw",
    },
  },
  tableCell: {
    color: "black",
    whiteSpace: "nowrap",
    fontWeight: 500,
  },
  checkbox: {
    borderRadius: 2,
    backgroundColor: buttonThemeBlue,
    color: "white",
    width: "1em",
    height: "1em",
    marginLeft: ".5em",
    "&:hover": {
      backgroundColor: buttonThemeBlue,
    },
  },
  checkbox2: {
    "&:hover": {
      backgroundColor: "rgba(39, 143, 195, 1) !important",
    },
  },
}));

// If not using studentId delete it
function createStudentAttendanceRow(studentName, attendanceList, studentId) {
  return { studentName, attendanceList, studentId };
}

export const GET_ATTENDANCE = gql`
  query getAttendance($courseId: ID!) {
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
  }
`;

export const UPDATE_ATTENDANCE_STATUS = gql`
  mutation UpdateAttendanceStatus(
    $attendanceId: ID!
    $status: AttendanceStatusEnum!
  ) {
    __typename
    updateAttendance(id: $attendanceId, status: $status) {
      attendance {
        updatedAt
      }
    }
  }
`;

const AttendanceTable = ({ setIsEditing, editingState }) => {
  const { id } = useParams();
  const classes = useStyles();
  const [attendanceEditStates, setAttendanceEditStates] = useState();
  const [attendanceRecord, setAttendanceRecord] = useState();
  const [isEdit, setIsEdit] = useState();
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [courseAttendanceMatrix, setCourseAttendanceMatrix] = useState([]);
  const [sortByAlphabet, setSortByAlphabet] = useState("");
  const [attendanceBySession, setAttendanceBySession] = useState({});

  useEffect(() => {
    if(courseAttendanceMatrix.length > 0) {
      let sessionsDoneEditing = {};
      courseAttendanceMatrix.forEach((studentAttendanceRow) => {
        const { attendanceList: studentAttendanceList } = studentAttendanceRow;
        studentAttendanceList.forEach((attendanceStatus) => {
          const { sessionId } = attendanceStatus
          if (attendanceStatus[sessionId] !== "UNSET") {
            sessionsDoneEditing[sessionId] = "done"
          }
        });
      });
      setAttendanceEditStates({ ...attendanceEditStates, ...sessionsDoneEditing });
    }
  }, [courseAttendanceMatrix]);

  const sortByFirstName = (firstEl, secondEl) =>
  { 
    if(firstEl.studentName < secondEl.studentName) {
      return -1
    } else if(firstEl.studentName > secondEl.studentName) {
      return 1 
    } else {
      return 0
    }
  };

  const sortBySessionId = (firstEl, secondEl) => firstEl.sessionId - secondEl.sessionId

  const { data, loading, error } = useQuery(GET_ATTENDANCE, {
    variables: { courseId: id },
    onCompleted: () => {
      const { sessions, enrollments, attendances } = data;
      setAttendanceEditStates(
        sessions.reduce(
          (accum, currentValue) => ({
            ...accum,
            [currentValue.id]: "noSelect",
          }),
          {}
        )
      );
      setAttendanceRecord(
        sessions.reduce(
          (accum, currentValue) => ({ ...accum, [currentValue.id]: null }),
          {}
        )
      );
      setIsEdit(
        sessions.reduce(
          (accum, currentValue) => ({ ...accum, [currentValue.id]: false }),
          {}
        )
      );
      // const newClassData = sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: "" }), {});
      const studentAttendanceRowsData = attendances.reduce(
        (allStudentAttendanceRowsData, { id, enrollment, status, session }) => {
          const studentId = enrollment.student.user.id;
          const setInitialStudentRowData = (initalStudentRowData) =>
            initalStudentRowData || [];
          allStudentAttendanceRowsData[studentId] = setInitialStudentRowData(
            allStudentAttendanceRowsData[studentId]
          );
          allStudentAttendanceRowsData[studentId].push({
            attendanceId: id,
            [session.id]: status,
            sessionId: session.id,
          });
          return allStudentAttendanceRowsData;
        },
        {}
      );
      // const newData = enrollments.map(data => createData(fullName(data.student.user), newClassData, data.student.user.id))
      // .sort((firstEl, secondEl) => firstEl.name < secondEl.name ? -1 : (firstEl.name > secondEl.name) ? 1 : 0)
      const populatedCourseAttendanceMatrix = enrollments
        .map((enrollment) =>
          createStudentAttendanceRow(
            fullName(enrollment.student.user),
            studentAttendanceRowsData[enrollment.student.user.id].sort(sortBySessionId),
            enrollment.student.user.id
          )
        )
        .sort(sortByFirstName);
      setCourseAttendanceMatrix(populatedCourseAttendanceMatrix);
    },
  });

  const [updateAttendance, updateAttendanceResult] = useMutation(
    UPDATE_ATTENDANCE_STATUS,
    {
      error: (err) => console.error(err),
    }
  );

  // const attendance = useQuery(GET_ATTENDANCE1, {
  //   variables: { courseId: id }
  // });

  // if(attendance.loading) return <Loading />
  // console.log(attendance.data.attendances);
  if (loading) return <Loading />;
  if (!isEdit) return <Loading />;
  if (!attendanceEditStates) return <Loading />;
  if (error) return error.message;
  const { enrollments, sessions, attendances } = data;

  const checkEditState = (id) =>
    attendanceEditStates[id] === "noSelect" ||
    attendanceEditStates[id] === "beginEdit" ||
    attendanceEditStates[id] === "edited";
  const checkEditState2 = (id) =>
    attendanceEditStates[id] === "noSelect" || attendanceEditStates[id] === "edited";
  const checkAttendanceValue = (attendanceArray) => {
    return attendanceArray
      .reduce((a, b) => {
        a.push(...b.attendanceList);
        return a;
      }, [])
      .map(({ status }) => status !== "UNSET");
  };
  const handleEdit = (e) => {
    const sessionId = e.currentTarget.getAttribute("id");
    if (isEdit[sessionId] === false) {
      setIsEdit({ ...isEdit, [sessionId]: true });
      setIsEditing(true);
      setAttendanceEditStates({ ...attendanceEditStates, [sessionId]: "edited" });
    } else {
      setIsEdit({ ...isEdit, [sessionId]: false });
      setIsEditing(false);
      courseAttendanceMatrix.forEach((iterate) => {
        iterate.attendanceList.forEach((x) => {
          if (x[sessionId] !== "UNSET") {
            setAttendanceEditStates({ ...attendanceEditStates, [sessionId]: "done" })
          }
          }) 
      })
        // iterate.attendanceList.forEach(
        //   (attendance) => 
        //     attendance.status !== "UNSET" &&
        //     setAttendanceEditStates({ ...attendanceEditStates, [sessionId]: "done" })
        // )
      // );
      // console.log("mutation fires here");
    }
  };

  const handleClick = async (e) => {
    const attendanceValue = e.currentTarget.value;
    const arrayIndex = e.currentTarget.getAttribute("data-studentIndex");
    const attendanceIndex = e.currentTarget.getAttribute(
      "data-attendanceIndex"
    );
    const attendanceId = e.currentTarget.getAttribute("data-keys");
    // console.log(attendanceValue)
    // console.log(attendanceId)
    const updatedAttendanceStatus = courseAttendanceMatrix[
      arrayIndex
    ].attendanceList.map((id) => id.sessionId === attendanceId ? { ...id, [attendanceId]: attendanceValue} : id);
    const arrOfObj = {
      ...courseAttendanceMatrix[arrayIndex],
      attendanceList: updatedAttendanceStatus,
    };
    courseAttendanceMatrix[arrayIndex] = arrOfObj;
    // console.log(arrOfObj)
    // console.log(attendanceId)
    // console.log(attendanceValue)
    if (attendanceValue !== "") {
      setCourseAttendanceMatrix(courseAttendanceMatrix);
      setAttendanceEditStates({ ...attendanceEditStates, [attendanceIndex]: "edited" });
      await updateAttendance({
        variables: { attendanceId, status: attendanceValue },
      });
    }
  };

  const studentsFullNameList = courseAttendanceMatrix
    .map(({ studentName }) => studentName)
    .sort(sortByFirstName);

  const colorHighlight = {
    PRESENT: "#6CE086",
    TARDY: "#FFDD59",
    ABSENT: "#FF6766",
  };

  const renderAttendanceChip = (
    attendanceIdArray,
    keys,
    attendanceEditStates
  ) => {
    const renderEachButton =
      ["PRESENT", "TARDY", "ABSENT"].indexOf(attendanceIdArray[keys][attendanceIdArray[keys].sessionId]) >=
        0 && attendanceEditStates[keys] !== "edited";
        // console.log(renderEachButton)
        // console.log(attendanceIdArray[keys][attendanceIdArray[keys].sessionId])
        // console.log(keys)
    if (renderEachButton) {
      return (
        <Button
          style={{
            backgroundColor: colorHighlight[attendanceIdArray[keys][attendanceIdArray[keys].sessionId]],
            color: "black",
          }}
          disabled
        >
          {attendanceIdArray[keys][attendanceIdArray[keys].sessionId]}
        </Button>
      );
    } else {
      return null;
    }
  };


  // const sortAttendanceArray = () => {
  //   const sortAttendanceList = courseAttendanceMatrix.sort(
  //     (firstEl, secondEl) => {
  //       if (!firstEl[currentSessionId] && !secondEl[currentSessionId]) return;
  //       const attendanceValue = ["PRESENT", "TARDY", "ABSENT"];
  //       const firstValue = attendanceValue.indexOf(firstEl[currentSessionId]);
  //       const secondValue = attendanceValue.indexOf(secondEl[currentSessionId]);
  //       if (firstValue === secondValue) {
  //         return firstEl.name - secondEl.name;
  //       }
  //       return firstValue - secondValue;
  //     }
  //   );
  //   setCourseAttendanceMatrix(sortAttendanceList);
  // };


  const sortDescOrder = (firstEl, secondEl) => (firstEl < secondEl ? -1 : 0);
  const sortAscOrder = (firstEl, secondEl) => (firstEl > secondEl ? -1 : 0);

  const studentAttendanceDisplay = courseAttendanceMatrix
    .filter((student) =>
      sortByAlphabet === "asc" ||
      sortByAlphabet === "desc" ||
      sortByAlphabet === ""
        ? student
        : {
            [student.studentName]: student.studentName,
          }[sortByAlphabet]
    )
    .sort(
      (firstEl, secondEl) =>
        ({
          asc: sortAscOrder(firstEl.studentName, secondEl.studentName),
          desc: sortDescOrder(firstEl.studentName, secondEl.studentName),
        }[sortByAlphabet])
    );
  // console.log(studentAttendanceDisplay.map(row => row))
  // console.log(sortByAlphabet)
  // console.log(studentAttendanceDisplay)
  // console.log(sortStudentList)
  // console.log(currentSessionId);
  // console.log(studentsFullNameList)
  // console.log(newData)
  // console.log(color)
  // console.log(newClassData)
  // console.log(isEdit);
  // console.log(courseAttendanceMatrix)
  // console.log(attendanceBySession);
  // console.log(sessions)
  // console.log(attendanceEditStates)
  // console.log(attendanceRecord)
  return (
    <TableContainer className={classes.table}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "black" }}>
              <StudentFilterOrSortDropdown
                students={studentsFullNameList}
                setSortByAlphabet={setSortByAlphabet}
                sortByAlphabet={sortByAlphabet}
              />
            </TableCell>
            {sessions
              .sort((a, b) => a.id - b.id)
              .map(({ startDatetime, id }, i) => (
                <TableCell className={classes.tableCell}>
                  {`Session ${i + 1} (${moment(startDatetime).calendar()})`}
                  {checkEditState(id) ? (
                    <Checkbox
                      checked={isEdit[id]}
                      onChange={handleEdit}
                      checkedIcon={
                        <Check fontSize='small' style={{ color: "white" }} />
                      }
                      icon={<Add fontSize='small' />}
                      id={id}
                      disableRipple
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checkbox2,
                      }}
                    />
                  ) : (
                    <SessionButton
                      attendanceArray={attendanceRecord}
                      id={id}
                      setAttendanceRecord={setAttendanceRecord}
                      attendanceEditStates={attendanceEditStates}
                      setAttendanceEditStates={setAttendanceEditStates}
                      setCurrentSessionId={setCurrentSessionId}
                      courseAttendanceMatrix={courseAttendanceMatrix}
                      setCourseAttendanceMatrix={setCourseAttendanceMatrix}
                      studentAttendanceDisplay={studentAttendanceDisplay}
                      setSortByAlphabet={setSortByAlphabet}
                      // sortByAlphabet={sortByAlphabet}
                      index={i}
                    />
                  )}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {studentAttendanceDisplay.map((row, i) => (
            <TableRow key={row.studentId}>
              <TableCell component='th' scope='row'>
                {row.studentName}
              </TableCell>
              {row.attendanceList.map((id, index) => (
                <TableCell align='right' id={row.studentId}>
                {/* {console.log(!checkEditState2(id.sessionId))} */}
                  {!checkEditState2(id.sessionId) &&
                    renderAttendanceChip(
                      row.attendanceList,
                      index,
                      attendanceEditStates
                    )}
                  {isEdit[index + 1] && (
                    <ButtonGroup>
                      <Button
                        data-studentIndex={i}
                        data-attendanceIndex={index + 1}
                        data-keys={id.sessionId}
                        value='PRESENT'
                        onClick={handleClick}
                        style={{
                          backgroundColor: `${
                            id[id.sessionId] === "PRESENT" || id[id.sessionId] === "UNSET"
                              ? "#6CE086"
                              : "#C9FFD5"
                          }`,
                        }}
                      >
                        <Typography style={{ fontWeight: 500, color: "black" }}>
                          P
                        </Typography>
                      </Button>
                      <Button
                        data-studentIndex={i}
                        data-attendanceIndex={index + 1}
                        data-keys={id.sessionId}
                        value='TARDY'
                        onClick={handleClick}
                        style={{
                          backgroundColor: `${
                            id[id.sessionId] === "TARDY" || id[id.sessionId] === "UNSET"
                              ? "#FFDD59"
                              : "#FFF6D4"
                          }`,
                        }}
                      >
                        <Typography style={{ fontWeight: 500, color: "black" }}>
                          T
                        </Typography>
                      </Button>
                      <Button
                        data-studentIndex={i}
                        data-attendanceIndex={index + 1}
                        data-keys={id.sessionId}
                        value='ABSENT'
                        onClick={handleClick}
                        style={{
                          backgroundColor: `${
                            id[id.sessionId] === "ABSENT" || id[id.sessionId] === "UNSET"
                              ? "#FF6766"
                              : "#FFD8D8"
                          }`,
                        }}
                      >
                        <Typography style={{ fontWeight: 500, color: "black" }}>
                          A
                        </Typography>
                      </Button>
                    </ButtonGroup>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;
