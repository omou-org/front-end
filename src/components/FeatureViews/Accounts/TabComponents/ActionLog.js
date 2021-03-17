import React from 'react';

import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import moment from 'moment';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import {Redirect} from 'react-router-dom';

const GET_ADMIN_LOG = gql`
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
`;

const useStyles = makeStyles({
    root: {
        widht: '100%',
    },
    container: {
        maxHeight: 600,
    },
    tableRow: {
        backgroundColor: 'white',
    },
});

const ActionLog = ({ ownerID }) => {
    const classes = useStyles();

    const { data, loading, error } = useQuery(GET_ADMIN_LOG, {
        variables: { ownerID: ownerID },
    });

    if (loading) return null;
    if (error) return <Redirect to='/PageNotFound' />;

    const { logs } = data;

    const ActionLabel = (actionType) => {
        const actionTypeBackgrounds = {
            Add: '#6CE086',
            Edit: '#FFDD59',
            Delete: '#FF6766',
        };

        return (
            <Box
                style={{
                    backgroundColor: actionTypeBackgrounds[actionType],
                    textAlign: 'center',

                    borderRadius: '2px',
                }}
            >
                {actionType}
            </Box>
        );
    };

    return (
        <>
            <TableContainer className={classes.container}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableRow}>
                                Timestamp
                            </TableCell>
                            <TableCell
                                className={classes.tableRow}
                                style={{
                                    textAlign: 'center',
                                    width: '10%',
                                }}
                            >
                                Action
                            </TableCell>
                            <TableCell
                                className={classes.tableRow}
                                style={{ paddingLeft: '5em', width: '20%' }}
                            >
                                Object
                            </TableCell>
                            <TableCell className={classes.tableRow}>
                                Details
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {logs.results.map(
                            ({ date, action, objectRepr, objectType }) => (
                                <TableRow>
                                    <TableCell style={{ width: '30%' }}>
                                        {moment(date).format('LLLL')}
                                    </TableCell>
                                    <TableCell>{ActionLabel(action)}</TableCell>
                                    <TableCell
                                        style={{
                                            paddingLeft: '6em',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {objectType}
                                    </TableCell>
                                    <TableCell>{objectRepr}</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

ActionLog.propTypes = {};

export default ActionLog;
