import { createStyles, Theme } from '@material-ui/core/styles';

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    toolbarstyle: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.primary.dark,
      maxHeight: '56px',
    },
    buttonAdditional: {
      position: 'absolute',
      float: 'right',
      right: '0',
    },
    waitingSpin: {
      position: 'relative',
      left: 'calc(50% - 10px)',
      top: 'calc(40vh)',
    },
  });
