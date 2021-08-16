import React, { 
    useState 
} from 'react';
import { makeStyles } from '@material-ui/styles';
import { NavLink, withRouter, useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';
import RetireModal from './RetireModal';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import {
    // h4,
    h3,
    h5,
    slateGrey,
    white,
    // omouBlue,
    // body1,
    // body2,
} from '../../../../theme/muiTheme';
import Modal from '@material-ui/core/Modal';

import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import { capitalizeString, dateTimeToDate } from 'utils';

const useStyles = makeStyles({
    root: {
        marginTop: '1rem',
    },
    breadcrumb: {
        width: '8.25rem',
        height: '1rem',
        ...h5,
    },
    codeHead: {
        ...h3,
    },
    label: {
        color: slateGrey,
    },
    vertMargin: {
        marginTop: '1rem',
    },
    marginVertSm: {
        marginBottom: '0.5rem',
    },
    modalStyle: {
        top: '50%',
        left: `50%`,
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        width: '31.8em',
        height: '21em',
        background: white,
        boxShadow: '0px 0px 8px rgba(153, 153, 153, 0.8);',
        borderRadius: '5px',
    },
    modalTypography: {
        marginBottom: '1em',
    },
});

const GET_DISCOUNT = gql`
    query MyQuery($discountId: ID) {
        discount(discountId: $discountId) {
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
                courseCategory {
                    name
                }
            }
            allCoursesApply
            createdAt
        }
    }
`;

const DiscountView = ({ location }) => {
    const classes = useStyles();
    const history = useHistory();

    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const {
        state: { id },
    } = location;

    const { loading, error, data } = useQuery(GET_DISCOUNT, {
        variables: {
            discountId: id,
        },
        fetchPolicy: 'cache-and-network',
    });

    if (loading) return null;
    if (error) return `Error! ${error}`;
    const { discount } = data;
    const {
        code,
        active,
        amountType,
        amount,
        autoApply,
        startDate,
        endDate,
        minCourses,
        paymentMethod,
        allCoursesApply,
        courses,
        createdAt
    } = discount;
    console.log(discount);
    console.log(id);

    return (
        <Grid
            container
            direction='column'
            justifyContent='center'
            alignItems='flex-start'
            className={classes.root}
        >
            <Grid item xs={12}>
                <NavLink
                    className={classes.breadcrumb}
                    color='inherit'
                    onClick={() => history.goBack()}
                    to='/adminportal/discounts'
                >
                    {'< ALL DISCOUNT CODES'}
                </NavLink>
            </Grid>

            <Grid
                item
                container
                direction='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Grid
                    item
                    container
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    className={classes.vertMargin}
                    // style={{ border: '1px solid black' }}
                >
                    <Grid
                        item
                        container
                        direction='row'
                        justifyContent='flex-start'
                        alignItems='center'
                        xs={6}
                    >
                        <Grid
                            container
                            justifyContent='flex-start'
                            alignItems='center'
                            item
                            xs={2}
                            style={{ marginRight: '1rem' }}
                        >
                            <Grid item xs={3}>
                                <Typography align='left' variant='h3'>
                                    {code}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={2}>
                            {active ? (
                                <LabelBadge variant='status-active'>
                                    Active
                                </LabelBadge>
                            ) : (
                                <LabelBadge variant='status-past'>
                                    Retired
                                </LabelBadge>
                            )}
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                        xs={6}
                    >
                        <Grid item xs={5}></Grid>
                        <Grid item>
                            <ResponsiveButton onClick={handleModalOpen} variant='outlined'>
                                Retire
                            </ResponsiveButton>
                        </Grid>
                        <Modal
                            disableBackdropClick
                            open={modalOpen}
                            onClose={handleModalClose}
                    >
                        <RetireModal discountId={id} closeModal={handleModalClose} />
                    </Modal>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='row'
                justify='flex-start'
                // style={{ border: '1px solid black' }}
                alignItems='flex-start'
                xs={12}
                className={classes.vertMargin}
            >
                <Grid xs={3} item container direction='column' className={classes.marginVertSm}>
                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography
                            align='left'
                            className={classes.label}
                            variant='h5'
                        >
                            Discount Amount
                        </Typography>
                    </Grid>

                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography align='left'>
                            {' '}
                            {amountType === 'PERCENT'
                                ? `${amount}%`
                                : `$${amount}`}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid xs={3} item container direction='column' className={classes.marginVertSm}>
                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography
                            align='left'
                            className={classes.label}
                            variant='h5'
                        >
                            Auto Apply
                        </Typography>
                    </Grid>

                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography align='left'>
                            {autoApply ? 'Yes' : 'No'}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='row'
                justify='flex-start'
                // style={{ border: '1px solid black' }}
                alignItems='flex-start'
                xs={12}
                className={classes.vertMargin}
            >
                <Grid xs={3} item container direction='column' className={classes.marginVertSm}>
                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography
                            align='left'
                            className={classes.label}
                            variant='h5'
                        >
                            Valid Pay Period
                        </Typography>
                    </Grid>

                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography align='left'>
                            {startDate && endDate
                                ? `${startDate} - ${endDate}`
                                : 'N/A'}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid xs={3} item container direction='column'>
                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography
                            align='left'
                            className={classes.label}
                            variant='h5'
                        >
                            minimum
                        </Typography>
                    </Grid>

                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography align='left'>
                            {minCourses ? minCourses : 'N/A'}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                item
                container
                direction='row'
                justify='flex-start'
                // style={{ border: '1px solid black' }}
                alignItems='flex-start'
                xs={12}
                className={classes.vertMargin}
            >
                <Grid xs={3} item container direction='column'>
                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography
                            align='left'
                            className={classes.label}
                            variant='h5'
                        >
                            Payment Method
                        </Typography>
                    </Grid>

                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography align='left'>
                            {paymentMethod
                                ? capitalizeString(paymentMethod)
                                : 'N/A'}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid xs={3} item container direction='column'>
                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography
                            align='left'
                            className={classes.label}
                            variant='h5'
                        >
                            courses(s)
                        </Typography>
                    </Grid>

                    <Grid
                        // style={{ border: '1px solid black' }}
                        className={classes.marginVertSm}
                        item
                    >
                        <Typography align='left'>
                            {allCoursesApply
                                ? 'All'
                                : courses.map((course) => (
                                      <span key={course.id}>
                                          {course.courseCategtory.name}
                                      </span>
                                  ))}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item style={{marginTop: '7rem'}}>
            <Typography variant='h6'>Created on {dateTimeToDate(createdAt)}</Typography>
            </Grid>
        </Grid>
    );
};

DiscountView.propTypes = {
    location: PropTypes.object,
};

export default withRouter(DiscountView);
