import { createStyles, Theme } from '@material-ui/core/styles';

export default (theme: Theme) =>
  createStyles({
    list: {
      width: '60px',
      float: 'left',
      borderRadius: '0',
      height: 'calc(100vh - 64px)',
      [theme.breakpoints.up('md')]: {
        width: '15%',
      },
    },
    listItemText: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    selectedStyle: {
      backgroundColor: theme.palette.primary.dark,
    },
    activeIcon: {
      color: '#f50057',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  });
