import gql from 'graphql-tag';

/**
 * @description used in Search.js
 */
export const ACCOUNT_SEARCH = gql`
        query AccountSearch($query: String!) {
            accountSearch(query: $query, page: 1) {
                results {
                    ... on StudentType {
                        user {
                            lastName
                            firstName
                            id
                        }
                    }
                    ... on ParentType {
                        user {
                            lastName
                            firstName
                            id
                        }
                    }
                    ... on InstructorType {
                        user {
                            lastName
                            firstName
                            id
                        }
                    }
                    ... on AdminType {
                        user {
                            lastName
                            firstName
                            id
                        }
                    }
                }
            }
        }
    `,
    COURSE_SEARCH = gql`
        query CourseSearch($query: String!) {
            courseSearch(query: $query, page: 1) {
                results {
                    id
                    title
                }
            }
        }
    `;

/**
 * @description used in SearchResults.js
 */

export const ACCOUNT_SEARCH_RESULTS = gql`
        query AccountSearch(
            $grade: Int
            $page: Int
            $pageSize: Int
            $profile: String
            $query: String!
            $sort: String
        ) {
            accountSearch(
                query: $query
                page: $page
                pageSize: $pageSize
                grade: $grade
                profile: $profile
                sort: $sort
            ) {
                results {
                    ... on StudentType {
                        user {
                            id
                        }
                        accountType
                    }
                    ... on ParentType {
                        user {
                            id
                        }
                        accountType
                    }
                    ... on InstructorType {
                        user {
                            id
                        }
                        accountType
                    }
                    ... on AdminType {
                        user {
                            id
                        }
                        accountType
                    }
                }
                total
            }
        }
    `,
    COURSE_SEARCH_RESULTS = gql`
        query CourseSearch(
            $query: String!
            $availability: String
            $size: Int
            $type: String
            $page: Int
            $pageSize: Int
            $sort: String
        ) {
            courseSearch(
                query: $query
                availability: $availability
                courseSize: $size
                courseType: $type
                page: $page
                pageSize: $pageSize
                sort: $sort
            ) {
                total
                results {
                    id
                }
            }
        }
    `;
