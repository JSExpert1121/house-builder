import React                                                            from 'react';
import PropTypes                                                        from 'prop-types';
// material ui
import {IconButton, Table, TableBody, TableHead, TableRow, withStyles,} from '@material-ui/core';
import {Delete as DeleteIcon, NoteAdd as NoteAddIcon,}                  from '@material-ui/icons';
import CustomTableCell                                                  from '../../components/shared/CustomTableCell';

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
    <Table size="small">
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

SpecTableView.propTypes = {
  specialties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  handleAdd: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default withStyles(styles)(SpecTableView);
