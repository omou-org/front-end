import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
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
import CreateSubjectModal from './CreateSubjectModal';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { h4, omouBlue, white, body1, body2 } from '../../../theme/muiTheme';
import { makeStyles } from '@material-ui/core/styles';

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
        // borderLeft: `1px solid ${omouBlue}`,
        // borderRight: `1px solid ${omouBlue}`,
    },
    headCells: {
        ...h4,
        color: omouBlue,
    },
    tagName: {
        ...body2,
    },
});

const ManageCourseTags = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const classes = useStyles();

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
                    <CreateSubjectModal closeModal={handleModalClose} />
                </Modal>

                <Grid item>
                    <TextField
                        // className={classes.searchBar}
                        // size='small'
                        // type='text'
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
                            <TableRow>
                                <TableCell className={classes.tagName}>
                                    Geometry
                                </TableCell>
                                <TableCell>
                                    tag description Lorem ipsum dolor sit amet,
                                    consectetur adipiscing elit, sed do
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
};

export default ManageCourseTags;
