import React from 'react'
import Grid from '@material-ui/core/Grid';
import { ThemeButton } from './ThemeButton';
import { Typography } from '@material-ui/core';
import BackgroundPaper from '../../../components/OmouComponents/BackgroundPaper';



const ButtonDemo = () => {
    return (
        <BackgroundPaper>
        <Grid container>
            <Grid 
            container 
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3} 
            item 
            xs={6}>
                <Grid item xs={3}>
                    <ThemeButton variant='outlined' label='save' />
                </Grid>
                <Grid item xs={3}>
                    <ThemeButton variant='outlined' label='delete' />
                </Grid>
                <Grid item xs={3}>
                    <ThemeButton variant='outlined' label='pay' />
                </Grid>
                <Grid item xs={3}>
                    <ThemeButton variant='outlined' label='ok' />
                </Grid>

                <Grid item xs={4}>
                    <ThemeButton variant='outlined' label='reschedule' />
                </Grid>
                <Grid item xs={4}>
                    <ThemeButton variant='outlined' label='unregister' />
                </Grid>
                <Grid item xs={4}>
                    <ThemeButton variant='outlined' label='unenroll' />
                </Grid>

                <Grid item xs={4}>
                    <ThemeButton variant='outlined' label='set password' />
                </Grid>
                <Grid item xs={4}>
                    <ThemeButton variant='outlined' label='reset password' />
                </Grid>
                <Grid item xs={4}>
                    <ThemeButton variant='outlined' label='learn more' />
                </Grid>

                <Grid item xs={6}>
                    <ThemeButton variant='outlined' label='back' hasIcon/>
                </Grid>
                <Grid item xs={6}>
                    <ThemeButton variant='outlined' label='register' hasIcon/>
                </Grid>
            </Grid>

            <Grid 
            container 
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3} 
            item 
            xs={6}>
                <Grid item xs={3}>
                    <ThemeButton variant='contained' label='save' />
                </Grid>
                <Grid item xs={3}>
                    <ThemeButton variant='contained' label='delete' />
                </Grid>
                <Grid item xs={3}>
                    <ThemeButton variant='contained' label='pay' />
                </Grid>
                <Grid item xs={3}>
                    <ThemeButton variant='contained' label='ok' />
                </Grid>

                <Grid item xs={4}>
                    <ThemeButton variant='contained' label='reschedule' />
                </Grid>
                <Grid item xs={4}>
                    <ThemeButton variant='contained' label='unregister' />
                </Grid>
                <Grid item xs={4}>
                    <ThemeButton variant='contained' label='unenroll' />
                </Grid>

                <Grid item xs={4}>
                    <ThemeButton variant='contained' label='set password' />
                </Grid>
                <Grid item xs={4}>
                    <ThemeButton variant='contained' label='reset password' />
                </Grid>
                <Grid item xs={4}>
                    <ThemeButton variant='contained' label='learn more' />
                </Grid>

                <Grid item xs={6}>
                    <ThemeButton variant='contained' label='back' hasIcon/>
                </Grid>
                <Grid item xs={6}>
                    <ThemeButton variant='contained' label='register' hasIcon/>
                </Grid>
            </Grid>

        </Grid>
        </BackgroundPaper>
    )
}

export default ButtonDemo;