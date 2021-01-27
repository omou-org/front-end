import React from 'react'
import Grid from '@material-ui/core/Grid';
import { Typography, Box } from '@material-ui/core';
import theme from '../../muiTheme'

const ColorBox = ({bgcolor}) => {
    return (
        <Box
            bgcolor={bgcolor}
            width="98px"
            height="48px"
            label={bgcolor}
            boxShadow={2}
            borderRadius={5}
            mt={2}
            mb={1}
            ml={2}
            mr={2}
        />
    )
}

const ColorsDemo = () => {
    return (
        <div>

        <Grid container justify="space-around">
            <Grid item>
            <Grid container>
                <Typography variant="h3">PRIMARY</Typography>
                <Grid item>
                <Grid container direction="column">
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.darkBlue}
                        />
                        <Typography>Dark Blue</Typography>
                        <Typography>{theme.colors.darkBlue}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.omouBlue}
                        />
                        <Typography>Omou Blue</Typography>
                        <Typography>{theme.colors.omouBlue}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.skyBlue}
                        />
                        <Typography>Sky Blue</Typography>
                        <Typography>{theme.colors.skyBlue}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.white}
                        />
                        <Typography>White</Typography>
                        <Typography>{theme.colors.white}</Typography>
                    </Grid>
                </Grid>
                </Grid>

                <Grid item>
                <Grid container direction="column">
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.goth}
                        />
                        <Typography>Goth</Typography>
                        <Typography>{theme.colors.goth}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.charcoal}
                        />
                        <Typography>Charcoal</Typography>
                        <Typography>{theme.colors.charcoal}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.slateGrey}
                        />
                        <Typography>Slate Grey</Typography>
                        <Typography>{theme.colors.slateGrey}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.gloom}
                        />
                        <Typography>Gloom</Typography>
                        <Typography>{theme.colors.gloom}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.cloudy}
                        />
                        <Typography>Cloudy</Typography>
                        <Typography>{theme.colors.cloudy}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.lightGrey}
                        />
                        <Typography>Light Grey</Typography>
                        <Typography>{theme.colors.lightGrey}</Typography>
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
            </Grid>

            <Grid item>
            <Grid container>
                <Typography variant="h3">SPECIFIC</Typography>
                <Grid item>
                <Grid container direction="column">
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.buttonBlue}
                        />
                        <Typography>Button Blue</Typography>
                        <Typography>{theme.colors.buttonBlue}</Typography>
                    </Grid>
                    <Grid item>
                        <ColorBox
                            bgcolor={theme.colors.backgroundGrey}
                        />
                        <Typography>Background Grey</Typography>
                        <Typography>{theme.colors.backgroundGrey}</Typography>
                    </Grid>
                </Grid>
                </Grid>

                <Grid item>
                    <Grid container direction="column">
                        <Grid item>
                            <ColorBox
                                bgcolor={theme.palette.success.main}
                            />
                            <Typography>Success</Typography>
                            <Typography>{theme.palette.success.main}</Typography>
                        </Grid>
                        <Grid item>
                            <ColorBox
                                bgcolor={theme.palette.warning.main}
                            />
                            <Typography>Warning</Typography>
                            <Typography>{theme.palette.warning.main}</Typography>
                        </Grid>
                        <Grid item>
                            <ColorBox
                                bgcolor={theme.palette.error.main}
                            />
                            <Typography>Error</Typography>
                            <Typography>{theme.palette.error.main}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            </Grid>
        </Grid>
        
        </div>

    )
}

export default ColorsDemo;