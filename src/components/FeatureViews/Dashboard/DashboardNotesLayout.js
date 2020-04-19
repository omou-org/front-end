import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";

const DashboardNotesLayout = (notes) => {
    
    console.log(notes);
    return(
        <Grid>
            {Object.values(notes.notes).map((note) => (
                <Grid>
                    <Typography variant='h6'>
                        {note.title}
                    </Typography>
                    <Typography variant='body1'>
                        {note.body}
                    </Typography>
                    <Typography variant='body1'>
                    </Typography>
                </Grid>
            ))}
        </Grid>
    )
}

export default DashboardNotesLayout