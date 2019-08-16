import { createMuiTheme } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
    palette: {
        // primary: { main: '#FAFAFA' },
        primary: { main: '#43B5D9' },
        secondary: { main: '#a6a6a6' },
        background: { main: '#FAFAFA'},
    },
    typography: {
        useNextVariants: true
    },
    overrides: {
        MuiButton: { // Name of the component ⚛️ / style sheet
            text: { // Name of the rule
                color: 'black;', // Some CSS
            },
        },
        paper:{
            background:'#FAFAFA'
        }
    },

});

export default theme;