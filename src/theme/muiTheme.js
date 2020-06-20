import {createMuiTheme} from "@material-ui/core/styles";

const tabBorderRadius = "10px";

// Font Colors
export const lightPrimaryFontColor = "#767474";
export const secondaryFontColor = "#228eb2";
export const neutralBackgroundColor = "#FAFAFA";

const theme = createMuiTheme({
    "palette": {
        "primary": {"main": "#43B5D9"},
        "secondary": {"main": "#a6a6a6"},
        "background": {
            "main": neutralBackgroundColor,
            "default": neutralBackgroundColor,
        },
    },
    "colors": {
        "black": "#000000",
        "darkGray": "#666666",
    },
    "typography": {},
    "overrides": {
        "MuiCssBaseline": {
            "@global": {
                "body": {
                    "backgroundColor": neutralBackgroundColor,
                },
            },
        },
        "MuiButton": {
            "text": {
                "color": "black",
            },
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
            }
        },
        "paper": {
            "background": "#FAFAFA",
        },
        "MuiPaper": {
            "root": {
                padding: "15px"
            }
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
    },
});

export default theme;
