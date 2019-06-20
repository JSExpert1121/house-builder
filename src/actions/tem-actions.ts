import Axios from 'axios';

import {
  ALL_TEMPLATES_LOADED,
  SET_SELECTED_CATEGORY,
  SET_SELECTED_OPTION,
  SET_SELECTED_TEMPLATE,
} from '../constants/tem-action-types';
import {Dispatch} from 'redux';

export function createTemplate(template, cb) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_ALL_TEMPLATES' });

    return Axios.post(process.env.PROJECT_API + 'templates', template)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function selectTemplate(id) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_SELECTED_TEMPLATE' });

    return Axios.get(process.env.PROJECT_API + 'templates/' + id)
      .then(response => {
        dispatch({
          type: SET_SELECTED_TEMPLATE,
          payload: response.data,
        });
      })
      .catch(err => console.log(err.message));
  };
}

export function selectOption(id: number) {
  return function(dispatch: Dispatch) {
    dispatch({ type: 'CLEAR_SELECTED_OPTION' });

    return Axios.get(process.env.PROJECT_API + 'options/' + id)
      .then(response => {
        dispatch({
          type: SET_SELECTED_OPTION,
          payload: response.data,
        });
      })
      .catch(err => console.log(err.message));
  };
}

export function selectCategory(id) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_SELECTED_CATEGORY' });

    return Axios.get(process.env.PROJECT_API + 'categories/' + id)
      .then(response => {
        dispatch({
          type: SET_SELECTED_CATEGORY,
          payload: response.data,
        });
      })
      .catch(err => console.log(err.message));
  };
}

export function getTemplatesO(page, size) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_ALL_TEMPLATES' });

    return Axios.get(process.env.PROJECT_API + 'templates', {
      params: {
        page: page,
        size: size,
      },
    })
      .then(response => {
        dispatch({ type: ALL_TEMPLATES_LOADED, payload: response.data });
      })
      .catch(err => console.log(err.message));
  };
}

export function deleteTemplate(id, cb) {
  return function(dispatch) {
    return Axios.delete(process.env.PROJECT_API + 'templates/' + id)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function deleteCategory(id, cb) {
  return function(dispatch) {
    return Axios.delete(process.env.PROJECT_API + 'categories/' + id)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        console.log(err.message);
        cb(false);
      });
  };
}

export function deleteOption(id, cb) {
  return function(dispatch) {
    return Axios.delete(process.env.PROJECT_API + 'options/' + id)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function addCategory(id, data, cb) {
  return function(dispatch) {
    return Axios.post(
      process.env.PROJECT_API + 'templates/' + id + '/categories',
      data
    )
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function addOption(id, data, cb) {
  return function(dispatch) {
    return Axios.post(
      process.env.PROJECT_API + 'categories/' + id + '/options',
      data
    )
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function editOption(id, data, cb) {
  return function(dispatch) {
    return Axios.put(process.env.PROJECT_API + 'options/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function editCategory(id, data, cb) {
  return function(dispatch) {
    return Axios.put(process.env.PROJECT_API + 'categories/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function editTemplate(id, data, cb) {
  return function(dispatch) {
    return Axios.put(process.env.PROJECT_API + 'templates/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}
