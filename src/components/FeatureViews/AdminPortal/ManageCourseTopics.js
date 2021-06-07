import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { gql, useQuery, useMutation } from '@apollo/client';
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
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CreateTopicModal from './CreateTopicModal';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import {
    h4,
    omouBlue,
    white,
    body1,
    body2,
    gloom,
} from '../../../theme/muiTheme';
import { makeStyles } from '@material-ui/core/styles';
import Loading from 'components/OmouComponents/Loading';
import DoneIcon from '@material-ui/icons/Done';
import { TablePagination } from '../../OmouComponents/TablePagination';
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
    topicName: {
        ...body2,
    },
    editInput: {
        ...body1,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        alignItems: 'center',
        paddingLeft: '1rem',
        height: '2rem',
    },
    tableFooter: {
        paddingTop: '1vh',
    },
});
const GET_COURSE_TAGS = gql`
    query getCourseTags {
        courseCategories {
            name
            description
            id
        }
    }
`;
const UPDATE_COURSE_TOPIC = gql`
    mutation createCourseTag($id: ID, $name: String, $description: String) {
        createCourseCategory(id: $id, name: $name, description: $description) {
            courseCategory {
                __typename
                name
                description
                id
            }
        }
    }
`;

const CustomTableCell = ({ row, name, onChange }) => {
    const classes = useStyles();
    const { isEditMode } = row;

    return (
        <TableCell
            align='left'
            style={{
                width: name === 'name' ? '14.2rem' : '35.2rem',
                marginRight: '2.5rem',
            }}
            className={name === 'name' && !isEditMode && classes.topicName}
        >
            {isEditMode ? (
                <TextField
                    value={row[name]}
                    name={name}
                    fullWidth
                    onChange={(e) => onChange(e, row)}
                    style={{ ...body1 }}
                    className={classes.editInput}
                    InputProps={{ disableUnderline: true }}
                />
            ) : (
                row[name]
            )}
        </TableCell>
    );
};
const ManageCourseTopic = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [courseTags, setCourseTags] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [previous, setPrevious] = useState({});
    const [page, setPage] = useState(0);
    const classes = useStyles();

    const createCourseTagObject = (courses) => {
        return courses.map(({ name, description, id }) => ({
            id,
            name,
            description,
            isEditMode: false,
        }));
    };

    const [submitUpdatedCourseTopic] = useMutation(UPDATE_COURSE_TOPIC);

    const { loading, error, data } = useQuery(GET_COURSE_TAGS, {
        onCompleted: () => {
            let tags = createCourseTagObject(data.courseCategories);
            setCourseTags(tags.reverse());
        },
        fetchPolicy: 'cache-and-network',
    });

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

    const onToggleEditMode = (id) => {
        setCourseTags(() => {
            return courseTags.map((row) => {
                if (row.id === id) {
                    return { ...row, isEditMode: !row.isEditMode };
                }
                return row;
            });
        });
    };
    const onEditTextFieldChange = (e, row) => {
        if (!previous[row.id]) {
            setPrevious((state) => ({ ...state, [row.id]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const { id } = row;
        const newRows = courseTags.map((row) => {
            if (row.id === id) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setCourseTags(newRows);
    };
    const onSubmitEdit = (id) => {
        const newRows = courseTags.map((row) => {
            if (row.id === id) {
                submitUpdatedCourseTopic({
                    variables: {
                        id: row.id,
                        name: row.name,
                        description: row.description,
                    },
                });
                return previous[id] ? previous[id] : row;
            }
            return row;
        });
        setCourseTags(newRows);

        setPrevious((state) => {
            delete state[id];
            return state;
        });
        onToggleEditMode(id);
    };
    // create a function that filters the courseTags by name
    const searchCourseTopic = (e) => {
        setSearchValue(e.target.value);
        let inputValue = e.target.value;

        inputValue = inputValue.toLowerCase();

        const finalResult = [];
        courseTags.forEach((item) => {
            if (item.name.toLowerCase().indexOf(inputValue) !== -1) {
                finalResult.push(item);
            }
        });

        if (!inputValue) {
            setCourseTags(data.courseCategories);
        } else {
            setCourseTags(finalResult);
        }
    };
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    let amountOfRows = 15;
    let totalPages = Math.ceil(courseTags.length / amountOfRows);

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
                        new topic
                    </ResponsiveButton>
                </Grid>
                <Modal
                    disableBackdropClick
                    open={modalOpen}
                    onClose={handleModalClose}
                >
                    <CreateTopicModal closeModal={handleModalClose} />
                </Modal>
                <Grid item style={{ marginRight: '3rem' }}>
                    <TextField
                        placeholder='Search topic'
                        value={searchValue}
                        variant='outlined'
                        InputProps={{
                            classes: {
                                root: classes.searchBar,
                            },
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <SearchIcon style={{ color: gloom }} />
                                </InputAdornment>
                            ),
                        }}
                        onChange={searchCourseTopic}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <TableContainer className={classes.verticalMargin}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classes.headCells}
                                    style={{ minWidth: 170 }}
                                >
                                    Topic
                                </TableCell>
                                <TableCell
                                    className={classes.headCells}
                                    style={{ minWidth: 170 }}
                                >
                                    Description
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courseTags
                                .slice(
                                    page * amountOfRows,
                                    page * amountOfRows + amountOfRows
                                )
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        <CustomTableCell
                                            {...{
                                                row,
                                                name: 'name',
                                                onChange: onEditTextFieldChange,
                                            }}
                                        />

                                        <CustomTableCell
                                            {...{
                                                row,
                                                name: 'description',
                                                onChange: onEditTextFieldChange,
                                            }}
                                        />
                                        <TableCell
                                            className={classes.selectTableCell}
                                            style={{ width: '40px' }}
                                        >
                                            {row.isEditMode ? (
                                                <>
                                                    <IconButton
                                                        aria-label='revert'
                                                        onClick={() =>
                                                            onSubmitEdit(row.id)
                                                        }
                                                    >
                                                        <DoneIcon />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <IconButton
                                                    aria-label='delete'
                                                    onClick={() =>
                                                        onToggleEditMode(row.id)
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    className={classes.tableFooter}
                >
                    <TablePagination
                        page={page}
                        colSpan={3}
                        totalPages={totalPages}
                        onChangePage={handlePageChange}
                        isGraphqlPage={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
CustomTableCell.propTypes = {
    row: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
};
export default ManageCourseTopic;
