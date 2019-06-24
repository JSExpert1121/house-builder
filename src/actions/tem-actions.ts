import restAPI                 from '../services';
import {
  ALL_TEMPLATES_LOADED,
  SET_SELECTED_CATEGORY,
  SET_SELECTED_OPTION,
  SET_SELECTED_TEMPLATE,
}                              from '../constants/tem-action-types';
import { Dispatch }            from 'redux';
import { AxiosResponse }       from 'axios';
import { clearSelectedOption } from './cont-actions';

export function createTemplate(template, cb) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_ALL_TEMPLATES' });

    return restAPI
      .post('templates', template)
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

    return restAPI
      .get('templates/' + id)
      .then((response: AxiosResponse) => {
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
    dispatch(clearSelectedOption());

    return restAPI
      .get('options/' + id)
      .then((response: AxiosResponse) => {
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

    return restAPI
      .get('categories/' + id)
      .then((response: AxiosResponse) => {
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

    return restAPI
      .get('templates', {
        params: {
          page: page,
          size: size,
        },
      })
      .then((response: AxiosResponse) => {
        dispatch({ type: ALL_TEMPLATES_LOADED, payload: response.data });
      })
      .catch(err => console.log(err.message));
  };
}

export function deleteTemplate(id, cb) {
  return function(dispatch) {
    return restAPI
      .delete('templates/' + id)
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
    return restAPI
      .delete('categories/' + id)
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
    return restAPI
      .delete('options/' + id)
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
    return restAPI
      .post('templates/' + id + '/categories', data)
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
    return restAPI
      .post('categories/' + id + '/options', data)
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
    return restAPI
      .put('options/' + id, data)
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
    return restAPI
      .put('categories/' + id, data)
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
    return restAPI
      .put('templates/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}
