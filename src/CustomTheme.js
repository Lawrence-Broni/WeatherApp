import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({

  components: {

    /*
      MuiList, MuiMenu, MuiMenuItem

      All provide styling for the dropdown menu
      Idea is to provide styling for a simple menu,
      styled with a gradient purple background and white text
    */
    MuiList: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(to right, #480C78, #1D1444, #000000)`,
          color: 'white',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
            width: 300,
            maxHeight: 500,
            padding: 0,
            paddingTop: 0,
            paddingBottom: 0,
          
        },
      },
    },
    MuiMenuItem : {
        styleOverrides: {
            root: {
                fontFamily: '"Source Serif Pro", "serif"',
                color: 'white',
                fontSize: '20pt',
                width: 300,
                height: 100,
                backgroundImage: `linear-gradient(to right, #480C78, #1D1444, #000000)`,
                transition: 'background-image 0.3s',
                '&:hover': {
                  backgroundImage: `linear-gradient(to right, #6A2AA3, #392B64, #333333)`,
                },
            },
        },
    },

    /*
      Styling for MuiButton

      Used for the buttons in the settings page
      Idea is to have large rounded rectangular buttons,
      Gradient purple background with white text
    */
    MuiButton : {
        styleOverrides : {
          root : {
            fontFamily: '"Source Serif Pro", "serif"',
            color: 'white',
            fontSize: '20pt',
            backgroundImage: `linear-gradient(to right, #480C78, #1D1444, #000000)`,
            textTransform :`none`,
           
          }
        }
    }
  },
});

export default theme;
