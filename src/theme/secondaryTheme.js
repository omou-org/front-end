import theme, {omouBlue} from "./muiTheme";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const secondaryTheme = createMuiTheme({
	...theme,
	MuiTableRow: {
		head: {
			backgroundColor: 'transparent',
		}
	},
	MuiTableCell: {
		head: {
			color: omouBlue,
			fontWeight: 600,
		}
	}
});

export default secondaryTheme