import {createMuiTheme} from "@material-ui/core/styles";
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const breakpoints = createBreakpoints({})

const tabBorderRadius = "10px";
// Theme Colors
export const omouBlue = "#43B5D9";
export const skyBlue = "#EBFAFF";
export const outlineGrey = "#E0E0E0";

// Font Colors
export const lightPrimaryFontColor = "#767474";
export const secondaryFontColor = "#228eb2";
export const neutralBackgroundColor = "#FAFAFA";
export const highlightColor = "#EBFAFF";
export const errorRed = "#c0392b";
export const activeColor = "#6FCF97";
export const pastColor = "#BDBDBD";

const defaultFontProps = {
    fontFamily: 'Roboto Slab',
    fontWeight: 700,
};

const theme = createMuiTheme({
    "palette": {
        "primary": {"main": omouBlue},
        "secondary": {"main": "#a6a6a6"},
        "warning": {"main": "#FFDD59"},
        "background": {
            "main": neutralBackgroundColor,
            "default": neutralBackgroundColor,
        },
        "success": {"main": "#6CE086"},
        "warning": {"main": "#FFDD59"},
        "error": {"main": "#FF6766"},
    },
    "colors": {
        "black": "#000000",
        "darkGray": "#666666",
        "darkBlue": "#1F82A1",
        "omouBlue": "#43B5D9",
        "skyBlue": "#EBFAFF",
        "white": "#FFFFFF",
        "goth": "#000000",
        "charcoal": "#333333",
        "slateGrey": "#666666",
        "gloom": "#999999",
        "cloudy": "#C4C4C4",
        "lightGrey": "#D3D3D3",
        "buttonBlue": "#289FC3",
        "backgroundGrey": "#EEEEEE",
        "statusGreen": "#6CE086",
        "statusYellow": "#FFDD59",
        "statusRed": "#FF6766",
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
                }
            },
        },
        MuiTypography: {
            variantMapping: {
                subtitle1: 'h5',
            },
            h1: {
              fontSize: '36px',
              fontWeight: 'bold',
              fontFamily: 'Roboto Slab',
              lineHeight: '48px',
              color: '#000000'
            },
            h2: {
              fontSize: '32px',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
              lineHeight: '40px',
              color: '#666666'
            },
            h3: {
              fontSize: '20px',
              fontWeight: '500',
              fontFamily: 'Roboto',
              lineHeight: '32px',
              color: '#000000'
            },
            h4: {
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Roboto',
              lineHeight: '16px',
            },
            h5: {
              fontSize: '14px',
              fontWeight: '500',
              fontStyle: 'normal',
              fontFamily: 'Roboto',
              lineHeight: '16px',
              fontVariant: 'small-caps',
              fontFeatureSettings: '"cpsp" on'
            },
            //Body(Default)
            body1: {
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'Roboto',
              lineHeight: '16px',
              color: '#000000'
            },
            //Body(Paragraph)
            h6: {
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'Roboto',
              lineHeight: '22px',
              color: '#000000'
            },
            //Body(Bolded)
            body2: {
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Roboto',
              lineHeight: '16px',
              color: '#000000'
            },
            subtitle1: {
                fontSize: '20px',
                fontWeight: '300',
                fontFamily: 'Roboto',
            },
        },
        "MuiButton": {
          "fontSize": '14px',
          "fontWeight": '500',
          "fontStyle": 'normal',
          "fontFamily": 'Roboto',
          "lineHeight": '16px',
          "fontVariant": 'all-small-caps',
          "fontFeatureSettings": '"cpsp" on',
            "text": {
                "color": "black",
            },
            "contained" : {
              "fontSize": '14px',
              "fontWeight": '500',
              "fontStyle": 'normal',
              "fontFamily": 'Roboto',
              "lineHeight": '16px',
              "fontVariant": 'all-small-caps',
              "fontFeatureSettings": '"cpsp" on',
              "color": "#FFFFFF",
              "backgroundColor": "#289FC3",
              "border": "2px solid #289FC3",
              "boxSizing": "border-box",
              "borderRadius": "5px",
              "overflow": "hidden",
              "white-space": "nowrap",
              "text-overflow": "ellipsis",
              "&:hover": {
                "backgroundColor": "#289FC3",
                "opacity": "80%",
                "border": "rgba(40, 159, 195, 0.8)",
                "-webkit-background-clip": "padding-box", 
                "background-clip": "padding-box"
              },
              "&:active": {
                "backgroundColor": "#289FC3",
                "opacity": "60%",
                "border": "rgba(40, 159, 195, 0.6)",
                "-webkit-background-clip": "padding-box", 
                "background-clip": "padding-box"
              },
            },
            "outlined" : {
              "fontSize": '14px',
              "fontWeight": '500',
              "fontStyle": 'normal',
              "fontFamily": 'Roboto',
              "lineHeight": '16px',
              "fontVariant": 'all-small-caps',
              "fontFeatureSettings": '"cpsp" on',
              "color": "#289FC3",
              "backgroundColor": "#FFFFFF",
              "border": "2px solid #C4C4C4",
              "boxSizing": "border-box",
              "border-radius": "5px",
              "overflow": "hidden",
              "white-space": "nowrap",
              "text-overflow": "ellipsis",
              "&:hover": {
                "backgroundColor": "#FFFFFF",
                "opacity": "90%"
              },
              "&:active": {
                "backgroundColor": "#FFFFFF",
                "opacity": "70%"
              },
              "&:disabled": {
                "border": "2px solid #999999",
                "backgroundColor": "#C4C4C4",
                "color": "#999999",
                "opacity": "80%"
              },
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
        MuiChip: {
          root: {
            height: "24px",  
            borderRadius: "2px",
            paddingRight: "12px",
            paddingLeft: "12px"
          },
          label: {
            paddingRight: "0px",
            paddingLeft: "0px"
          }
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
        "MuiTab": {
            root: {
                opacity: 1,
                overflow: "initial",
                paddingLeft: "1em",
                paddingRight: "1em",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                marginTop: "0",
                color: "#666666",
                backgroundColor: "#ffffff",
                transition: "0.2s",
                [breakpoints.up("md")]: {
                  minWidth: 120
                },
                "&:before": {
                  transition: "0.2s"
                },
                "&:not(:first-of-type)": {
                  "&:before": {
                    content: '" "',
                    position: "absolute",
                    left: 0,
                    display: "block",
                    height: "10em",
                    width: 1,
                    zIndex: 1,
                    marginTop: "0.5em",
                    backgroundColor: "#EEEEEE"
                  }
                },
                "& + $selected:before": {
                  opacity: 0
                },
                "&:hover": {
                  "&:not($selected)": {
                    backgroundColor: skyBlue
                  },
                  "&::before": {
                    opacity: 0
                  },
                  "& + $root:before": {
                    opacity: 0
                  }
                },
                "&$selected": {
                    "backgroundColor": skyBlue,
                    "color": omouBlue,
                },
              },
              selected: {
                backgroundColor: skyBlue,
                color: omouBlue,
                "& + $root": {
                  zIndex: 1
                },
                "& + $root:before": {
                  opacity: 0
                }
              },
              wrapper: {
                zIndex: 2,
                marginTop: "0.5em",
                textTransform: "initial",    
              },
              indicator: {
                display: "none",
                marginTop: "1.1em",
              }
        },
        "MuiStepIcon": {
            "text": {
                "fill": "white",
            },
        },
        MuiTableCell: {
            head: {
                color: omouBlue,
                fontWeight: 600,
            }
        }
    },
});

export default theme;