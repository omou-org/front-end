/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { h4, omouBlue, white, body1, body2 } from '../../../theme/muiTheme';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
    Grid,
    TextField,
    TableContainer,
    TableCell,
    TableHead,
    Table,
    TableRow,
    TableBody,
} from '@material-ui/core';
import { Link, useRouteMatch } from 'react-router-dom';
// import CheckIcon from '@material-ui/icons/Check';
import { gql, useQuery } from '@apollo/client';
// import SearchIcon from '@material-ui/icons/Search';
// import Typography from '@material-ui/core/Typography';
// import EditIcon from '@material-ui/icons/Edit';
// import IconButton from '@material-ui/core/IconButton';

// import Modal from '@material-ui/core/Modal';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import PropTypes from 'prop-types';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import TextField from '@material-ui/core/TextField';

// import CreateTagModal from './CreateTagModal';
// import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

import Loading from 'components/OmouComponents/Loading';
import { CategoryOutlined } from '@material-ui/icons';
// import DoneIcon from '@material-ui/icons/Done';
// import { TablePagination } from '../../OmouComponents/TablePagination';
const useStyles = makeStyles({
    verticalMargin: {
        marginTop: '1rem',
    },
    searchBar: {
        ...body1,
        height: '2.5rem',
        width: '16rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
    tableHead: {
        color: omouBlue,
    },
    headCells: {
        ...h4,
        color: omouBlue,
    },
    tagName: {
        ...body2,
    },
    editTagDescription: {
        ...body1,
        height: '2rem',
        width: '34.675rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
    editTagName: {
        ...body1,
        height: '2rem',
        width: '13.2125rem',
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
    },
    input: {
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        textAlign: 'center',
        padding: '5px',
    },
    tableFooter: {
        paddingTop: '1vh',
    },
});

const GET_TUITION_RULES = gql`
    query getTuitionRules {
        priceRules {
            id
            name
            courseType
            category {
                description
            }
        }
    }
`;

const TuitionRule = () => {
    const classes = useStyles();

    const { data, loading, error } = useQuery(GET_TUITION_RULES);

    if (loading) return <Loading />;
    if (error) console.error(error);

    // take data to create clickable row
    let { priceRules } = data;

    return (
        <>
            <Grid
                container
                className={classes.verticalMargin}
                direction='row'
                justify='space-between'
                alignItems='center'
            >
                <Grid item></Grid>

                <Grid item style={{ marginRight: '3rem' }}>
                    <TextField
                        // className={classes.searchBar}
                        placeholder='Search tuition rule'
                        // value={searchValue}
                        variant='outlined'
                        InputProps={{
                            classes: {
                                root: classes.searchBar,
                            },
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        // onChange={searchCourseTopic}
                    />
                </Grid>
            </Grid>

            <Grid container>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Topic</TableCell>
                                <TableCell>Topic Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {priceRules.map(({ category, name, id }) => (
                                <TableRow
                                    key={id}
                                    component={Link}
                                    to={{
                                        pathname: `${id}`,
                                        state: { name },
                                    }}
                                >
                                    <TableCell>{name}</TableCell>
                                    <TableCell>
                                        {category.description}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
};
TuitionRule.propTypes = {
    row: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
};
export default TuitionRule;
