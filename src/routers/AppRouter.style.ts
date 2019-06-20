import { Theme, createStyles } from '@material-ui/core/styles';

export default (theme: Theme) => createStyles({
  '@global': {
    '.MuiTab-labelIcon': {
      margin: '6px 0px',
      lineHeight: '1',
      padding: '0px',
      minHeight: '56px',
      '& .MuiTab-wrapper': {
        '& > *:first-child': {
          marginBottom: '0px',
        },
      },
    },
    '.MuiTab-root': {
      fontSize: '0.8125rem',
      minWidth: '120px',
      maxWidth: '200px',
      lineHeight: '1',
      minHeight: '36px',
      maxHeight: '48px',
    },
    '.MuiTabs-root': {
      minHeight: '36px',
    },
    '.MuiIconButton-root': {
      padding: '6px 8px',
    },
    '.MuiTablePagination-toolbar': {
      minHeight: '48px',
      height: '48px',
    },
    '.MuiButton-root': {
      backgroundColor: theme.palette.primary.light,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    '.nowrap': {
      fontSize: '14px',
      lineHeight: '1.5',
      maxHeight: '42px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineClamp: '2',
      boxOrient: 'vertical',
      display: 'box',
    },
    '.busy': {
      position: 'absolute',
      left: 'calc(50% - 20px)',
      top: 'calc(50% - 20px)',
    },
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
});
