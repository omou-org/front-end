import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import React, {useCallback} from 'react';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {paymentToString, tuitionAmount} from 'utils';
import Loading from 'components/OmouComponents/Loading';
import NavLinkNoDup from 'components/Routes/NavLinkNoDup';
import NoListAlert from 'components/OmouComponents/NoListAlert';
import Moment from 'react-moment';

const courseLabel = (enrollments) =>
    enrollments &&
    `${enrollments.length} Course${enrollments.length !== 1 ? 's' : ''}`;

const InvoicesTable = ({
    paymentList,
    type,
    enrollmentID,
    courseID,
    rootRoute = '/accounts/parent/payment/',
}) => {
    const course = useSelector(({ Course }) => Course.NewCourseList[courseID]);

    const numPaidSessionsByPayment = useCallback(
        (paymentID) => {
            const payment = paymentList.find(({ id }) => id === paymentID);
            if (!payment) {
                return null;
            }
            const registration = payment.registrations.find(
                ({ enrollment }) => enrollment === enrollmentID
            );
            if (!registration) {
                return null;
            }
            return registration.num_sessions;
        },
        [paymentList, enrollmentID]
    );

    if (!paymentList) {
        return <Loading />;
    } else if (paymentList.length === 0) {
        return <NoListAlert list='Payments' />;
    }

    return (
        <Grid className='payments-history' item md={12}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Transaction Date</TableCell>
                        <TableCell>
                            {type === 'enrollment' ? 'Paid Sessions' : 'Course'}
                        </TableCell>
                        <TableCell>Amount Paid</TableCell>
                        <TableCell>Method</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paymentList.map((payment) => (
                        <TableRow
                            component={NavLinkNoDup}
                            hover
                            key={payment.id}
                            to={`${rootRoute}${payment.id}`}
                        >
                            <TableCell>{payment.id}</TableCell>
                            <TableCell>
                                <Moment
                                    date={payment.created_at}
                                    format='M/DD/YYYY'
                                />
                            </TableCell>
                            <TableCell>
                                {type === 'enrollment'
                                    ? numPaidSessionsByPayment(payment.id)
                                    : courseLabel(payment.registrationSet)}
                            </TableCell>
                            <TableCell>
                                {type === 'enrollment'
                                    ? tuitionAmount(
                                          course,
                                          numPaidSessionsByPayment(payment.id)
                                      )
                                    : `$${payment.total}`}
                            </TableCell>
                            <TableCell>
                                {paymentToString(payment.method)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>
    );
};

InvoicesTable.propTypes = {
    courseID: PropTypes.number.isRequired,
    enrollmentID: PropTypes.number.isRequired,
    paymentList: PropTypes.array.isRequired,
    type: PropTypes.oneOf(['enrollment', 'parent']).isRequired,
    rootRoute: PropTypes.string,
};

export default InvoicesTable;
