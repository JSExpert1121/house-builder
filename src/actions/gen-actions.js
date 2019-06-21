import {ALL_PROJECT_LOADED, TEMPLATES_LOADED,} from '../constants/gen-action-types';

import ProjApi from '../api/project';
import restAPI from '../services';

export function awardProject(id) {
  return function() {
    return restAPI.put('proposals/' + id, {
      status: 'AWARDED',
    });
  };
}

export function getProjectsByGenId(id, page, rowSize) {
  return function(dispatch) {
    return restAPI
      .get('contractors/' + id + '/projects', {
        params: {
          page: page,
          size: rowSize,
        },
      })
      .then(response => {
        dispatch({ type: 'PROJECT_LOADED', payload: response.data })
      });
  };
}

export function getAllProjects(page, size) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_ALL_PROJECTS' });
    return restAPI
      .get('projects', {
        params: {
          page: page,
          size: size,
        },
      })
      .then(response => {
        dispatch({ type: ALL_PROJECT_LOADED, payload: response.data });
      });
  };
}

export function addProject(id, data, cb) {
  return function(dispatch) {
    return restAPI
      .post('contractors/' + id + '/projects', data)
      .then(response => {
        cb(response.data.id);
      })
      .catch(err => {
        console.log(err.message);
        cb(false);
      });
  };
}

export function getTemplates(page, size) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_TEMPLATES' });

    return restAPI
      .get('templates', {
        params: {
          page: page,
          size: size,
        },
      })
      .then(response => {
        dispatch({ type: TEMPLATES_LOADED, payload: response.data });
      });
  };
}

export const addTemplate = (proj_id, templ_id) => dispatch =>
  ProjApi.addTemplate(proj_id, templ_id);
export const deleteTemplate = (proj_id, templ_id) => dispatch =>
  ProjApi.deleteTemplate(proj_id, templ_id);

export function updateProject(id) {
  return function(dispatch) {
    return restAPI.get('projects/' + id).then(response => {
      dispatch({
        type: 'PROJECT_DETAIL_LOADED',
        payload: response.data,
      });
    });
  };
}
