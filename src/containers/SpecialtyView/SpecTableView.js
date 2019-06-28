import IconButton from '@material-ui/core/IconButton';
import Table      from '@material-ui/core/Table';
import TableBody  from '@material-ui/core/TableBody';
import TableHead  from '@material-ui/core/TableHead';
import TableRow   from '@material-ui/core/TableRow';

import DeleteIcon      from '@material-ui/icons/Delete';
import NoteAddIcon     from '@material-ui/icons/NoteAdd';
import React           from 'react';
import CustomTableCell from '../../components/shared/CustomTableCell';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  successAlert: {
    marginBottom: '10px',
  },
  editField: {
    lineHeight: '1.5rem',
  },
});

const SpecTableView = ({
  specialties,
  handleDelete,
  handleAdd,
  handleSelect,
  classes,
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <CustomTableCell> Specialty Name </CustomTableCell>
          <CustomTableCell align="center">
            Specialty Description
          </CustomTableCell>
          <CustomTableCell align="center">
            <IconButton style={{ color: '#FFFFFF' }} onClick={handleAdd}>
              <NoteAddIcon />
            </IconButton>
          </CustomTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {specialties.map(specialty => (
          <TableRow
            className={classes.row}
            key={specialty.id}
            hover
            onClick={e => {
              e.preventDefault();
              console.log(e.target);
              handleSelect(specialty.id);
            }}
          >
            <CustomTableCell component="th" scope="specialty">
              {specialty.name}
            </CustomTableCell>
            <CustomTableCell align="center">
              {specialty.description}
            </CustomTableCell>

            <CustomTableCell align="center">
              <IconButton
                className={classes.button}
                aria-label="Delete"
                color="primary"
                onClick={e => {
                  e.stopPropagation();
                  handleDelete(specialty.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </CustomTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default withStyles(styles)(SpecTableView);
