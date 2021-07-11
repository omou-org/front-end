import React from 'react';
import {
    Grid,
    Typography,
    // TextField,
    TableContainer,
    TableCell,
    TableHead,
    Table,
    TableRow,
    TableBody,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
    h4,
    body2,
    // slateGrey,
    omouBlue,
    white,
    body1,
} from '../../../../theme/muiTheme';
import { makeStyles } from '@material-ui/styles';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { useQuery, gql } from '@apollo/client';
import Loading from 'components/OmouComponents/Loading';
import { capitalizeString } from 'utils';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';

const useStyles = makeStyles({
    verticalMargin: {
        marginTop: '1rem',
    },
    searchBar: {
        ...body1,
        height: '2.5rem',
        width: '16rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
    tableHead: {
        color: omouBlue,
    },
    headCells: {
        ...h4,
        color: omouBlue,
    },
    discountName: {
        ...body2,
    },
    input: {
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        textAlign: 'center',
        padding: '5px',
    },
    tableFooter: {
        paddingTop: '1vh',
    },
    discountCell: {
        height: '2rem',
        width: '18.2125rem',
    },
});

const GET_DISCOUNTS = gql`
    query {
        discounts(
            isActive: true
            startDate: "2021-07-10"
            endDate: "2021-09-10"
        ) {
            id
            code
            amount
            amountType
            active
            autoApply
            minCourses
            startDate
            endDate
            paymentMethod
            courses {
                id
            }
            allCoursesApply
        }
    }
`;

const Discounts = () => {
    const classes = useStyles();

    const { data, loading, error } = useQuery(GET_DISCOUNTS, {
        fetchPolicy: 'cache-and-network',
    });

    if (loading) return <Loading />;
    if (error) console.error(error);

    const { discounts } = data;
    console.log(discounts);

    return (
        <>
            <Grid
                container
                direction='row'
                justifyContent='flex-end'
                alignItems='center'
                style={{ marginTop: '1.5rem' }}
            >
                <Grid item>
                    <ResponsiveButton
                        variant='outlined'
                        startIcon={<AddIcon />}
                    >
                        new discount
                    </ResponsiveButton>
                </Grid>
            </Grid>
            <Grid className={classes.verticalMargin} container>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classes.headCells}
                                    // style={{ minWidth: 170 }}
                                >
                                    Discount Code
                                </TableCell>
                                <TableCell
                                    className={classes.headCells}
                                    // style={{ minWidth: 170 }}
                                >
                                    Discount Type
                                </TableCell>

                                <TableCell
                                    className={classes.headCells}
                                    // style={{ minWidth: 170 }}
                                >
                                    Discount Amount
                                </TableCell>

                                <TableCell
                                    className={classes.headCells}
                                    // style={{ minWidth: 170 }}
                                >
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {discounts.map(
                                ({ id, code, amount, active, amountType }) => (
                                    <TableRow key={id}>
                                        <TableCell
                                            className={classes.discountCell}
                                        >
                                            <Typography
                                                variant='body2'
                                                className={classes.discountName}
                                            >
                                                {code}
                                            </Typography>
                                        </TableCell>

                                        <TableCell
                                            className={classes.discountCell}
                                        >
                                            {capitalizeString(amountType)}
                                        </TableCell>

                                        <TableCell
                                            className={classes.discountCell}
                                        >
                                            {amountType === 'PERCENT'
                                                ? `${amount}%`
                                                : `$${amount}`}
                                        </TableCell>

                                        <TableCell
                                            className={classes.discountCell}
                                        >
                                            {active ? (
                                                <LabelBadge variant='status-active'>
                                                    Active
                                                </LabelBadge>
                                            ) : (
                                                <LabelBadge variant='status-past'>
                                                    Retired
                                                </LabelBadge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
};

export default Discounts;
