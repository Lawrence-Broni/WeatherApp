import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme2 = createTheme({
    components: {

      /*
        Styling for TTS buttons
        Simple square buttons represented by an icon
      */
      MuiButton : {
          styleOverrides : {
            root : {
              fontFamily: '"Source Serif Pro", "serif"',
              color: 'white',
              fontSize: '12pt',
              background: `transparent`,
              textTransform :`none`,
            }
          }
      }
    },
  });

export default theme2;