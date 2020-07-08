import {createMuiTheme} from "@material-ui/core/styles";


const tabBorderRadius = "10px";
// Theme Colors
export const omouBlue = "#43B5D9";
export const skyBlue = "#EBFAFF";

// Font Colors
export const lightPrimaryFontColor = "#767474";
export const secondaryFontColor = "#228eb2";
export const neutralBackgroundColor = "#FAFAFA";

const defaultFontProps = {
    fontFamily: 'Roboto Slab',
    fontWeight: 700,
};

const theme = createMuiTheme({
    "palette": {
        "primary": {"main": omouBlue},
        "secondary": {"main": "#a6a6a6"},
        "background": {
            "main": neutralBackgroundColor,
            "default": neutralBackgroundColor,
        },
		text: {
			// primary: "#FFFFFF",
		}
    },
    "colors": {
        "black": "#000000",
        "darkGray": "#666666",
    },
	"typography": {
		subtitle2: {
			fontWeight: 500,
			fontSize: 12,
		}
	},
    "overrides": {
        "MuiCssBaseline": {
            "@global": {
                "body": {
                    "backgroundColor": neutralBackgroundColor,
                },
            },
        },
        MuiTypography: {
            variantMapping: {
                subtitle1: 'h5',
            },
            h1: defaultFontProps,
            h2: defaultFontProps,
            h3: defaultFontProps,
            h4: defaultFontProps,
            h5: defaultFontProps,
            subtitle1: {
                fontSize: '20px',
                fontWeight: '300',
                fontFamily: 'Roboto',
            },
        },
        "MuiButton": {
            "text": {
                "color": "black",
            },
			containedPrimary: {
				color: "#FFFFFF",
			}
        },
        "MuiBadge": {
            "colorPrimary": {
                "color": "white",
                "marginRight": "6px",
                "marginTop": "4px",
            },
        },
        "MuiDrawer": {
            "paperAnchorLeft": {
                "zIndex": 1,
            },
            "paperAnchorDockedLeft": {
                "borderRight": "none",
                backgroundColor: neutralBackgroundColor,
                padding: "1vw",
            }
        },
        "paper": {
            "background": "#FAFAFA",
        },
        "MuiMenuItem": {
            "root": {
                "width": "100%",
            },
        },
        "MuiTabs": {
            "root": {
                "borderBottomLeftRadius": tabBorderRadius,
                "borderTopLeftRadius": tabBorderRadius,
                "borderBottomRightRadius": tabBorderRadius,
                "borderTopRightRadius": tabBorderRadius,
            },
        },
        "MuiTab": {
            "root": {
                "border": "2px solid #DBD7D7",
                "color": lightPrimaryFontColor,
                "&:first-of-type": {
                    "borderBottomLeftRadius": tabBorderRadius,
                    "borderTopLeftRadius": tabBorderRadius,
                },
                "&:last-of-type": {
                    "borderBottomRightRadius": tabBorderRadius,
                    "borderTopRightRadius": tabBorderRadius,
                },
                "&$selected": {
                    "border": "3px solid #43B5D9",
                    "backgroundColor": "#EBFAFF",
                    "color": secondaryFontColor,
                },
            },
            "selected": {},
        },
        "MuiStepIcon": {
            "text": {
                "fill": "white",
            },
        },
        MuiTableRow: {
            head: {
                backgroundColor: skyBlue,
            }
        },
        MuiTableCell: {
            head: {
                color: secondaryFontColor,
                fontWeight: 600,
            }
        }
    },
});

export default theme;
