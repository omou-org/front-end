import React from "react";
import {Grid, Typography } from '@material-ui/core';

const DashboardSummary = ({request: {status, dates, times, subject, instructor, student}}) => {

    return (
        <Grid>
            <Grid>
                {/* Status Bar */}
                <Typography>{status}</Typography>
            </Grid>
            {/* Info Section */}
            <Grid>
                {/* Row 1 */}
                <Grid>
                    {/* Date */}
                    <Grid>
                        {dates}
                    </Grid>
                    {/* Times */}
                    <Grid>
                        {times}
                    </Grid>
                </Grid>
                {/* Row 2 */}
                <Grid>
                    {/* Subject */}
                    <Grid>
                        {subject}
                    </Grid>
                    {/* Instructor */}
                    <Grid>
                        {instructor}
                    </Grid>
                    {/* Student */}
                    <Grid>
                        {student}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default DashboardSummary;