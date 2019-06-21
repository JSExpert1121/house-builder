import { Theme, createStyles } from '@material-ui/core/styles';

export default (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 128px)',
    margin: theme.spacing(1),
    overflow: 'auto',
    position: 'relative',
  },
  tableWrap: {
    overflow: 'auto',
    maxHeight: 'calc(100vh - 184px)',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
  desc: {
    color: '#444',
    marginTop: '0',
    '& > p': {
      margin: theme.spacing(0, 0),
    },
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 20px)',
    top: 'calc(50% - 20px)',
  },
});
