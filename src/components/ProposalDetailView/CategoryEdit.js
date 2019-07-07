import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import OptionTableView from './OptionView';
import OptionEdit from './OptionEdit';

const styles = theme => ({
  root: {
    padding: theme.spacing(1),
    display: 'block',
    borderTop: '1px solid #CCC',
    height: '100%',
  },
  options: {
    padding: theme.spacing(1),
  },
});

class CategoryEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingId: '',
      adding: false,
      addingOption: {},
    };
  }

  compFunc = id => opt => opt.id === id.toString();

  handleAdd = () => {
    const options = this.props.category.options;
    let id = 0;
    while (options.length > 0) {
      // eslint-disable-line no-loop-func
      if (options.some(this.compFunc(id))) {
        id++;
        continue;
      }
      break;
    }

    this.setState({
      editingId: '',
      adding: true,
      addingOption: {
        id: id.toString(),
        name: '',
        value: '',
        description: '',
        budget: '1000',
        duration: '10',
      },
    });
  };

  handleEdit = id => {
    this.setState({ adding: false, editingId: id });
  };

  handleSave = async opt => {
    if (this.state.adding) {
      await this.props.handleAdd(this.props.category.id, opt);
    } else {
      await this.props.handleUpdate(this.props.category.id, opt);
    }
    this.setState({ adding: false, editingId: '' });
  };

  handleCancel = () => {
    this.setState({ adding: false, editingId: '' });
  };

  handleDelete = async opt => {
    await this.props.handleDelete(this.props.category.id, opt);
    this.setState({ adding: false, editingId: '' });
  };

  render() {
    const { classes, category, edit } = this.props;
    const options = category.options;

    return (
      <div className={classes.root}>
        {this.state.adding && (
          <OptionEdit
            option={this.state.addingOption}
            handleSave={this.handleSave}
            handleCancel={this.handleCancel}
          />
        )}
        {options && (
          <OptionTableView
            edit={edit}
            options={options}
            editingId={this.state.editingId}
            handleAdd={this.handleAdd}
            handleSave={this.handleSave}
            handleCancel={this.handleCancel}
            handleDelete={this.handleDelete}
            handleEdit={this.handleEdit}
          />
        )}
      </div>
    );
  }
}

CategoryEdit.propTypes = {
  edit: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        description: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default withStyles(styles)(CategoryEdit);
