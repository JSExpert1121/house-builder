import { createMuiTheme } from '@material-ui/core/es/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4a148c',
      dark: '#12005e',
    },
    secondary: {
      light: '#c7a4ff',
      main: '#9575cd',
      contrastText: '#000000',
    },
  },

  typography: {
    useNextVariants: true,
    // fontFamily: ['Niramit', 'Arial'].join(','),
  },
  overrides: {
    MuiBadge: {
      colorSecondary: {
        backgroundColor: '#f50057',
        color: '#fff'
      }
    },
    MuiTableHead: {
      root: {
        backgroundColor: '#4a148c',
      }
    },
    MuiCircularProgress: {
      root: {
        position: 'relative',
        left: 'calc(50% - 16px)',
        top: 'calc(50% - 16px)',
        zIndex: '2000',
      }
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
