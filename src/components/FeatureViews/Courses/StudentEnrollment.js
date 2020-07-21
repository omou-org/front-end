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
  

const Studentenrollment = ({enrollmentList}) => {
    const classes = useStyles();
    // console.log(enrollmentCell);

    return (
        <Grid item xs={12}>
         <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Parent</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          { enrollmentList
    .sort((firstStudent, secondStudent) => (firstStudent.student.user.lastName < secondStudent.student.user.lastName ? -1 : 0))
    .map(students => {
        const { accountType, primaryParent, user } = students.student;
        const fullStudentName = fullName(user);
        const studentId = user.id;
        const concatFullParentName = fullName(primaryParent.user);
        const parentAccountType = primaryParent.accountType.toLowerCase();
        const phoneNumber = primaryParent.phoneNumber;
        const parentId = primaryParent.user.id
        
        return (
            <TableRow key={fullStudentName}>
            <TableCell component="th" scope="row" component={Link} to={`/accounts/${accountType.toLowerCase()}/${studentId}`} style={{textDecoration: "none", fontWeight: 700}}>
              {fullStudentName}
            </TableCell>
            <TableCell component={Link} to={`/accounts/${parentAccountType}/${parentId}`} style={{textDecoration: "none"}}>{concatFullParentName}</TableCell>
            <TableCell>{phoneNumber}</TableCell>
            <TableCell><MailOutlineIcon /></TableCell>
            <TableCell><ChatIcon /></TableCell>
          </TableRow>
        )
    })}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    )
}

export default Studentenrollment