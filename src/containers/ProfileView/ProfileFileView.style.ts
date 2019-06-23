import { createStyles, Theme } from '@material-ui/core/styles';

export default (theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      left: '0px',
      top: '0px',
      flexGrow: 1,
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      height: 'calc(100vh - 152px)',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    waitingSpin: {
      position: 'relative',
      left: 'calc(50% - 20px)',
      top: 'calc(40vh)',
    },
    dropzone: {
      width: '300px',
      [theme.breakpoints.up('sm')]: {
        width: '500px',
      },
    },
    button: {
      padding: '6px',
    }
  });
