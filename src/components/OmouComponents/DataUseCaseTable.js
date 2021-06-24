import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { white, omouBlue } from '../../theme/muiTheme';

const useStyles = makeStyles({
    dataPopup: {
        padding: '2rem',
        backgroundColor: white,
    },
    verticalMargin: {
        marginTop: '1rem',
    },
    tableHead: {
        background: omouBlue,
        color: white,
        borderLeft: `1px solid ${omouBlue}`,
        borderRight: `1px solid ${omouBlue}`,
    },
    leftCell: {
        borderLeft: '1px solid gray',
        borderRight: '1px solid gray',
    },
    rightCell: {
        borderRight: '1px solid gray',
    },
});

const accountsTable = [
    {
        dataField: 'Parent First Name',
        useCase: `Shown in parent's account profile`,
    },
    {
        dataField: 'Parent Last Name',
        useCase: `Shown in parent's account profile`,
    },
    {
        dataField: 'Parent Email',
        useCase: `Shown in parent’s account profile. Used as a unique identifier for the account.  Used to contact/send automated emails to parent. Used to create parent portal account.`,
    },
    {
        dataField: 'Parent Phone',
        useCase: `Shown in parent’s account profile. Used to contact/send automated SMS to parent.`,
    },
    {
        dataField: 'Parent Zip Code (Optional)',
        useCase: `Shown in parent's account profile`,
    },
    {
        dataField: 'Student First Name',
        useCase: `Shown in parent's account profile`,
    },
    {
        dataField: 'Student Last Name',
        useCase: `Shown in parent's account profile`,
    },
    {
        dataField: 'Student Email',
        useCase: `Shown in student’s account profile. Used as a unique identifier for the account. `,
    },
    {
        dataField: 'Student Birthday (Optional)',
        useCase: `Shown in student’s account profile. Used as a unique identifier for the account. `,
    },
    {
        dataField: 'Student School (Optional)',
        useCase: `Shown in student’s account profile.`,
    },
    {
        dataField: 'Student Grade Level (Optional)',
        useCase: `Shown in student’s account profile.`,
    },
    {
        dataField: 'Instructor First Name',
        useCase: `Shown in instructor’s account profile.`,
    },
    {
        dataField: 'Instructor Last Name',
        useCase: `Shown in instructor’s account profile.`,
    },
    {
        dataField: 'Instructor Email',
        useCase: `Shown in instructor’s account profile. Used as a unique identifier for the account. Used to contact instructor.`,
    },
    {
        dataField: 'Instructor Phone',
        useCase: `Shown in instructor’s account profile. Used to contact instructor.`,
    },
    {
        dataField: 'Instructor Biography (Optional)',
        useCase: `Shown in instructor’s account profile. Used to match instructor with students.`,
    },
    {
        dataField: 'Instructor Years of Experience (Optional)',
        useCase: `Shown in instructor’s account profile. Used to match instructor with students.`,
    },
    {
        dataField: 'Instructor Address (Optional)',
        useCase: `Shown in instructor’s account profile.`,
    },
];

const coursesTable = [
    {
        dataField: 'Course Subject',
        useCase: `Shown in parent's account profile`,
    },
    { dataField: 'Course Name', useCase: `Indicates name of the course.` },
    {
        dataField: 'Course Instructor',
        useCase: `Indicates who’s teaching the course.`,
    },
    {
        dataField: 'Instructor Confirmed',
        useCase: `Indicates whether the instructor has confirmed teaching the course.`,
    },
    {
        dataField: 'Course Description',
        useCase: `A shory description of what the course is about.`,
    },
    {
        dataField: 'Academic Level',
        useCase: `Indicates what academic level the course is designed for. Academic levels are categorized as Elementary, Middle School, High School or College.`,
    },
    {
        dataField: 'Room Location',
        useCase: `Indicates location of the course. Can be a physical location or an online link.`,
    },
    {
        dataField: 'Start/End Date',
        useCase: `Time span of when the course takes place.`,
    },
    {
        dataField: 'Session Days',
        useCase: `Days of the week when the course takes place (Monday - Sunday).`,
    },
    {
        dataField: 'Start Time/End Time',
        useCase: `Time of day when the course takes place. Currently we only support a single time input per day per course.`,
    },
];

const DataUseCaseTable = () => {
    const classes = useStyles();

    return (
        <div className={classes.dataPopup}>
            <Typography variant='h2'> Why am I Entering this Data?</Typography>
            <Typography variant='h6' style={{ marginTop: '2rem' }}>
                We need your data to give you the most personalized experience.
                We will require you to enter some data that are essential to
                your onboarding onto the Omou platform, while keeping others as
                optional to best fit your needs. The table below will help you
                understand how the data you put in is being used.
            </Typography>

            <Typography align='left' variant='h3' style={{ marginTop: '2rem' }}>
                Business Information
            </Typography>

            <TableContainer className={classes.verticalMargin}>
                <Table size='small'>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell>Data Field</TableCell>
                            <TableCell>Use Case</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.leftCell}>
                                Business Name
                            </TableCell>
                            <TableCell className={classes.rightCell}>
                                Shown in payment receipt pdf/printouts.
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.leftCell}>
                                Business Phone
                            </TableCell>
                            <TableCell className={classes.rightCell}>
                                Shown in payment receipt pdf/printouts.
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.leftCell}>
                                Business Email
                            </TableCell>
                            <TableCell className={classes.rightCell}>
                                Shown in payment receipt pdf/printouts.
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.leftCell}>
                                Business Address
                            </TableCell>
                            <TableCell className={classes.rightCell}>
                                Shown in payment receipt pdf/printouts.
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.leftCell}>
                                Business Hours
                            </TableCell>
                            <TableCell className={classes.rightCell}>
                                Shown in payment receipt pdf/printouts.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography align='left' variant='h3' style={{ marginTop: '2rem' }}>
                Accounts
            </Typography>
            <TableContainer className={classes.verticalMargin}>
                <Table size='small'>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell>Data Field</TableCell>
                            <TableCell>Use Case</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accountsTable.map((row, i) => (
                            <TableRow key={i} className={classes.rightCell}>
                                <TableCell className={classes.leftCell}>
                                    <Typography noWrap>
                                        {row.dataField}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{row.useCase}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography align='left' variant='h3' style={{ marginTop: '2rem' }}>
                Courses
            </Typography>
            <TableContainer className={classes.verticalMargin}>
                <Table size='small'>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell>Data Field</TableCell>
                            <TableCell>Use Case</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coursesTable.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell className={classes.leftCell}>
                                    <Typography noWrap>
                                        {row.dataField}
                                    </Typography>
                                </TableCell>
                                <TableCell className={classes.rightCell}>
                                    <Typography>{row.useCase}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography align='left' variant='h3' style={{ marginTop: '2rem' }}>
                Course Enrollment
            </Typography>
            <TableContainer className={classes.verticalMargin}>
                <Table size='small'>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell>Data Field</TableCell>
                            <TableCell>Use Case</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.leftCell}>
                                <Typography noWrap>Student Enrolled</Typography>
                            </TableCell>
                            <TableCell className={classes.rightCell}>
                                <Typography>
                                    Student who is enrolled in the course. The
                                    student must be as up under Accounts before
                                    you can enroll them to a course
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default DataUseCaseTable;
