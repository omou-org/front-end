import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { PropTypes } from 'prop-types';
import { theme } from '../../../theme/muiTheme'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton'
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
    listStyles: ({ height, width }) => ({
        borderTop: '1.5px solid #C4C4C4',
        borderBottom: '1.5px solid #C4C4C4',
        paddingTop: '15px',
        paddingBottom: '15px',
    }),
  });

  export const ListComponent = ({ children }) => {
      const { listStyles } = useStyles({});
      return (
          <div>
            { children.toArray(children) }
          </div>
          
      )
  }

// export const ListComponent = ({ children }) => {
//     const { listStyles } = useStyles({  });
//     return (
//       <Box className = { listStyles }>
//         <Grid container justify="space-between">
//             <Grid item>
//                 <Grid container direction="column">
//                     <Grid item>
//                         <Grid container>
//                             <Grid item>
//                                 <Typography variant="body1" align="left">
//                                     BADGE (sometimes)
//                                 </Typography>
//                             </Grid>
//                             <Grid item>
//                                 <Typography variant="h3" align="left">
//                                     Course Name
//                                 </Typography>
//                             </Grid>
//                         </Grid>
                        
//                     </Grid>
//                     <Grid item>
//                         <Grid container spacing={3}>
//                             <Grid item>
//                                 <Typography variant="body1">
//                                     Instructor Name
//                                 </Typography>
//                             </Grid>
//                             <Divider
//                                 orientation="vertical"
//                                 flexItem
//                                 style={{ height: "1em", marginTop: "1em" }}
//                             />
//                             <Grid item>
//                                 <Typography variant="body1">
//                                     Start Date - End Date
//                                 </Typography>
//                             </Grid>
//                             <Divider
//                                 orientation="vertical"
//                                 flexItem
//                                 style={{ height: "1em", marginTop: "1em" }}
//                             />
//                             <Grid item>
//                                 <Typography variant="body1">
//                                     Start Time - End Time
//                                 </Typography>
//                             </Grid>
//                             <Divider
//                                 orientation="vertical"
//                                 flexItem
//                                 style={{ height: "1em", marginTop: "1em" }}
//                             />
//                             <Grid item>
//                                 <Typography variant="body1">
//                                     Cost
//                                 </Typography>
//                             </Grid>
//                         </Grid>
//                     </Grid>

//                 </Grid>
//             </Grid>
//             <Grid item>
//                 <Grid container direction="column">
//                     <Grid item>
//                         <Typography>
//                             #/# Enrolled
//                         </Typography>
//                     </Grid>
//                     <Grid item>
//                         BUTTON GO HERE (sometimes)
//                     </Grid>
//                 </Grid>
//             </Grid>
//         </Grid>
//       </Box>
//     );
//   };