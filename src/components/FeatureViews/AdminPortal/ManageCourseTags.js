
import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
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
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CreateTagModal from './CreateTagModal';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { h4, omouBlue, white, body1, body2 } from '../../../theme/muiTheme';
import { makeStyles } from '@material-ui/core/styles';
import Loading from 'components/OmouComponents/Loading';
import DoneIcon from '@material-ui/icons/Done';

import {TablePagination} from '../../OmouComponents/TablePagination';

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
        width: 170,
        height: 40,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        textAlign: 'center',
        padding: '5px'
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


// const CREATE_COURSE_TAG = gql`
//     mutation createCourseTag(
//         $name: String, 
//         $description: String
//         ) {
//             createCourseCategory(
//                 name: $name, 
//                 description: $description
//             ) {
//                 courseCategory {
//                     __typename
//                     name
//                     description
//                     id
//                 }
//             }
//     }
// `;

// const GET_COURSE_TAG = gql`
//     query getCourseTag($categoryId: ID) {
//         courseCategory(categoryId: $categoryId) {
//             id
//             name
//             description
//         }
//     }
// `;




const ManageCourseTags = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [courseTags, setCourseTags] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [previous, setPrevious] = useState({});
    const [page, setPage] = useState(0);
    const classes = useStyles();

    const CustomTableCell = ({ row, name, onChange }) => {
        const classes = useStyles();
        const { isEditMode } = row;
        return (
          <TableCell align="left" >
            {isEditMode ? (
              <TextField
                value={row[name]}
                name={name}
                onChange={e => onChange(e, row)}
                className={classes.input}
                InputProps={{disableUnderline: true}}
              />
            ) : (
              row[name]
            )}
          </TableCell>
        );
      };

    const createCourseTagObject = (courses) => {
     return courses.map(({name, description,id}) => (
             {
                id,
                name,
                description,
                isEditMode : false
            }
     ));
    };
    

    const { loading, error, data } = useQuery(GET_COURSE_TAGS, {
        onCompleted: () => {
            let tags = createCourseTagObject(data.courseCategories);
            setCourseTags(tags);
        },
        fetchPolicy: 'cache-and-network'
  
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

    const onToggleEditMode = id => {
        setCourseTags(() => {
          return courseTags.map(row => {
            if (row.id === id) {
              return { ...row, isEditMode: !row.isEditMode };
            }
            return row;
          });
        });
      };

    const onEditTextFieldChange = (e, row) => {
        if (!previous[row.id]) {
          setPrevious(state => ({ ...state, [row.id]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const { id } = row;
        const newRows = courseTags.map(row => {
          if (row.id === id) {
            return { ...row, [name]: value };
          }
          return row;
        });
        setCourseTags(newRows);
      }; 

      const onRevert = id => {
        const newRows = courseTags.map(row => {
          if (row.id === id) {
            return previous[id] ? previous[id] : row;
          }
          return row;
        });
        setCourseTags(newRows);
        setPrevious(state => {
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
            if(item.name.toLowerCase().indexOf(inputValue) !== -1){
                finalResult.push(item);
            }
        });
        
        if(!inputValue){
            setCourseTags(data.courseCategories);
        }else {
            setCourseTags(finalResult);
        }

    };


    const handlePageChange = (newPage) =>{
        setPage(newPage);
    };
    let totalPages = Math.ceil(courseTags.length / 15);
    
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
                        value={searchValue}
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
                                    style={{minWidth: 170}}
                                >
                                    Topic
                                </TableCell>
                                <TableCell
                                className={classes.headCells}
                                style={{minWidth: 170}}
                                >
                                    Description
                                </TableCell>
                                <TableCell>

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                            
                            courseTags.slice(page * 15, page * 15 + 15 ).map(row => (
            
                                <TableRow key={row.id}>
                                <CustomTableCell {...{ row, name: "name", onChange: onEditTextFieldChange }} />
                                <CustomTableCell {...{ row, name: "description", onChange: onEditTextFieldChange }} />
                                <TableCell className={classes.selectTableCell} style={{width: '40px'}}>
                                    {row.isEditMode ? (
                                    <>
                                    
                                        <IconButton
                                        aria-label="revert"
                                        onClick={() => onRevert(row.id)}
                                        >
                                        <DoneIcon/> 
                                        </IconButton>
                                    </>
                                    ) : (
                                    <IconButton
                                        aria-label="delete"
                            
                                        onClick={() => onToggleEditMode(row.id)}
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

ManageCourseTags.propTypes ={
    row: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func
};


export default ManageCourseTags;
