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
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Checkbox from "@material-ui/core/Checkbox";
import { Add, Check } from "@material-ui/icons";
import Loading from "../../OmouComponents/Loading";
import {
  StudentFilterOrSortDropdown,
  SessionDropdownButton,
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
  buttonGroupStyle: {
    border: "none",
    padding: 0,
    minWidth: "1.5em",
    minHeight: "1.5em",
  },
  buttonStatusStyle: {
    maxWidth: "5.715em",
    width: "100%",
    maxHeight: "2em",
    height: "100%",
    textTransform: "none",
  },
}));

// If not using studentId delete it
function createStudentAttendanceRow(studentName, attendanceList) {
  return { studentName, attendanceList };
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

const AttendanceTable = ({ setIsEditing }) => {
  const { id: courseId } = useParams();
  const classes = useStyles();
  const [attendanceEditStates, setAttendanceEditStates] = useState();
  const [isCheckBoxEditing, setIsCheckBoxEditing] = useState();
  const [courseAttendanceMatrix, setCourseAttendanceMatrix] = useState([]);
  const [sortByAlphabet, setSortByAlphabet] = useState("");
  const [attendanceBySession, setAttendanceBySession] = useState({});

  // This is used to check each session for any status that is not unset, and set the attendancEditingState to done
  // Once it is set to done, the check mark turns into a the dropdown
  useEffect(() => {
    if (courseAttendanceMatrix.length > 0) {
      let sessionsDoneEditing = {};
      courseAttendanceMatrix.forEach((studentAttendanceRow) => {
        const { attendanceList: studentAttendanceList } = studentAttendanceRow;
        studentAttendanceList.forEach((attendanceStatus) => {
          const { sessionId } = attendanceStatus;
          if (attendanceStatus[sessionId] !== "UNSET") {
            sessionsDoneEditing[sessionId] = "done";
          }
        });
      });
      setAttendanceEditStates({
        ...attendanceEditStates,
        ...sessionsDoneEditing,
      });
    }
  }, [courseAttendanceMatrix]);

  const sortByFirstName = (firstStudent, secondStudent) => {
    if (firstStudent.studentName < secondStudent.studentName) {
      return -1;
    } else if (firstStudent.studentName > secondStudent.studentName) {
      return 1;
    } else {
      return 0;
    }
  };

  const populateInitialAttendanceEditStates = (
    accumulatedSessionStates,
    session
  ) => ({
    ...accumulatedSessionStates,
    [session.id]: "noSelect",
  });

  const populateCheckBoxState = (allCheckboxStatus, { id: sessionId }) => ({
    ...allCheckboxStatus,
    [sessionId]: false,
  });

  const populateInitialCourseAttendanceMatrix = (
    allStudentAttendanceRowsData,
    attendance
  ) => {
    const studentId = attendance.enrollment.student.user.id;
    const setInitialStudentRowData = (initalStudentRowData) =>
      initalStudentRowData || [];
    allStudentAttendanceRowsData[studentId] = setInitialStudentRowData(
      allStudentAttendanceRowsData[studentId]
    );
    allStudentAttendanceRowsData[studentId].push({
      attendanceId: attendance.id,
      [attendance.session.id]: attendance.status,
      sessionId: attendance.session.id,
    });
    return allStudentAttendanceRowsData;
  };

  const { data, loading, error } = useQuery(GET_ATTENDANCE, {
    variables: { courseId },
    onCompleted: () => {
      const { sessions, enrollments, attendances } = data;
      setAttendanceEditStates(
        sessions.reduce(populateInitialAttendanceEditStates, {})
      );

      setIsCheckBoxEditing(sessions.reduce(populateCheckBoxState, {}));

      const studentAttendanceRowsData = attendances.reduce(
        populateInitialCourseAttendanceMatrix,
        {}
      );
      const sortBySessionId = (firstEl, secondEl) =>
        firstEl.sessionId - secondEl.sessionId;
      const populatedCourseAttendanceMatrix = enrollments
        .map((enrollment) =>
          createStudentAttendanceRow(
            fullName(enrollment.student.user),
            studentAttendanceRowsData[enrollment.student.user.id].sort(
              sortBySessionId
            )
          )
        )
        .sort(sortByFirstName);
      setCourseAttendanceMatrix(populatedCourseAttendanceMatrix);
    },
  });

  const [updateAttendance] = useMutation(UPDATE_ATTENDANCE_STATUS, {
    error: (err) => console.error(err),
  });

  if (loading || !isCheckBoxEditing || !attendanceEditStates)
    return <Loading />;
  if (error) return error.message;
  const { sessions } = data;

  // checkAttendanceEditStateToRenderCheckbox is checking to render either the button or the checkbox
  const checkAttendanceEditStateToRenderCheckbox = (id) =>
    attendanceEditStates[id] === "noSelect" ||
    attendanceEditStates[id] === "beginEdit" ||
    attendanceEditStates[id] === "edited";

  // checkAttendanceEditStateToRednerAttendanceStatus is checking to render each students attendance status
  const checkAttendanceEditStateToRednerAttendanceStatus = (id) =>
    (attendanceEditStates[id] === "noSelect" ||
      attendanceEditStates[id] === "edited") &&
    isCheckBoxEditing[id];

  const handleEdit = (e) => {
    const sessionId = e.currentTarget.getAttribute("id");
    if (isCheckBoxEditing[sessionId] === false) {
      setIsCheckBoxEditing({ ...isCheckBoxEditing, [sessionId]: true });
      setIsEditing(true);
      setAttendanceEditStates({
        ...attendanceEditStates,
        [sessionId]: "edited",
      });
    } else {
      setIsCheckBoxEditing({ ...isCheckBoxEditing, [sessionId]: false });
      setIsEditing(false);
      courseAttendanceMatrix.forEach((iterate) => {
        iterate.attendanceList.forEach((x) => {
          if (x[sessionId] !== "UNSET") {
            setAttendanceEditStates({
              ...attendanceEditStates,
              [sessionId]: "done",
            });
          } else {
            setAttendanceEditStates({
              ...attendanceEditStates,
              [sessionId]: "edited",
            });
          }
        });
      });
    }
  };

  const handleClick = async (e) => {
    const studentAttendanceStatus = e.currentTarget.value;
    const studentRow = e.currentTarget.getAttribute("data-studentIndex");
    const sessionId = e.currentTarget.getAttribute("data-sessionId");
    const attendanceId = e.currentTarget.getAttribute("data-attendanceId");
    const updatedAttendanceStatus = courseAttendanceMatrix[
      studentRow
    ].attendanceList.map((studentRow) =>
      studentRow.sessionId === sessionId
        ? { ...studentRow, [sessionId]: studentAttendanceStatus }
        : studentRow
    );
    const updatedStudentRow = {
      ...courseAttendanceMatrix[studentRow],
      attendanceList: updatedAttendanceStatus,
    };
    courseAttendanceMatrix[studentRow] = updatedStudentRow;
    if (studentAttendanceStatus !== "") {
      setCourseAttendanceMatrix(courseAttendanceMatrix);
      setAttendanceEditStates({
        ...attendanceEditStates,
        [sessionId]: "edited",
      });
      await updateAttendance({
        variables: { attendanceId, status: studentAttendanceStatus },
      });
    }
  };

  const formatAttendanceStatusToPascalCase = (string) =>
    string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();

  const studentsFullNameList = courseAttendanceMatrix
    .map(({ studentName }) => studentName)
    .sort(sortByFirstName);

  const attendanceStatusSelectColor = {
    PRESENT: "#6CE086",
    TARDY: "#FFDD59",
    ABSENT: "#FF6766",
  };

  const attendanceStatusUnselectColor = {
    PRESENT: "#C9FFD5",
    TARDY: "#FFF6D4",
    ABSENT: "#FFD8D8",
  };

  const renderAttendanceStatus = (
    studentAttendanceList,
    attendanceListIndex,
    sessionId
  ) => {
    const renderEachButton =
      ["PRESENT", "TARDY", "ABSENT"].indexOf(
        studentAttendanceList[attendanceListIndex][sessionId]
      ) >= 0;
    if (renderEachButton) {
      return (
        <Button
          style={{
            backgroundColor:
              attendanceStatusSelectColor[
                studentAttendanceList[attendanceListIndex][
                  studentAttendanceList[attendanceListIndex].sessionId
                ]
              ],
            color: "black",
          }}
          className={classes.buttonStatusStyle}
          disabled
        >
          {formatAttendanceStatusToPascalCase(
            studentAttendanceList[attendanceListIndex][
              studentAttendanceList[attendanceListIndex].sessionId
            ]
          )}
        </Button>
      );
    } else {
      return null;
    }
  };

  const renderButtonSelection = (
    studentIndex,
    sessionColumn,
    value,
    borderTop,
    borderBottom
  ) => (
    <IconButton
      data-studentIndex={studentIndex}
      data-sessionId={sessionColumn.sessionId}
      data-attendanceId={sessionColumn.attendanceId}
      value={value}
      size='small'
      className={classes.buttonGroupStyle}
      onClick={handleClick}
      style={{
        backgroundColor: `${
          sessionColumn[sessionColumn.sessionId] === value ||
          sessionColumn[sessionColumn.sessionId] === "UNSET"
            ? attendanceStatusSelectColor[
                sessionColumn[sessionColumn.sessionId]
              ]
            : attendanceStatusUnselectColor[
                sessionColumn[sessionColumn.sessionId]
              ]
        }`,
        ...borderTop,
        ...borderBottom,
      }}
    />
  );

  const sortDescOrder = (firstEl, secondEl) => (firstEl < secondEl ? -1 : 0);
  const sortAscOrder = (firstEl, secondEl) => (firstEl > secondEl ? -1 : 0);
  const sortByRecentSession = (firstSession, secondSession) =>
    firstSession.id - secondSession.id;

  const studentAttendanceDataToDisplay = courseAttendanceMatrix
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
              .sort(sortByRecentSession)
              .map(({ startDatetime, id: sessionId }, index) => (
                <TableCell className={classes.tableCell} key={sessionId}>
                  {`Session ${index + 1} (${moment(startDatetime).format(
                    "MM/DD/YYYY"
                  )})`}
                  {checkAttendanceEditStateToRenderCheckbox(sessionId) ? (
                    <Checkbox
                      checked={isCheckBoxEditing[sessionId]}
                      onChange={handleEdit}
                      checkedIcon={
                        <Check fontSize='small' style={{ color: "white" }} />
                      }
                      icon={<Add fontSize='small' />}
                      id={sessionId}
                      disableRipple
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checkbox2,
                      }}
                    />
                  ) : (
                    <SessionDropdownButton
                      id={sessionId}
                      attendanceEditStates={attendanceEditStates}
                      setAttendanceEditStates={setAttendanceEditStates}
                      studentAttendanceDataToDisplay={
                        studentAttendanceDataToDisplay
                      }
                      setCourseAttendanceMatrix={setCourseAttendanceMatrix}
                      setSortByAlphabet={setSortByAlphabet}
                      index={index}
                    />
                  )}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {studentAttendanceDataToDisplay.map((row, studentIndex) => (
            <TableRow key={row.studentName}>
              <TableCell component='th' scope='row'>
                {row.studentName}
              </TableCell>
              {row.attendanceList.map((sessionColumn, attendanceIndex) => (
                <TableCell align='center' key={sessionColumn.attendanceId}>
                  {!checkAttendanceEditStateToRednerAttendanceStatus(
                    sessionColumn.sessionId
                  ) ? (
                    renderAttendanceStatus(
                      row.attendanceList,
                      attendanceIndex,
                      sessionColumn.sessionId
                    )
                  ) : (
                    <ButtonGroup>
                      {renderButtonSelection(
                        studentIndex,
                        sessionColumn,
                        "PRESENT",
                        { borderTopLeftRadius: 2 },
                        { borderBottomLeftRadius: 2 }
                      )}
                      {renderButtonSelection(
                        studentIndex,
                        sessionColumn,
                        "TARDY"
                      )}
                      {renderButtonSelection(
                        studentIndex,
                        sessionColumn,
                        "ABSENT",
                        { borderTopRightRadius: 2 },
                        { borderBottomRightRadius: 2 }
                      )}
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
