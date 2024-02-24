import { ThemeOptions, createTheme } from '@mui/material/styles';

const typography: ThemeOptions['typography'] = (colourPalette) => ({
  allVariants: {
    color: colourPalette.common.white,
    userSelect: 'none',
  },
  h1: {
    fontSize: '2rem',
  },
});

const theme = createTheme({
  typography,
  palette: {
    text: {
      primary: '#fff',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          userSelect: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          background: '#FFFFFF20',
          '&:hover': {
            backgroundColor: '#FFFFFF40',
          },
          transition: 'background 0.3s ease',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
});

export default theme;
