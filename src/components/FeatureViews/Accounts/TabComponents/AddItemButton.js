import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  addNewItemStyles: ({ height, width }) => ({
    margin: 'auto',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    height: height,
    width: width,
    background: '#F5F5F5',
    border: '1.5px dashed #999999',
    borderRadius: '5px',
    boxSizing: 'border-box',
    boxShadow: '0 0.5rem 0.5rem rgba(0,0,0, 0.2)',
  }),
});

export const AddItemButton = ({ children, ...rest }) => {
  const { addNewItemStyles } = useStyles({ ...rest });
  return (
// When passing in a component prop here, it'll ignore height and width unless a div is placed within the Box here.
    <Box {...rest}>
      <div className={addNewItemStyles}>
        {children}
      </div>
    </Box>
  );
};
