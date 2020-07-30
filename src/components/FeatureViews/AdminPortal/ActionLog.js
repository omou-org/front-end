import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Moment from "react-moment";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const GET_ADMINS = gql`
    query GetAdmins {
        __typename
            admins {
                user {
                id
                firstName
                email
                lastName
            }
        }
    }
  
`

const ActionLog = () => {
    const { data, loading } = useQuery(GET_ADMINS);
    console.log(data);
    return (<Table>
        <TableHead>
            <TableRow>
                <TableCell>
                    Timestamp
                </TableCell>
                <TableCell>
                    User
                </TableCell>
                <TableCell>
                    Admin Type
                </TableCell>
                <TableCell>
                    Action
                </TableCell>
                <TableCell>
                    Object
                </TableCell>
                <TableCell>
                    Details
                </TableCell>
            </TableRow>
        </TableHead>
    </Table>)
}
ActionLog.propTypes = {}

export default ActionLog;