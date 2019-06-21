import { createMuiTheme } from '@material-ui/core/es/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#4a148c',
      dark: '#12005e',
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#c7a4ff',
      main: '#9575cd',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#000000',
    },
    // error: will use the default color
  },

  typography: {
    // Use any custom font instead of the default Roboto font.
    useNextVariants: true,
    fontFamily: ['Niramit', 'Arial'].join(','),
  },
  overrides: {
    MuiInputBase: {
      input: {
        padding: '2px 0 3px',
      },
    },
    MuiFormControl: {
      root: {
        margin: '16px 0',
      },
      marginNormal: {
        margin: '8px 0 4px',
      },
    },
    Muit: {
      root: {
        fontSize: '0.8125rem',
        minWidth: '120px',
        maxWidth: '200px',
        lineHeight: '1',
        minHeight: '36px',
        maxHeight: '48px',
      },
      labelIcon: {
        margin: '6px 0px',
        lineHeight: '1',
        padding: '0px',
        minHeight: '56px',
      },
      /*wrapper: {
        '& > *:first-child': {
          marginBottom: '0px',
        },
      },*/
    },
    MuiTabs: {
      root: {
        minHeight: '36px',
      },
    },
    MuiIconButton: {
      root: {
        padding: '6px 8px',
      },
    },
    MuiTablePagination: {
      toolbar: {
        minHeight: '48px',
        height: '48px',
      },
    },
    MuiButton: {
      root: {
        backgroundColor: '#7c43bd',
        color: 'white',
        '&:hover': {
          backgroundColor: '#12005e',
        },
      },
    },
  },
});

export default theme;
