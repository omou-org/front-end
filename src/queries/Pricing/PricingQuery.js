import gql from 'graphql-tag';

// dataProvider.js
// TutoringPriceQuote.js
export const getPriceRules = gql`
query GetPriceRules {
    priceRules {
        id
        courseType
        category {
            id
            name
        }
        academicLevel
        hourlyTuition
    }
}`;

// dataProvider.js
export const getTutitionRule = gql`
query getTuitionRule($id: ID) {
    priceRule(priceRuleId: $id) {
        academicLevel
        courseType
        hourlyTuition
        id
        category {
            name
            id
        }
    }
}`;

export const discountInfo = gql`
    fragment DiscountInfo on DiscountInterface {
        active
        amount
        amountType
        description
        id
        name
    }
`;

export const BULK_DISCOUNTS = gql`
query GetBulkDiscounts {
    multiCourseDiscounts {
        ...DiscountInfo
        numSessions
    }
}
${discountInfo}`;

export const BULK_DISCOUNT = gql`
query GetBulkDiscount($id: ID!) {
    multiCourseDiscount(multiCourseDiscountId: $id) {
        ...DiscountInfo
        numSessions
    }
}
${discountInfo}`;

export const GET_PRICE_QUOTE = gql`
    query GetPriceQuote(
        $method: String!
        $disabledDiscounts: [ID]
        $priceAdjustment: Float
        $classes: [ClassQuote]
        $tutoring: [TutoringQuote]
        $parent: ID!
    ) {
        priceQuote(
            method: $method
            disabledDiscounts: $disabledDiscounts
            priceAdjustment: $priceAdjustment
            classes: $classes
            tutoring: $tutoring
            parent: $parent
        ) {
            subTotal
            priceAdjustment
            accountBalance
            total
            discounts {
                id
                name
                amount
            }
        }
    }
`;

export const DATE_RANGE_DISCOUNTS = gql`
query GetDateRangeDiscounts {
    dateRangeDiscounts {
        ...DiscountInfo
        startDate
        endDate
    }
}
${discountInfo}`;

export const DATE_RANGE_DISCOUNT = gql`
query GetDateRangeDiscount($id: ID!) {
    dateRangeDiscount(dateRangeDiscountId: $id) {
        ...DiscountInfo
        startDate
        endDate
    }
}
${discountInfo}`;

export const PAYMENT_METHOD_DISCOUNTS = gql`
query GetPaymentMethodDiscounts {
    paymentMethodDiscounts {
        ...DiscountInfo
        paymentMethod
    }
}
${discountInfo}`;