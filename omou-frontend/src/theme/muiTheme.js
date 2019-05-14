import { createMuiTheme } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#FAFAFA' },
        secondary: { main: '#0d9dd6' },
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