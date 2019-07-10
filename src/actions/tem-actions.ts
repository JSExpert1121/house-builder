import restAPI from '../services';
import {
  ALL_TEMPLATES_LOADED,
  SET_SELECTED_CATEGORY,
  SET_SELECTED_OPTION,
  SET_SELECTED_TEMPLATE,
  CLEAR_ALL_TEMPLATES,
  CLEAR_SELECTED_TEMPLATE
} from '../constants/tem-action-types';
import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
import { clearSelectedOption } from './cont-actions';
import { createActions } from "redux-actions";
import { CLEAR_SELECTED_CATEGORY } from "../constants/cont-action-types";

const {
  allTemplatesLoaded,
  clearAllTemplates,
  setSelectedCategory,
  setSelectedOption,
  setSelectedTemplate,
  clearSelectedTemplate,
} = createActions({
  [ALL_TEMPLATES_LOADED]: (templates) => templates,
  [CLEAR_ALL_TEMPLATES]: () => null,
  [SET_SELECTED_CATEGORY]: (data) => data,
  [SET_SELECTED_OPTION]: (selectedOption) => selectedOption,
  [SET_SELECTED_TEMPLATE]: (selectedTemplate) => selectedTemplate,
  [CLEAR_SELECTED_TEMPLATE]: () => null,
});

export function createTemplate(template) {
  return function (dispatch) {
    dispatch(clearAllTemplates());

    return restAPI
      .post('templates', template)
  };
}

export function selectTemplate(id) {
  return function (dispatch) {
    dispatch(clearSelectedTemplate());

    return restAPI
      .get(`/templates/${id}`)
      .then((response: AxiosResponse) => {
        dispatch(setSelectedTemplate(response.data));
      })
      .catch(err => console.log(err.message));
  };
}

export function selectOption(id: number) {
  return function (dispatch: Dispatch) {
    dispatch(clearSelectedOption());

    return restAPI
      .get(`/options/${id}`)
      .then((response: AxiosResponse) => {
        dispatch(setSelectedOption(response.data));
      });
  };
}

export function selectCategory(id) {
  return function (dispatch) {
    dispatch({ type: CLEAR_SELECTED_CATEGORY });
    return restAPI
      .get(`/categories/${id}`)
      .then((response: AxiosResponse) => {
        dispatch(setSelectedCategory(response.data));
      });
  };
}

export function getTemplatesO(page, size) {
  return function (dispatch) {
    dispatch(clearAllTemplates());
    return restAPI
      .get('/templates', { page, size })
      .then((response: AxiosResponse) => {
        dispatch(allTemplatesLoaded(response.data));
      });
  };
}

export function deleteTemplate(id, cb) {
  return function (dispatch) {
    return restAPI
      .delete(`/templates/${id}`)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
      });
  };
}

export function deleteCategory(id, cb) {
  return function (dispatch) {
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
  return function (dispatch) {
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
  return function (dispatch) {
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
  return function (dispatch) {
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
  return function (dispatch) {
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

export const editCategory = (id, data) => dispatch => restAPI.put('categories/' + id, data);
export const editTemplate = (id, data) => dispatch => restAPI.put('templates/' + id, data);

