import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CreatableSelect from 'react-select/creatable';

const useStyles = makeStyles(() => ({
    Text: {
        marginTop: '65px',
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: 'center',
        marginTop: '45px',
        marginBottom: '40px',
    },
}));
const options = [
    { value: 'math', label: 'Math' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'english', label: 'English' },
];

const CategorySelect = () => {
    const classes = useStyles();
    const handleChange = () => {};
    return (
        <>
            <Box className={classes.Text}>
                <Typography variant='h3'>Course Categories</Typography>
                <Box fontSize='h5.fontSize' className={classes.Subtitle}>
                    <Typography variant='p'>
                        Please list out the course categories your business
                        offers, these should include all the categories you
                        filled in on the templates in Step 2:
                    </Typography>
                </Box>
            </Box>
            <Grid container layout='row' alignItems='center' justify='center'>
                <Grid item md={6}>
                    <CreatableSelect
                        isMulti
                        options={options}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default CategorySelect;
