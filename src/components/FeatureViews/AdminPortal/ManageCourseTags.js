import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { gql, useQuery } from '@apollo/client';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CreateTagModal from './CreateTagModal';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { h4, omouBlue, white, body1, body2 } from '../../../theme/muiTheme';
import { makeStyles } from '@material-ui/core/styles';
import Loading from 'components/OmouComponents/Loading';

const useStyles = makeStyles({
    verticalMargin: {
        marginTop: '1rem',
    },
    searchBar: {
        ...body1,
        height: '2.5rem',
        width: '16rem',
        background: white,
        border: `2px solid ${omouBlue}`,
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
});

const GET_COURSE_TAGS = gql`
    query MyQuery {
        courseCategories {
            name
            description
            id
        }
    }
`;

const ManageCourseTags = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const classes = useStyles();

    const { loading, error, data } = useQuery(GET_COURSE_TAGS);

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return (
            <Typography>
                There has been an error! Error: {error.message}
            </Typography>
        );
    }

    const { courseCategories } = data;
    const courseTags = courseCategories;

    return (
        <>
            <Grid
                container
                className={classes.verticalMargin}
                direction='row'
                justify='space-between'
                alignItems='center'
            >
                <Grid item>
                    <ResponsiveButton
                        variant='outlined'
                        startIcon={<AddIcon />}
                        onClick={handleModalOpen}
                    >
                        new subject
                    </ResponsiveButton>
                </Grid>

                <Modal
                    disableBackdropClick
                    open={modalOpen}
                    onClose={handleModalClose}
                >
                    <CreateTagModal closeModal={handleModalClose} />
                </Modal>

                <Grid item style={{ marginRight: '3rem' }}>
                    <TextField
                        // className={classes.searchBar}
                        placeholder='Search course subject'
                        // value={}
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
                        // onChange={(e) =>}
                    />
                </Grid>
            </Grid>

            <Grid container>
                <TableContainer className={classes.verticalMargin}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.headCells}>
                                    Subject
                                </TableCell>
                                <TableCell className={classes.headCells}>
                                    Description
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courseTags.map(({ id, name, description }) => {
                                return (
                                    <TableRow key={id}>
                                        <TableCell className={classes.tagName}>
                                            {name}
                                        </TableCell>
                                        <TableCell>
                                            <Grid
                                                container
                                                direction='row'
                                                justify='space-between'
                                                alignItems='center'
                                            >
                                                <Grid item>{description}</Grid>

                                                <Grid item>
                                                    <IconButton aria-label='edit'>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
};

export default ManageCourseTags;
