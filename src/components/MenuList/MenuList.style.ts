import { Theme, createStyles } from '@material-ui/core/styles';

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
      borderLeft: '5px solid ' + theme.palette.primary.light,
      color: theme.palette.primary.light,
    },
  });
