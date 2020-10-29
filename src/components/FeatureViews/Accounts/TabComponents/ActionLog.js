import React from "react";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Loading from "../../../OmouComponents/Loading";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import Box from "@material-ui/core/Box"
import { Redirect } from "react-router-dom";



const GET_ADMIN_LOG =gql`
query AdminLogQuery($ownerID: ID!) {
  logs(userId: $ownerID) {
    results {
      action
      date
      objectType
      objectRepr
    }
  }
}
`


const ActionLog = ({ ownerID }) => {
    
    const { data,loading, error } = useQuery(GET_ADMIN_LOG, {
		variables: { ownerID: ownerID },
    })
    
    if (loading ) return null
	if (error ) return <Redirect to="/PageNotFound" />;

    const {logs} = data;

    const ActionBoxStyle = (actionType) => {
        const actionTypeBackgrounds = {
            "Add": "#6CE086",
            "Edit": "#FFDD59",
            "Delete": "#FF6766",

        }

        return (
            <Box
                style={{
                    backgroundColor: actionTypeBackgrounds[actionType],
                    textAlign: "center"
                }}
            >
                {actionType}
            </Box>
        )
    }

    return (
        <>
            <Typography align="left" variant="h6">
                Action Log
					</Typography>
            <Paper elevation={2} className="paper">
                <Table className="ActionTable">
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Object</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {logs.results.map(({ date, action, objectRepr, objectType }) => (
                            <TableRow >

                                <TableCell>{moment(date).format("LLLL")}</TableCell>
                                <TableCell >{ActionBoxStyle(action)}</TableCell>
                                <TableCell>{objectType}</TableCell>
                                <TableCell>{objectRepr}</TableCell>
                            </TableRow>
                        )
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </>
    )
};

ActionLog.propTypes = {

};

export default ActionLog;
