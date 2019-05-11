import { createMuiTheme } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#FAFAFA' },
        secondary: { main: '#29abd6' },
    },
    typography: { useNextVariants: true },

});

export default theme;