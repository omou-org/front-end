import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import './AdminPortal.scss';
import DiscountRow from './DiscountRow';
import NoListAlert from 'components/OmouComponents/NoListAlert';

const discountTypeParser = {
    DateRange: 'Date Range Discount',
    MultiCourse: 'Bulk Order Discount',
    PaymentMethod: 'Payment Method Discount',
};

const DiscountList = ({ discountType, discountList }) => (
    <div className='discount-type-wrapper'>
        <Grid container key={discountType}>
            <Grid item xs={12}>
                <Typography align='left' gutterBottom variant='h6'>
                    {discountTypeParser[discountType]}
                </Typography>
                <Grid className='accounts-table-heading' container>
                    <Grid item xs={3}>
                        <Typography align='left' className='table-header'>
                            Discount Name
                        </Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography align='left' className='table-header'>
                            Description
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align='center' className='table-header'>
                            Active
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid alignItems='center' container spacing={1}>
                    {discountList.length > 0 ? (
                        discountList.map((discount) => (
                            <DiscountRow
                                discount={discount}
                                key={discount}
                                type={discountType}
                            />
                        ))
                    ) : (
                        <NoListAlert list='Discounts' />
                    )}
                </Grid>
            </Grid>
        </Grid>
    </div>
);

DiscountList.propTypes = {
    discountList: PropTypes.arrayOf(
        PropTypes.shape({
            discount: PropTypes.any,
            type: PropTypes.any,
        })
    ).isRequired,
    discountType: PropTypes.oneOf(['DateRange', 'MultiCourse', 'PaymentMethod'])
        .isRequired,
};

export default DiscountList;
