import {createMuiTheme} from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
    palette: {
        // primary: { main: '#FAFAFA' },
        primary: { main: '#43B5D9' },
        secondary: { main: '#a6a6a6' },
        background: {
            main: '#ffffff',
            default: "#ffffff"
        },
    },
    typography: {

    },
    overrides: {
        MuiCssBaseline:{
            '@global':{
                body:{
                    backgroundColor:"#ffffff"
                }
            }
        },
        MuiButton: { // Name of the component ⚛️ / style sheet
            text: { // Name of the rule
                color: 'black;', // Some CSS
            },
        },
        MuiBadge: {
          colorPrimary:{
              color: 'white',
              marginRight: '6px',
              marginTop: '4px'
          }
        },
        paper:{
            background:'#FAFAFA'
        },
        MuiTabs: {
          root: {

          },
        },

        // New way of writing MuiTab 
        MuiTab: {
            "root": {
              "&$selected": {
                "border": "3px solid #43B5D9",
                "backgroundColor": "#EBFAFF"
              }
            }
          },
        //   Old way
        // MuiTab: {
        //     root: {
        //         border:"2px solid #DBD7D7",
        //     },
        //     "selected":{
        //         border:"3px solid #43B5D9",
        //         backgroundColor:"#EBFAFF",
        //     },
        // },
        MuiStepIcon:{
            text:{
                fill:"white",
            }
        }
    },

});

export default theme;