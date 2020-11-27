import { createMuiTheme } from "@material-ui/core/styles";
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const breakpoints = createBreakpoints({})

const tabBorderRadius = "10px";

// Font Colors
export const lightPrimaryFontColor = "#767474";
export const secondaryFontColor = "#228eb2";
export const highlightColor = "#EBFAFF";
export const errorRed = "#c0392b";
export const activeColor = "#6FCF97";
export const pastColor = "#BDBDBD";

// Theme Colors
export const omouBlue = "#43B5D9";
export const skyBlue = "#EBFAFF";
export const outlineGrey = "#E0E0E0";
export const black = "#000000";
export const darkGrey = "#666666";
export const darkBlue = "#1F82A1";
export const white = "#FFFFFF";
export const goth = "#000000";
export const charcoal = "#333333";
export const slateGrey = "#666666";
export const gloom = "#999999";
export const cloudy = "#C4C4C4";
export const lightGrey = "#D3D3D3";
export const buttonBlue = "#289FC3";
export const backgroundGrey = "#FAFAFA";
export const statusGreen = "#6CE086";
export const statusYellow = "#FFDD59";
export const statusRed = "#FF6766";

// Typography
export const h1 = {
  fontSize: '40px',
  fontWeight: 'bold',
  fontFamily: 'Roboto Slab',
  lineHeight: '48px',
  color: goth
};
export const h2 = {
  fontSize: '32px',
  fontWeight: 'bold',
  fontFamily: 'Roboto',
  lineHeight: '40px',
  color: slateGrey
};
export const h3 = {
  fontSize: '24px',
  fontWeight: '500',
  fontFamily: 'Roboto',
  lineHeight: '32px',
  color: goth
};
export const h4 = {
  fontSize: '16px',
  fontWeight: '500',
  fontFamily: 'Roboto',
  lineHeight: '16px',
};
export const h5 = {
  fontSize: '14px',
  fontWeight: '500',
  fontStyle: 'normal',
  fontFamily: 'Roboto',
  lineHeight: '16px',
  fontVariant: 'all-small-caps',
  fontFeatureSettings: '"cpsp" on'
};
// Body (Default)
export const body1 = {
  fontSize: '14px',
  fontWeight: '400',
  fontFamily: 'Roboto',
  lineHeight: '16px',
  color: goth
};
// Body (Paragraph)
export const h6 = {
  fontSize: '14px',
  fontWeight: '400',
  fontFamily: 'Roboto',
  lineHeight: '22px',
  color: goth
};
// Body (Bolded)
export const body2 = {
  fontSize: '14px',
  fontWeight: '500',
  fontFamily: 'Roboto',
  lineHeight: '16px',
  color: goth
};
export const subtitle1 = {
  fontSize: '20px',
  fontWeight: '300',
  fontFamily: 'Roboto',
};


const defaultFontProps = {
  fontFamily: 'Roboto Slab',
  fontWeight: 700,
};

const theme = createMuiTheme({
  "palette": {
    "primary": { "main": omouBlue },
    "secondary": { "main": "#a6a6a6" },
    "warning": { "main": statusYellow },
    "background": {
      "main": backgroundGrey,
      "default": backgroundGrey,
    },
    "success": { "main": statusGreen },
    "warning": { "main": statusYellow },
    "error": { "main": statusRed },
  },
  colors: {
    black,
    darkGrey,
    darkBlue,
    omouBlue,
    skyBlue,
    white,
    goth,
    charcoal,
    slateGrey,
    gloom,
    cloudy,
    lightGrey,
    buttonBlue,
    backgroundGrey,
    statusGreen,
    statusYellow,
    statusRed,
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
          "backgroundColor": backgroundGrey,
        }
      },
    },
    MuiTypography: {
      variantMapping: {
        subtitle1: 'h5',
      },
      h1,
      h2,
      h3,
      h4,
      h5,
      //Body(Default)
      body1,
      //Body(Paragraph)
      h6,
      //Body(Bolded)
      body2,
      subtitle1,
    },
    "MuiButton": {
      ...h5,
      "text": {
        "color": goth,
      },
      "contained": {
        ...h5,
        "color": white,
        "backgroundColor": buttonBlue,
        "border": `2px solid ${buttonBlue}`,
        "boxSizing": "border-box",
        "borderRadius": "5px",
        "overflow": "hidden",
        "white-space": "nowrap",
        "text-overflow": "ellipsis",
        "&:hover": {
          "backgroundColor": buttonBlue,
          "opacity": "80%",
          "border": "rgba(40, 159, 195, 0.8)",
          "-webkit-background-clip": "padding-box",
          "background-clip": "padding-box"
        },
        "&:active": {
          "backgroundColor": buttonBlue,
          "opacity": "60%",
          "border": "rgba(40, 159, 195, 0.6)",
          "-webkit-background-clip": "padding-box",
          "background-clip": "padding-box"
        },
      },
      "outlined": {
        ...h5,
        "color": buttonBlue,
        "backgroundColor": white,
        "border": `2px solid ${cloudy}`,
        "boxSizing": "border-box",
        "border-radius": "5px",
        "overflow": "hidden",
        "white-space": "nowrap",
        "text-overflow": "ellipsis",
        "&:hover": {
          "backgroundColor": white,
          "opacity": "90%"
        },
        "&:active": {
          "backgroundColor": white,
          "opacity": "70%"
        },
        "&:disabled": {
          "border": `2px solid ${gloom}`,
          "backgroundColor": cloudy,
          "color": gloom,
          "opacity": "80%"
        },
      },
      containedPrimary: {
        color: white,
      }
    },
    "MuiBadge": {
      "colorPrimary": {
        "color": white,
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
        backgroundColor: backgroundGrey,
        padding: "1vw",
      }
    },
    "paper": {
      "background": backgroundGrey,
    },
    "MuiMenuItem": {
      "root": {
        "width": "100%",
      },
    },
    "MuiTabs": {
      root: {
        color: '#000000',
      }
    },
    "MuiTab": {
        root: {
            ...h5,
            width: "144px",
            height: "40px",
            color: '#000000',
            opacity: 1,
            strokeWidth: '1',
            overflow: "hidden",
            whiteSpace: "nowrap",
            paddingLeft: "1em",
            paddingRight: "1em",
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            borderBottom: "1px solid #43B5D9",
            marginTop: "0",
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
                "background": "#EBFAFF",
                "borderTop": "1px solid #43B5D9",
                "borderLeft": "1px solid #43B5D9",
                "borderRight": "1px solid #43B5D9",
                "boxSizing": "border-box",
                "borderRadius": "5px 5px 0px 0px"
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
        "fill": white,
      },
    },
    MuiTableHead: {
      root: {
        color: omouBlue,
      }
    },
    TableHeadSecondary: {
      color: charcoal
    },
    MuiTableRow: {
      root: {
        color: "inherit",
        height: "48px"
      }
    },
    MuiTableCell: {
      root: {
        borderBottomColor: cloudy,
        borderBottomWidth: "1px",
      },
      head: {
        color: "inherit",
        ...h4,
      },
      body: {
        ...body1,
      }
    }
  },
  props: {
    MuiCardHeader: {
      titleTypographyProps: {
        variant: "h4"
      },
      subheaderTypographyProps: {
        variant: "body2"
      }
    }
  }
});

export default theme;