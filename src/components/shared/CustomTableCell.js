import { withStyles } from '@material-ui/core/styles';
import { TableCell }  from '@material-ui/core';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    color: theme.palette.primary.light,
  },
}))(TableCell);

export default CustomTableCell;
