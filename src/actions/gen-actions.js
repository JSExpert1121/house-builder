import { createAction } from 'redux-actions';
import {
  ALL_PROJECT_LOADED,
  CLEAR_ALL_PROJECTS, CLEAR_PROJECTS,
  CLEAR_TEMPLATES,
  PROJECT_LOADED,
  TEMPLATES_LOADED,
} from '../constants/gen-action-types';

import ProjApi from '../api/project';
import restAPI from '../services';

export const projectLoadedAction = createAction(PROJECT_LOADED);
export const clearAllProjectAction = createAction(CLEAR_ALL_PROJECTS);
export const clearProjectsAction = createAction(CLEAR_PROJECTS);
export const loadedProjectAction = createAction(ALL_PROJECT_LOADED);
export const clearTemplateAction = createAction(CLEAR_TEMPLATES);
export const loadedTemplatesAction = createAction(TEMPLATES_LOADED);

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
        dispatch(projectLoadedAction(response.data));
      });
  };
}
export function getAllProjects(page, size) {
  return function(dispatch) {
    dispatch(clearAllProjectAction());
    return restAPI
      .get('projects', {
        params: {
          page: page,
          size: size,
        },
      })
      .then(response => {
        dispatch(loadedProjectAction(response.data));
      });
  };
}
export function getTemplates(page, size) {
  return function(dispatch) {
    dispatch(clearTemplateAction());

    return restAPI
      .get('templates', {
        params: {
          page: page,
          size: size,
        },
      })
      .then(response => {
        dispatch(loadedTemplatesAction(response.data));
      });
  };
}
export const addTemplate = (proj_id, templ_id) => dispatch =>
  ProjApi.addTemplate(proj_id, templ_id);
export const deleteTemplate = (proj_id, templ_id) => dispatch =>
  ProjApi.deleteTemplate(proj_id, templ_id);

/*
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
*/
/*export function addProject(id, data, cb) {
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
}*/