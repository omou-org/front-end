import * as types from "./actionTypes";
import {client} from "index";
import gql from "graphql-tag";

const GET_EMAIL = gql`
    mutation GetDetails($token: String!) {
        verifyToken(token: $token) {
            payload
        }
    }`;

const GET_ACCOUNT_TYPE = gql`
    query GetAccountType($username: String!) {
        userInfo(userName: $username) {
            ... on AdminType {
                accountType
                user {
                    id
                    firstName
                    lastName
                }
            }
            ... on InstructorType {
                accountType
                user {
                    id
                    firstName
                    lastName
                }
            }
            ... on ParentType {
                accountType
                user {
                    id
                    firstName
                    lastName
                }
            }
        }
    }`;

export const setToken = async (token, shouldSave) => {
    try {
        const {"data": {verifyToken}} = await client.mutate({
            "context": {
                "headers": {
                    "Authorization": `JWT ${token}`,
                },
            },
            "mutation": GET_EMAIL,
            "variables": {token},
        });

        const email = verifyToken.payload.username;

        const {"data": {userInfo}} = await client.query({
            "context": {
                "headers": {
                    "Authorization": `JWT ${token}`,
                },
            },
            "query": GET_ACCOUNT_TYPE,
            "variables": {"username": email},
        });
		const {accountType, user} = userInfo;

        if (shouldSave) {
            localStorage.setItem("token", token);
        }
        return {
            "payload": {
                accountType,
                email,
                token,
				user,
            },
            "type": types.SET_CREDENTIALS,
        };
    } catch (error) {
        // invalid token, do nothing
        console.error(error);
        return {
            "type": null,
        };
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    client.clearStore();
    return {
        "type": types.LOGOUT,
    };
};
