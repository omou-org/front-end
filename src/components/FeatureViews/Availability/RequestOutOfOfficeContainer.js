import React from 'react';
import Grid from '@material-ui/core/Grid';
import OutlinedContainer from '../../OmouComponents/OutlinedContainer';
import { skyBlue } from '../../../theme/muiTheme';
import CreateOOOForm from './CreateOOOForm';
import { UpcomingOOO, LogOOO } from './UpcomingLogOOO';

export default function RequestOutOfOfficeContainer() {
    return (
        <Grid container direction="row" style={{ width: 'auto' }} spacing={2}>
            <Grid item xs={8}>
                <OutlinedContainer
                    styles={{ backgroundColor: skyBlue, border: 'none' }}
                >
                    <CreateOOOForm />
                </OutlinedContainer>
            </Grid>
            <Grid item xs={4}>
                <Grid item container direction="column">
                    <Grid item>
                        <OutlinedContainer>
                            <UpcomingOOO />
                        </OutlinedContainer>
                    </Grid>
                    <Grid item style={{ marginTop: '4.0em' }}>
                        <OutlinedContainer>
                            <LogOOO />
                        </OutlinedContainer>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
