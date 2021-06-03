import React from 'react';
import {Grid, Typography, MenuItem, IconButton} from '@material-ui/core';
import {NavLink} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import OmouSelect  from '../../../components/OmouComponents/OmouSelect';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import PropTypes from 'prop-types';
import {
    white,
    omouBlue,
    darkGrey,
    highlightColor,
    h6,
    goth,
    gloom,
} from '../../../theme/muiTheme';

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
    errorLink: {
        ...h6,
        color: omouBlue,
        lineHeight: '22px',
        textDecoration: 'underline',
    },
    menuSelect: {
        '&:hover': { backgroundColor: white, color: goth },
    },
    menuSelected: {
        backgroundColor: `${highlightColor} !important`,
    },
    selectDisplay: {
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        width: '13.375em',
        padding: '0.5em 3em 0.5em 1em',
    },
    verticalMargin: {
        marginTop: '1rem',
    },

});


const SelectTemplateStep = ({
    closeModal,
    handleDownloadTemplate,
    handleStepChange,
    handleSelectChange,
    selectedItem
}) => {
    const classes = useStyles();
   
  

    return (
        <Grid container className={classes.modalStyle}>
                        <Grid item style={{ padding: '2em' }} xs={12}>
                            <Typography
                                className={classes.modalTypography}
                                variant='h3'
                            >
                                Bulk Upload
                            </Typography>

                            <Typography
                                align='left'
                                className={classes.modalTypography}
                                variant='h6'
                            >
                                Please select and download the template for the
                                data you want to upload, fill out the template
                                and upload it back Omou.
                            </Typography>
                            <NavLink
                                to='/business-use-cases'
                                className={`${classes.modalTypography} ${classes.useCaseLink}`}
                            >
                                Why am I entering this data?
                            </NavLink>
                            <div style={{ margin: '1em 0px' }}>
                                <OmouSelect 
                                selectedItem={selectedItem} 
                                handleSelectChange={handleSelectChange}
                                >
                                    <MenuItem
                                        style={{ display: 'none' }}
                                        value=''
                                        ListItemClasses={{
                                            selected: classes.menuSelected,
                                        }}
                                        className={classes.menuSelect}
                                        disabled
                                    >
                                        Select Template
                                    </MenuItem>
                                    <MenuItem
                                        value='Accounts'
                                        ListItemClasses={{
                                            selected: classes.menuSelected,
                                        }}
                                        className={classes.menuSelect}
                                    >
                                        Accounts
                                    </MenuItem>
                                    <MenuItem
                                        value='Courses'
                                        ListItemClasses={{
                                            selected: classes.menuSelected,
                                        }}
                                        className={classes.menuSelect}
                                    >
                                        Courses
                                    </MenuItem>
                                    <MenuItem
                                        value='Enrollments'
                                        ListItemClasses={{
                                            selected: classes.menuSelected,
                                        }}
                                        className={classes.menuSelect}
                                    >
                                        Course Enrollments
                                    </MenuItem>
                                </OmouSelect>
                                <IconButton
                                    disabled={!selectedItem && true}
                                    onClick={handleDownloadTemplate}
                                >
                                    <SvgIcon>
                                        <path
                                            d='M17.5 13.75V17.5H2.5V13.75H0V17.5C0 18.875 1.125 20 2.5 20H17.5C18.875 20 20 18.875 20 17.5V13.75H17.5ZM16.25 8.75L14.4875 6.9875L11.25 10.2125V0H8.75V10.2125L5.5125 6.9875L3.75 8.75L10 15L16.25 8.75Z'
                                            fill={selectedItem ? omouBlue : gloom}
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
                                    style={{
                                        border: 'none',
                                        background: white,
                                    }}
                                    disabled={!selectedItem && true}
                                    variant={
                                        selectedItem ? 'outlined' : 'contained'
                                    }
                                    template={selectedItem}
                                    onClick={handleStepChange}
                                >
                                    continue to upload
                                </ResponsiveButton>
                            </Grid>
                        </Grid>
                    </Grid>
    );
};

export default SelectTemplateStep;

SelectTemplateStep.propTypes = {
    closeModal : PropTypes.func,
    handleDownloadTemplate: PropTypes.func,
    handleStepChange : PropTypes.func,
    handleSelectChange : PropTypes.func,
    selectedItem: PropTypes.string
};