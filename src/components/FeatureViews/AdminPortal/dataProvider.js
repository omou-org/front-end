import { client } from "index";
import gql from "graphql-tag";


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
      }`,
    "tuitionRules" : gql`
    query GetPriceRules {
        priceRules {
          id
          name
          courseType
          category {
            id
            name
          }
          academicLevel
        }
      }`,
};

const QUERIES_ONE = {
    "courseCategories": gql`
        query MyQuery($id: ID!) {
            courseCategory(categoryId: $id) {
                id
                description
                name
            }
        }`,
    "schools": gql`
        query getSchool($id:ID) {
            school( schoolId: $id){
              id
              name
              district
              zipcode
            }
          }`,
};

const ADD_QUERY = {
    "courseCategories": gql`
    mutation CreateCourseCategory($name: String, $description: String) {
        createCourseCategory(name: $name, description: $description) {
          courseCategory {
            name
            id
            description
          }
        }
      } `,
    "schools": gql`
      mutation createSchool($zipcode : String, $name : String, $district:String ) {
          createSchool(zipcode: $zipcode, name: $name, district:$district) {
            school {
              id
              name
              zipcode
              district
            }
          }
        }`,
    "tuitionRules": gql`
        mutation CreatePriceRule($academicLevel:AcademicLevelEnum!, $courseType:CourseTypeEnum!,
                                    $category:Int!, $hourlyTuition:Float!, $name:String!){
            createPricerule(name: $name, academicLevel:$academicLevel, courseType: $courseType, category:$category, hourlyTuition: $hourlyTuition){
            priceRule {
                name
                academicLevel
                courseType
                hourlyTuition
                category{
                    id
                }
            }
        }
    
    }`,

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



// This is another comment

export default {
    "getList": async (resource, { "pagination": { page, perPage }, "sort": { field, order } }) => {
        console.log(resource);
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
            console.log(typeResponse);
            const fieldTypes = Object.fromEntries(
                typeResponse.data.__type.fields
                    .map(({ name, type }) => [name, type.ofType.name]),
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
            console.log(slicedData);
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
                "variables": { "id": params.id }
            });

            return {
                data: Object.values(data)[0],
            };
        } catch (error) {
            return error;
        }
    },
    "create": async (resource, { data }) => {
        const mutation = ADD_QUERY[resource];

        try {
            const response = await client.mutate({
                mutation,
                refetchQueries: [{ query: QUERIES_LIST[resource] }],
                "variables": {
                    ...data,

                }
            });
            return {
                "data": Object.values(Object.values(response.data)[0])[0],
            };
        } catch (error) {
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
                data: Object.values(Object.values(response.data)[0])[0],
            };
        } catch (error) {
            console.log(error)
            return error;
        }
    },
};


