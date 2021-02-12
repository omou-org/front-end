import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import {TableHeadSecondary} from 'theme/ThemedComponents/Table/TableHeadSecondary';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import {fullName} from '../../../utils';
import {highlightColor} from '../../../theme/muiTheme';
import SessionEmailOrNotesModal from './ModalTextEditor';
import ClassEnrollmentRow from './ClassEnrollmentRow';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 1460,
        [theme.breakpoints.between('md', 'lg')]: {
            minWidth: 910,
        },
        [theme.breakpoints.between('sm', 'md')]: {
            minWidth: 677,
        },
    },
    menuSelected: {
        '&:hover': { backgroundColor: highlightColor, color: '#28ABD5' },
        '&:focus': { backgroundColor: highlightColor },
    },
    dropdown: {
        border: '1px solid #43B5D9',
        borderRadius: '5px',
    },
    noBorderBottom: {
        borderBottom: 'none',
    },
    borderBottom: {
        borderBottom: '1px solid rgba(224, 224, 224, 1);',
    },
    studentAccordionSpacing: {
        width: '220px',
        paddingLeft: '31px',
    },
    parentAccordionSpacing: {
        width: '200px',
    },
}));

const ClassEnrollmentList = ({ enrollmentList, loggedInUser }) => {
    const classes = useStyles();

    const [modalOpen, setModalOpen] = useState(false);
    const [typeOfAccount, setTypeOfAccount] = useState();
    const [userId, setUserId] = useState();

    const handleOpenModal = (currentValue, dataType) => {
        setUserId(currentValue);
        setTypeOfAccount(dataType);
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    return (
        <Grid item xs={12}>
            <TableContainer>
                <Table>
                    <TableHeadSecondary>
                        <TableRow className={classes.borderBottom}>
                            <TableCell
                                className={`${classes.studentAccordionSpacing} ${classes.noBorderBottom}`}
                            >
                                Student
                            </TableCell>
                            <TableCell
                                className={`${classes.parentAccordionSpacing} ${classes.noBorderBottom}`}
                            >
                                Parent
                            </TableCell>
                            <TableCell className={classes.noBorderBottom}>
                                Phone
                            </TableCell>
                        </TableRow>
                    </TableHeadSecondary>
                </Table>
            </TableContainer>
            <TableContainer>
                <Table className={classes.table}>
                    <TableBody>
                        {enrollmentList
                            .sort((firstStudent, secondStudent) =>
                                firstStudent.student.user.lastName <
                                secondStudent.student.user.lastName
                                    ? -1
                                    : 0
                            )
                            .map((students) => {
                                const {
                                    accountType,
                                    primaryParent,
                                    user,
                                    studentschoolinfoSet,
                                } = students.student;
                                const fullStudentName = fullName(user);
                                const studentId = user.id;
                                const concatFullParentName = primaryParent ? fullName(
                                    primaryParent.user
                                ) : "N/A";
                                const parentAccountType =
                                    primaryParent?.accountType;
                                const phoneNumber = primaryParent?.phoneNumber;
                                const parentId = primaryParent?.user.id;
                                const parentEmail = primaryParent?.user.email;
                                const studentInfo = studentschoolinfoSet;
                                return (
                                    <ClassEnrollmentRow
                                        fullStudentName={fullStudentName}
                                        accountType={accountType}
                                        studentId={studentId}
                                        parentAccountType={parentAccountType}
                                        parentId={parentId}
                                        concatFullParentName={
                                            concatFullParentName
                                        }
                                        phoneNumber={phoneNumber}
                                        handleOpenModal={handleOpenModal}
                                        studentInfo={studentInfo}
                                    />
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <SessionEmailOrNotesModal
                open={modalOpen}
                handleCloseForm={handleCloseModal}
                accountType={typeOfAccount}
                userId={userId}
                origin='STUDENT_ENROLLMENT'
                posterId={loggedInUser}
            />
        </Grid>
    );
};

export default ClassEnrollmentList;
