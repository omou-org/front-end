import { createMuiTheme } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
    palette: {
        // primary: { main: '#FAFAFA' },
        primary: { main: '#0d9dd6' },
        secondary: { main: '#a6a6a6' },
    },
    typography: {
        useNextVariants: true
    },
    overrides: {
        MuiButton: { // Name of the component ⚛️ / style sheet
            text: { // Name of the rule
                color: 'white;', // Some CSS
            },
        },
    },

});

export default theme;