
import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
// import CheckIcon from '@material-ui/icons/Check';
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
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CreateTagModal from './CreateTagModal';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { h4, omouBlue, white, body1, body2 } from '../../../theme/muiTheme';
import { makeStyles } from '@material-ui/core/styles';
import Loading from 'components/OmouComponents/Loading';
import DoneIcon from '@material-ui/icons/Done';



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
    }
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



    const classes = useStyles();

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
        }
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

    const onChange = (e, row) => {
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

    const filterCourseTag = (e) => {
        let query = e.target.value;
        if(!query){
            setCourseTags(data.courseCategories);
            return;
        }
        query = query.toLowerCase();

        const finalResult = [];

        courseTags.forEach((item) => {
            if(item.name.toLowerCase().indexOf(query) !== -1){
                finalResult.push(item);
            }
        });
        setCourseTags(finalResult);
        if(finalResult.length === 0){
            setCourseTags(data.courseCategories);
        };
    
        setSearchValue(query);
       
  // Returns a method that you can use to create your own reusable fuzzy search.
    //    let filtered =  courseTags.filter((tag) => tag.name.toLowerCase().startsWith(e.target.value))
    //    setCourseTags(filtered);

    };
 
    console.log(courseTags);
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
                        onChange={filterCourseTag}
                    />
                </Grid>
            </Grid>

            <Grid container>
                <TableContainer className={classes.verticalMargin}>
                    <Table size='small'>
                        <TableBody>
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

                            {courseTags.map(row => (
            
            <TableRow key={row.id}>
              <CustomTableCell {...{ row, name: "name", onChange }} />
              <CustomTableCell {...{ row, name: "description", onChange }} />



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


{/*              
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        variant='outlined'
                                        InputProps={{
                                            classes: {
                                                root: classes.editTagName,
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Grid
                                        container
                                        direction='row'
                                        justify='space-between'
                                        alignItems='center'
                                    >
                                        <Grid item>
                                            <TableCell>
                                                <TextField
                                                    variant='outlined'
                                                    InputProps={{
                                                        classes: {
                                                            root:
                                                                classes.editTagDescription,
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                        </Grid>

                                        <Grid item>
                                            <IconButton aria-label='edit'>
                                             
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>  */}

                         {/* {courseTags.map(({ id, name, description }) => {
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
                                                        <EditIcon
                                                            onClick={
                                                                handleEditTagView
                                                            }
                                                        />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                    
                                );
                            })}  */}
                        </TableBody>
                    </Table>
                </TableContainer>
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
