import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ChatIcon from '@material-ui/icons/Chat';
import { Link } from "react-router-dom";
import { fullName} from "../../../utils";

const useStyles = makeStyles({
    table: {
      minWidth: 1460,
    },
  });
  
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

  
const Studentenrollment = ({enrollment}) => {
    const classes = useStyles();
    const enrollmentCell = enrollment.sort((firstStudent, secondStudent) => (firstStudent.student.user.lastName < secondStudent.student.user.lastName ? -1 : 0)).map(students => {
        const { accountType, primaryParent, user } = students.student;
        const concatFullStudentName = fullName(user);
        const studentId = user.id;
        const concatFullParentName = fullName(primaryParent.user);
        const parentAccountType = primaryParent.accountType.toLowerCase();
        const phoneNumber = primaryParent.phoneNumber;
        const parentId = primaryParent.user.id
        
        return (
            <TableRow key={concatFullStudentName}>
            <TableCell component="th" scope="row" component={Link} to={`/accounts/${accountType.toLowerCase()}/${studentId}`} style={{textDecoration: "none", fontWeight: 700}}>
              {concatFullStudentName}
            </TableCell>
            <TableCell align="right" component={Link} to={`/accounts/${parentAccountType}/${parentId}`} style={{textDecoration: "none"}}>{concatFullParentName}</TableCell>
            <TableCell align="right">{phoneNumber}</TableCell>
            <TableCell align="right"><MailOutlineIcon /></TableCell>
            <TableCell align="right"><ChatIcon /></TableCell>
          </TableRow>
        )
    })
    // console.log(enrollmentCell);

    return (
        <>
        <Grid item xs={12}>
         <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell align="right">Parent</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {enrollmentCell}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
        </>
    )
}

export default Studentenrollment