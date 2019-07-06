import { createActions } from 'redux-actions';
import {
  ALL_PROJECT_LOADED,
  CLEAR_ALL_PROJECTS,
  CLEAR_PROJECTS,
  CLEAR_TEMPLATES,
  PROJECT_LOADED,
  TEMPLATES_LOADED,
} from '../constants/gen-action-types';
import ProjApi from '../api/project';
import restAPI from '../services';

export const {
  allProjectLoaded,
  clearAllProjects,
  clearProjects,
  clearTemplates,
  projectLoaded,
  templatesLoaded,
} = createActions({
  [ALL_PROJECT_LOADED]: projects => projects,
  [CLEAR_ALL_PROJECTS]: () => null,
  [CLEAR_PROJECTS]: () => null,
  [CLEAR_TEMPLATES]: () => null,
  [PROJECT_LOADED]: projects => projects,
  [TEMPLATES_LOADED]: templates => templates,
});

export function awardProject(id) {
  return function () {
    return restAPI.put('proposals/' + id, {
      status: 'AWARDED',
    });
  };
}

export function getProjectsByGenId(id, page, rowSize) {
  return function (dispatch) {
    restAPI
      .get(`/contractors/${id}/projects`, { page, size: rowSize })
      .then(response => {
        dispatch(projectLoaded(response.data));
      });
  };
}

export const getArchivedProjectsByGenId = (id, page, rowSize) => dispatch => {
  restAPI
    .get(`/contractors/${id}/projects`, { page, size: rowSize, status: 'ARCHIVED' })
    .then(response => {
      dispatch(projectLoaded(response.data));
    });
}

export function getAllProjects(page, size) {
  return function (dispatch) {
    dispatch(clearAllProjects());
    return restAPI
      .get('/projects', { page, size })
      .then(response => {
        dispatch(allProjectLoaded(response.data));
      });
  };
}

export function getTemplates(page, size) {
  return function (dispatch) {
    dispatch(clearTemplates());
    return restAPI
      .get('/templates', { page, size })
      .then(response => {
        dispatch(templatesLoaded(response.data));
      });
  };
}

export const addTemplate = (projectId, templateId) => dispatch => ProjApi.addTemplate(projectId, templateId);
export const deleteTemplate = (projectId, templateId) => dispatch => ProjApi.deleteTemplate(projectId, templateId);
