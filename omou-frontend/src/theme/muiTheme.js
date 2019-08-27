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
        },
        MuiTabs: {
          root: {

          },
        },
        MuiTab: {
            root: {
                border:"2px solid #DBD7D7",
            },
            "selected":{
                border:"3px solid #43B5D9",
                backgroundColor:"#EBFAFF",
            },
        },
        MuiStepIcon:{
            text:{
                fill:"white",
            }
        }
    },

});

export default theme;