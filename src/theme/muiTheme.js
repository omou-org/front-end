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
export const charcoal = "#333333";
export const cloudy = "#C4C4C4";

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
  fontSize: '36px',
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
  fontSize: '20px',
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
  fontVariant: 'small-caps',
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
<<<<<<< HEAD
    "warning": { "main": "#FFDD59" },
    "background": {
      "main": neutralBackgroundColor,
      "default": neutralBackgroundColor,
    },
    "success": { "main": "#6CE086" },
    "warning": { "main": "#FFDD59" },
    "error": { "main": "#FF6766" },
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
=======
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
>>>>>>> DahlDesign
    "MuiButton": {
      "fontSize": '14px',
      "fontWeight": '500',
      "fontStyle": 'normal',
      "fontFamily": 'Roboto',
      "lineHeight": '16px',
      "fontVariant": 'all-small-caps',
      "fontFeatureSettings": '"cpsp" on',
      "text": {
<<<<<<< HEAD
        "color": "black",
=======
        "color": goth,
>>>>>>> DahlDesign
      },
      "contained": {
        "fontSize": '14px',
        "fontWeight": '500',
        "fontStyle": 'normal',
        "fontFamily": 'Roboto',
        "lineHeight": '16px',
        "fontVariant": 'all-small-caps',
        "fontFeatureSettings": '"cpsp" on',
<<<<<<< HEAD
        "color": "#FFFFFF",
        "backgroundColor": "#289FC3",
        "border": "2px solid #289FC3",
=======
        "color": white,
        "backgroundColor": buttonBlue,
        "border": `2px solid ${buttonBlue}`,
>>>>>>> DahlDesign
        "boxSizing": "border-box",
        "borderRadius": "5px",
        "overflow": "hidden",
        "white-space": "nowrap",
        "text-overflow": "ellipsis",
        "&:hover": {
<<<<<<< HEAD
          "backgroundColor": "#289FC3",
=======
          "backgroundColor": buttonBlue,
>>>>>>> DahlDesign
          "opacity": "80%",
          "border": "rgba(40, 159, 195, 0.8)",
          "-webkit-background-clip": "padding-box",
          "background-clip": "padding-box"
        },
        "&:active": {
<<<<<<< HEAD
          "backgroundColor": "#289FC3",
=======
          "backgroundColor": buttonBlue,
>>>>>>> DahlDesign
          "opacity": "60%",
          "border": "rgba(40, 159, 195, 0.6)",
          "-webkit-background-clip": "padding-box",
          "background-clip": "padding-box"
        },
      },
      "outlined": {
        "fontSize": '14px',
        "fontWeight": '500',
        "fontStyle": 'normal',
        "fontFamily": 'Roboto',
        "lineHeight": '16px',
        "fontVariant": 'all-small-caps',
        "fontFeatureSettings": '"cpsp" on',
<<<<<<< HEAD
        "color": "#289FC3",
        "backgroundColor": "#FFFFFF",
        "border": "2px solid #C4C4C4",
=======
        "color": buttonBlue,
        "backgroundColor": white,
        "border": `2px solid ${cloudy}`,
>>>>>>> DahlDesign
        "boxSizing": "border-box",
        "border-radius": "5px",
        "overflow": "hidden",
        "white-space": "nowrap",
        "text-overflow": "ellipsis",
        "&:hover": {
<<<<<<< HEAD
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
=======
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
>>>>>>> DahlDesign
          "opacity": "80%"
        },
      },
      containedPrimary: {
<<<<<<< HEAD
        color: "#FFFFFF",
=======
        color: white,
>>>>>>> DahlDesign
      }
    },
    "MuiBadge": {
      "colorPrimary": {
<<<<<<< HEAD
        "color": "white",
=======
        "color": white,
>>>>>>> DahlDesign
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
<<<<<<< HEAD
        backgroundColor: neutralBackgroundColor,
=======
        backgroundColor: backgroundGrey,
>>>>>>> DahlDesign
        padding: "1vw",
      }
    },
    "paper": {
<<<<<<< HEAD
      "background": "#FAFAFA",
=======
      "background": backgroundGrey,
>>>>>>> DahlDesign
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
<<<<<<< HEAD
        color: "#666666",
        backgroundColor: "#ffffff",
=======
        color: slateGrey,
        backgroundColor: white,
>>>>>>> DahlDesign
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
<<<<<<< HEAD
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
=======
            backgroundColor: backgroundGrey
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
>>>>>>> DahlDesign
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
<<<<<<< HEAD
        "fill": "white",
      },
    },
    MuiTableHead: {
      root: {
        color: omouBlue
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
      head: {
        color: "inherit"
      },
      root: {
        borderBottomColor: cloudy,
        borderBottomWidth: "1px"
=======
        "fill": white,
      },
    },
    MuiTableCell: {
      head: {
        color: omouBlue,
        fontWeight: 600,
>>>>>>> DahlDesign
      }
    }
  },
});

export default theme;