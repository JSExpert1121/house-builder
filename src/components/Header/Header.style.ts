import { Theme, createStyles } from '@material-ui/core/styles';

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
      fontWeight: 600,
      fontSize: '2.1rem',
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    appbarstyle: {
      backgroundColor: theme.palette.primary.main,
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    profilemenu: {
      top: '50px',
    },
  });
