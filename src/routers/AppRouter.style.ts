import { createStyles, Theme } from '@material-ui/core/styles';

export default (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    viewarea: {
      width: 'calc(100% - 60px)',
      float: 'left',
      borderRadius: '0',
      height: 'calc(100vh - 64px)',
      [theme.breakpoints.up('md')]: {
        width: '85%',
      },
    },
    waitingSpin: {
      position: 'relative',
      left: 'calc(50vw - 10px)',
      top: 'calc(50vh - 10px)',
    },
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
      padding: theme.spacing(0, 2),
    },
    container: {
      padding: theme.spacing(2, 0),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
    appBarSpacer: theme.mixins.toolbar,
  });
