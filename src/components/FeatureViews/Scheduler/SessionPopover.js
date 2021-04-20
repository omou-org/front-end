import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Face, Schedule, Create, Delete } from '@material-ui/icons';
import { fullName } from '../../../utils';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

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
}));

export const SessionPopover = ({
    session: { start, end, title, instructor },
}) => {
    const classes = useStyles();

    const timeText = (time) => moment(time).format('h:mma');
    return (
            <Grid container>
                    <Grid item xs={12} justify='flex-start'>
    <Button>
        <Create onClick={() => console.log('lol')}/>
    </Button>
    <IconButton>
        <Delete />
    </IconButton>
    </Grid>
        <div className={classes.sessionPopover}>
            <Typography variant='h3'>{title}</Typography>
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
