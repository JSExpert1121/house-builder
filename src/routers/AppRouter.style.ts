import { Theme, createStyles } from '@material-ui/core/styles';

export default (theme: Theme) => createStyles({
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
