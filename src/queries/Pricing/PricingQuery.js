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