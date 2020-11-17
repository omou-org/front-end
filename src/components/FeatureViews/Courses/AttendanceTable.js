import React, { useState } from 'react';
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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import { ExpandLess, ExpandMore, Add, Check } from "@material-ui/icons"
import Loading from 'components/OmouComponents/Loading';
import { buttonBlue } from "../../../theme/muiTheme";

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
    whiteSpace: 'nowrap'
  },
  buttonDropDown: {
    border: '1px solid #43B5D9',
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
  }
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const WrapperButtonComponent = ({ children }) => {
  const classes = useStyles();
  const [cellHead, setCellHead] = useState(null);
  const handleOpen = e => setCellHead(e.currentTarget);
  const handleClose = () => setCellHead(null);

  return (
  <div>
      <Button
        aria-controls="cell-header-menu"
        aria-haspopup="true"
        onClick={handleOpen}
        className={classes.buttonDropDown}
      >
        {children} {cellHead ? <ExpandLess /> : <ExpandMore />}
      </Button>
      <Menu
        id="cell-header-menu"
        anchorEl={cellHead}
        keepMounted
        open={Boolean(cellHead)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <MenuItem onClick={handleClose}><Button className={classes.attendanceButton}><Typography variant="body2" style={{letterSpacing: '0.02em'}}>TAKE ATTENDANCE</Typography></Button></MenuItem>
      </Menu>
    </div>
  )
};

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
  


const AttendanceTable = () => {
    const { id } = useParams();
    const classes = useStyles();
    const [edit, setEdit] = useState();
    const [currentSelectedSession, setCurrentSelectedSession] = useState();
    const { data, loading, error} = useQuery(GET_ATTENDANCE, {
        variables: { courseId: id },
        onCompleted: () => {
          // setEdit(data.sessions.map(({ id }) => ({ [id]: false })))
          setEdit(data.sessions.reduce((accum, currentValue) => ({...accum, [currentValue.id]: false }), {}))
          setCurrentSelectedSession((data.sessions[0].id))
        },
    });

    if(loading) return <Loading />;
    if(!edit) return <Loading />;
    if(error) return console.error(error);
    const { enrollments, sessions } = data;

    const handleEdit = e => {
      const sessionId = e.currentTarget.getAttribute("data-session-id")
        if(edit[sessionId] === false) {
          setEdit({...edit, [sessionId]: true})
        } else {
          setEdit({...edit, [sessionId]: false});
        }  
    }

  return (
    <TableContainer className={classes.table}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{color: 'black'}}>
              <WrapperButtonComponent>
              Student
              </WrapperButtonComponent>
            </TableCell>
            {sessions.map(({ startDatetime, id }, i) => {
      const startingDate = moment(startDatetime).calendar();
      return (
        <TableCell className={classes.tableCell}>
          {`Session ${i + 1} (${startingDate})`}
          <IconButton onClick={handleEdit} data-session-id={id}>
            {edit[id] === true ? <Check /> : <Add /> }
          </IconButton>

        </TableCell>
      )
    })}
          </TableRow>
        </TableHead>
        <TableBody>
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