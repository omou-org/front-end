import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Face, Schedule, CreateOutlined } from '@material-ui/icons';
import { fullName } from '../../../utils';
import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { skyBlue, darkBlue, highlightColor } from '../../../theme/muiTheme';

const useStyles = makeStyles((theme) => ({
    sessionPopover: {
        padding: theme.spacing(3),
        height: '100%',
        cursor: 'pointer',
    },
    popover: {
        pointerEvents: 'none',
    },
    sessionInfo: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: theme.spacing(1),
    },
    edit_session_button: {
        height: 'auto',
        minWidth: '.5em',
        backgroundColor: skyBlue,
        color: darkBlue,
        borderRadius: '100%',
        float: 'right',
        '&:hover': { backgroundColor: skyBlue },
    },
    menu: {
        border: '1px solid #43B5D9',
        borderRadius: '5px',
    },
    menuSelected: {
        '&:hover': { backgroundColor: highlightColor },
        '&:focus': highlightColor,
    },
}));

export const SessionPopover = ({
    session: { start, end, title, instructor, id },
}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.target);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleClick = () => {
        history.push(`/scheduler/session/${id}/singlesession`);
    };

    const timeText = (time) => moment(time).format('h:mma');
    return (
            <Grid container>
        <div className={classes.sessionPopover}>
                    <Grid item xs={12}>
            <Typography display='inline' variant='h3'>{title}</Typography>
            <Button disableFocusRipple onClick={handlePopoverOpen} className={classes.edit_session_button}>
        <CreateOutlined />
    </Button>
                <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        classes={{ list: classes.menu }}
        open={Boolean(anchorEl)}
        onClose={handlePopoverClose}
      >
        <MenuItem ListItemClasses={{ button: classes.menuSelected }} onClick={handleClick}>Edit This Session</MenuItem>
        <MenuItem ListItemClasses={{ button: classes.menuSelected }} onClick={handlePopoverClose}>Edit All Sessions</MenuItem>
      </Menu>
    {/* </Grid>
    <Grid item xs={5}> */}
    </Grid>
            <div className={classes.sessionInfo}>
                <Schedule style={{ marginRight: '8px' }} />
                <Typography variant='body1'>
                    {`${timeText(start)} - ${timeText(end)}`}
                </Typography>
            </div>
            <div className={classes.sessionInfo}>
                <Face style={{ marginRight: '8px' }} />
                <Typography variant='body1'>{fullName(instructor)}</Typography>
            </div>
        </div>
            </Grid>
    );
};
