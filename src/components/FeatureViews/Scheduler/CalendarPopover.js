import React, { useState, useRef } from "react";
import moment from 'moment';
import { makeStyles } from "@material-ui/core/styles"
import { Popover, Grid, Typography, Paper } from "@material-ui/core"
import { BrowserRouter as Router, Redirect, Route, } from "react-router-dom"

const useStyles = makeStyles(theme => ({
    popover: {
        pointerEvents: 'none',
    },
    popoverContent: {
        pointerEvents: 'auto',
    },
}));

export default function CustomPopover({ children }) {
    const [openedPopover, setOpenedPopover] = useState(false)
    const popoverAnchor = useRef(null);
    const classes = useStyles()
    const [redirect, setRedirect] = useState(false)

    const popoverEnter = () => {
        setOpenedPopover(true);
    };

    const doubleClick = () => {
        setRedirect(true);

    }

    const popoverLeave = () => {
        setOpenedPopover(false)
    }

    const PopoverCard = () => (
        <Paper>
            <Grid>
                <Typography variant="h4">Title: {children.props.children.props.title}</Typography>
                <Typography >{moment(children._owner.memoizedProps.event.start).format('LLLL')}</Typography>
                <Typography>Instructor : {children._owner.memoizedProps.event.instructor}</Typography>
                <Typography> Room : {children._owner.memoizedProps.event.room}</Typography>
                <Typography>Type : {children._owner.memoizedProps.event.type}</Typography>

            </Grid>

        </Paper>
    )

    if (redirect) {
        return (
            <Router>
                <Redirect push to="/sample" />
            </Router>
        )
    }




    return (
        <div>
            <span
                ref={popoverAnchor}
                aria-owns="mouse-over-popover"
                aria-haspopup="true"
                onMouseEnter={popoverEnter}
                onMouseLeave={popoverLeave}
                onClick={doubleClick}
            >
                {children}
            </span>
            <Popover
                id="mouse-over-popover"
                open={openedPopover}
                className={classes.popover}
                classes={{
                    paper: classes.popoverContent,
                }} open={openedPopover}
                anchorEl={popoverAnchor.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{ onMouseEnter: popoverEnter, onMouseLeave: popoverLeave }}
            >


                <PopoverCard />

            </Popover>
        </div>
    );
}


