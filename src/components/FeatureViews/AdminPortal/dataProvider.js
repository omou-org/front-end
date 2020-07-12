import {client} from "index";
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
    "getList": async (resource, {"pagination": {page, perPage}, "sort": {field, order}}) => {
        try {
            const request = QUERIES_LIST[resource];

            const dataResponse = await client.query({
                "query": request,
            });

            const [records] = Object.values(dataResponse.data);

            const typeResponse = await client.query({
                "query": getTypes,
                "variables": {
                    "type": records[0].__typename,
                },
            });

            const fieldTypes = Object.fromEntries(
                typeResponse.data.__type.fields
                    .map(({name, type}) => [name, type.ofType.name]),
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
    "getOne": async (resource, {id}) => {
        const query = QUERIES_ONE[resource];
        try {
            const {data} = await client.query({
                query,
                "variables": {id},
            });

            return {
                "data": Object.values(data)[0],
            };
        } catch (error) {
            return error;
        }
    },
};
