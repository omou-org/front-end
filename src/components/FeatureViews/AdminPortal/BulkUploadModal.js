import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { white, omouBlue, darkGrey, h6 } from '../../../theme/muiTheme';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import SvgIcon from '@material-ui/core/SvgIcon';

const BulkUploadModal = ({ closeModal }) => {
    const [template, setTemplate] = useState('');

    const handleTemplateChange = (e) => {
        setTemplate(e.target.value);
    };

    const useStyles = makeStyles({
        modalStyle: {
            top: '50%',
            left: `50%`,
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            width: '31.8em',
            height: '21em',
            background: white,
            boxShadow: '0px 0px 8px rgba(153, 153, 153, 0.8);',
            borderRadius: '5px',
        },
        modalTypography: {
            marginBottom: '1em',
        },
        useCaseLink: {
            ...h6,
            lineHeight: '22px',
            textDecoration: 'underline',
        },
    });

    const classes = useStyles();
    return (
        <Grid container className={classes.modalStyle}>
            <Grid item style={{ padding: '2em' }} xs={12}>
                <Typography className={classes.modalTypography} variant='h3'>
                    {' '}
                    Bulk Upload
                </Typography>

                <Typography
                    align='left'
                    className={classes.modalTypography}
                    variant='h6'
                >
                    Please select and download the template for the data you
                    want to upload, fill out the template and upload it back
                    Omou.
                </Typography>

                <Link
                    className={`${classes.modalTypography} ${classes.useCaseLink}`}
                >
                    Why am I entering this data?
                </Link>

                <div style={{ margin: '1em 0px' }}>
                    <Select
                        value={template}
                        displayEmpty
                        onChange={handleTemplateChange}
                    >
                        <MenuItem value=''>Select Template</MenuItem>
                        <MenuItem value='Accounts'>Accounts</MenuItem>
                        <MenuItem value='Courses'>Courses</MenuItem>
                        <MenuItem value='Course Enrollments'>
                            Course Enrollments
                        </MenuItem>
                    </Select>
                    <IconButton>
                        <SvgIcon>
                            <path
                                d='M17.5 13.75V17.5H2.5V13.75H0V17.5C0 18.875 1.125 20 2.5 20H17.5C18.875 20 20 18.875 20 17.5V13.75H17.5ZM16.25 8.75L14.4875 6.9875L11.25 10.2125V0H8.75V10.2125L5.5125 6.9875L3.75 8.75L10 15L16.25 8.75Z'
                                fill={omouBlue}
                            />
                        </SvgIcon>
                    </IconButton>
                </div>

                <Grid style={{ textAlign: 'right' }} item xs={12}>
                    <ResponsiveButton
                        style={{ border: 'none', color: darkGrey }}
                        variant='outlined'
                        onClick={closeModal}
                    >
                        cancel
                    </ResponsiveButton>
                    <ResponsiveButton
                        style={{ border: 'none' }}
                        variant='outlined'
                        template={template}
                    >
                        continue to upload
                    </ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default BulkUploadModal;