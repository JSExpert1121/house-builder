import { createStyles, Theme } from '@material-ui/core/styles';

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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
    mainWrapper: {
      marginTop: theme.spacing(1),
    },
  });
