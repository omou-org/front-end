import { createMuiTheme } from '@material-ui/core/styles';
// import purple from '@material-ui/core/colors/purple';

const tabBorderRadius = "10px";

// Font Colors
const lightPrimaryFontColor = "#767474";
const secondaryFontColor = "#228eb2";

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
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: "#ffffff"
                }
            }
        },
        MuiButton: { // Name of the component ⚛️ / style sheet
            text: { // Name of the rule
                color: 'black;', // Some CSS
            },
        },
        MuiBadge: {
            colorPrimary: {
                color: 'white',
                marginRight: '6px',
                marginTop: '4px'
            }
        },
        paper: {
            background: '#FAFAFA'
        },
        MuiMenuItem: {
            root: {
                width: "100%",

            }
        },
        MuiTabs: {
            root: {
                borderBottomLeftRadius: tabBorderRadius,
                borderTopLeftRadius: tabBorderRadius,
                borderBottomRightRadius: tabBorderRadius,
                borderTopRightRadius: tabBorderRadius,
            },
        },

        // New way of writing MuiTab 
        MuiTab: {
            root: {
                border: "2px solid #DBD7D7",
                color: lightPrimaryFontColor,
                "&:first-of-type": {
                    borderBottomLeftRadius: tabBorderRadius,
                    borderTopLeftRadius: tabBorderRadius,
                },
                "&:last-of-type": {
                    borderBottomRightRadius: tabBorderRadius,
                    borderTopRightRadius: tabBorderRadius,
                },
                "&$selected": {
                    border: "3px solid #43B5D9",
                    backgroundColor: "#EBFAFF",
                    color: secondaryFontColor,
                },

            },
            selected: {},
        },
        MuiStepIcon: {
            text: {
                fill: "white",
            }
        }
    },

});

export default theme;