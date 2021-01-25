import { client } from "index";
import gql from "graphql-tag";
import { ADD_SCHOOL, UPDATE_SCHOOL } from '../../../mutations/AccountsMutation/AccountsMutation';

const discountInfo = gql`
    fragment DiscountInfo on DiscountInterface {
        active
        amount
        amountType
        description
        id
        name
    }
`;

const QUERIES_LIST = {
    "courseCategories": gql`
    query GetCatgories {
        courseCategories {
            id
            name
            description
            __typename
        }
    }`,
    "schools": gql`
     query getSchools {
        schools {
          id
          name
          district
          zipcode
        }
      }
    `,
    "bulkDiscounts": gql`
        query GetBulkDiscounts {
            multiCourseDiscounts {
                ...DiscountInfo
                numSessions
            }
        }
        ${discountInfo}`,
    "dateRangeDiscounts": gql`
        query GetDateRangeDiscounts {
            dateRangeDiscounts {
                ...DiscountInfo
                startDate
                endDate
            }
        }
        ${discountInfo}`,
    "paymentMethodDiscounts": gql`
        query GetPaymentMethodDiscounts {
            paymentMethodDiscounts {
                ...DiscountInfo
                paymentMethod
            }
        }
        ${discountInfo}`,
    "tuitionRules": gql`
        query GetPriceRules {
          priceRules {
            id
            courseType
            category {
              id
              name
            }
            academicLevel
          }
        }
      `,
};

const QUERIES_ONE = {
    "courseCategories": gql`
        query GetCategory($id: ID!) {
            courseCategory(categoryId: $id) {
                id
                description
                name
            }
        }`,
    "schools": gql`
        query getSchool($id:ID) {
            school(schoolId: $id) {
              id
              name
              district
              zipcode
            }
          }

        `,
    "bulkDiscounts": gql`
        query GetBulkDiscount($id: ID!) {
            multiCourseDiscount(multiCourseDiscountId: $id) {
                ...DiscountInfo
                numSessions
            }
        }
        ${discountInfo}`,
    "dateRangeDiscounts": gql`
        query GetDateRangeDiscount($id: ID!) {
            dateRangeDiscount(dateRangeDiscountId: $id) {
                ...DiscountInfo
                startDate
                endDate
            }
        }
        ${discountInfo}`,
    "paymentMethodDiscounts": gql`
        query GetPaymentMethodDiscount($id: ID!) {
            paymentMethodDiscount(paymentMethodDiscountId: $id) {
                ...DiscountInfo
                paymentMethod
            }
        }
        ${discountInfo}`,
    "tuitionRules": gql`
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
    }
  `,
};

const MUTATION_ADD = {
    "courseCategories": gql`
    mutation CreateCourseCategory($name: String, $description: String) {
        createCourseCategory(name: $name, description: $description) {
          courseCategory {
            name
            id
            description
          }
        }
    }`,
    "schools": ADD_SCHOOL,
    "bulkDiscounts": gql`
    mutation CreateBulkDiscount($active: Boolean, $description:String, $name:String,
        $amount:Float, $amountType:AmountTypeEnum, $numSessions: Int) {
        createMultiCourseDiscount(active: $active, amountType: $amountType,
            description: $description, name: $name, amount: $amount,
            numSessions: $numSessions) {
            multiCourseDiscount {
                ...DiscountInfo
                numSessions
            }
        }
    }
    ${discountInfo}`,
    "dateRangeDiscounts": gql`
    mutation CreateDateRangeDiscount($active: Boolean, $description:String, $name:String,
        $amount:Float, $amountType:AmountTypeEnum, $startDate:Date, $endDate:Date) {
        createDateRangeDiscount(active: $active, amountType: $amountType,
            description: $description, name: $name, amount: $amount,
            startDate: $startDate, endDate: $endDate) {
            dateRangeDiscount {
                ...DiscountInfo
                startDate
                endDate
            }
        }
    }
    ${discountInfo}`,
    "paymentMethodDiscounts": gql`
    mutation CreatePaymentMethodDiscount($active: Boolean, $description:String, $name:String,
        $amount:Float, $amountType:AmountTypeEnum, $paymentMethod: String) {
        createPaymentMethodDiscount(active: $active, amountType: $amountType,
            description: $description, name: $name, amount: $amount,
            paymentMethod: $paymentMethod) {
            paymentMethodDiscount {
                ...DiscountInfo
                paymentMethod
            }
        }
    }
    ${discountInfo}`,

    "tuitionRules": gql`
    mutation CreatePriceRule(
      $academicLevel: AcademicLevelEnum!
      $courseType: CourseTypeEnum!
      $category: Int!
      $hourlyTuition: Float!
      
    ) {
        createPriceRule(
        academicLevel: $academicLevel
        courseType: $courseType
        category: $category
        hourlyTuition: $hourlyTuition
      ) {
        priceRule {
          name
          academicLevel
          courseType
          hourlyTuition
          id
          category {
            name
            id
          }
        }
      }
    }
  `,
};

const MUTATION_UPDATE = {
    "courseCategories": gql`
        mutation UpdateCategory($id: ID!, $name: String!, $description: String) {
            createCourseCategory(id: $id, name: $name, description: $description) {
                courseCategory {
                    description
                    id
                    name
                }
            }
        }`,
    "bulkDiscounts": gql`
    mutation UpdateBulkDiscount($active: Boolean, $description:String, $name:String,
        $amount:Float, $amountType:AmountTypeEnum, $id: ID!, $numSessions: Int) {
        createMultiCourseDiscount(active: $active, amountType: $amountType,
            description: $description, name: $name, amount: $amount,
            discountId: $id, numSessions: $numSessions) {
            multiCourseDiscount {
                ...DiscountInfo
                numSessions
            }
        }
    }
    ${discountInfo}`,
    "dateRangeDiscounts": gql`
    mutation UpdateDateRangeDiscount($active: Boolean, $description:String, $name:String,
        $amount:Float, $amountType:AmountTypeEnum, $startDate:Date, $endDate:Date, $id: ID!) {
        createDateRangeDiscount(active: $active, amountType: $amountType,
            description: $description, name: $name, amount: $amount,
            startDate: $startDate, endDate: $endDate, discountId: $id) {
            dateRangeDiscount {
                ...DiscountInfo
                startDate
                endDate
            }
        }
    }
    ${discountInfo}`,
    "paymentMethodDiscounts": gql`
    mutation UpdatePaymentMethodDiscount($active: Boolean, $description:String, $name:String,
        $amount:Float, $amountType:AmountTypeEnum, $paymentMethod: String, $id: ID!) {
        createPaymentMethodDiscount(active: $active, amountType: $amountType,
            description: $description, name: $name, amount: $amount,
            paymentMethod: $paymentMethod, discountId: $id) {
            paymentMethodDiscount {
                ...DiscountInfo
                paymentMethod
            }
        }
    }
    ${discountInfo}`,
    "schools": UPDATE_SCHOOL,
    "tuitionRules": gql`
      mutation updatePriceRule(
          $id:ID!
          $academicLevel: AcademicLevelEnum!
          $courseType:CourseTypeEnum!
          $category:Int!
          $hourlyTuition: Float!
   
          ) {
            createPriceRule(
                id: $id
                
              academicLevel: $academicLevel
              courseType: $courseType,
              category: $category
              hourlyTuition: $hourlyTuition
              name: $name){
              priceRule {
                name
                academicLevel
                courseType
                hourlyTuition
                id
                category {
                  name
                  id
                }
              }
            }
          }
      `,
};

const getTypes = gql`
    query GetFieldTypes($type:String!) {
        __type(name: $type) {
            fields {
            name
            type {
                ofType {
                    name
                }
            }
        }
    }
}`;

export default {
    "getList": async (resource, { "pagination": { page, perPage }, "sort": { field, order } }) => {
        try {
            const request = QUERIES_LIST[resource];

            const dataResponse = await client.query({
                "query": request,
            });

            const [records] = Object.values(dataResponse.data);

            if (records.length === 0) {
                return {
                    "data": [],
                    "total": 0,
                };
            }

            const typeResponse = await client.query({
                "query": getTypes,
                "variables": {
                    "type": records[0].__typename,
                },
            });

            const fieldTypes = Object.fromEntries(
                typeResponse.data.__type.fields
                    .map(({ name, type }) => [name, type.ofType?.name]),
            );


            const sortedData = [...records].sort((cat1, cat2) => {
                switch (fieldTypes[field]) {
                    case "ID": return order === "ASC" ?
                        cat2[field] - cat1[field] :
                        cat1[field] - cat2[field];
                    case "String": {
                        const comparison = cat1[field].localeCompare(cat2[field]);
                        return order === "ASC" ? comparison : -comparison;
                    }
                    default:
                        return 0;
                }
            });

            const slicedData = sortedData.slice(perPage * (page - 1), perPage * page);

            return {
                "data": slicedData,
                "total": records.length,
            };
        } catch (error) {
            console.error(error);
            return error;
        }
    },
    "getOne": async (resource, params) => {
        const query = QUERIES_ONE[resource];

        try {
            const { data } = await client.query({
                query,
                "variables": { "id": params.id },
            });
            return {
                "data": Object.values(data)[0],
            };
        } catch (error) {
            return error;
        }
    },
    "create": async (resource, { data }) => {
        const mutation = MUTATION_ADD[resource];

        try {
            const response = await client.mutate({
                mutation,
                "refetchQueries": [{ "query": QUERIES_LIST[resource] }],
                "variables": data,
            });
            return {
                "data": Object.values(Object.values(response.data)[0])[0],
            };
        } catch (error) {
            console.error(error);
            return error;
        }
    },
    "update": async (resource, { id, data }) => {
        const mutation = MUTATION_UPDATE[resource];
        try {
            const response = await client.mutate({
                mutation,
                "variables": {
                    ...data,
                    id,
                },
            });
            return {
                "data": Object.values(Object.values(response.data)[0])[0],
            };
        } catch (error) {
            console.error(error);
            return error;
        }
    },
};