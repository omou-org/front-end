import theme, { omouBlue } from "./muiTheme";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";


const secondaryTheme = createMuiTheme({
	overrides: {
		"MuiTableRow": {
			"head": {
				"backgroundColor": 'transparent',
			}
		},
		"MuiTableCell": {
			"head": {
				"color": omouBlue,
				"fontWeight": "0.75rem",
			}
		}
	}


});


export default secondaryTheme