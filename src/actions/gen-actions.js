import {createActions} from 'redux-actions';
import {
  ALL_PROJECT_LOADED,
  CLEAR_ALL_PROJECTS,
  CLEAR_PROJECTS,
  CLEAR_TEMPLATES,
  PROJECT_LOADED,
  TEMPLATES_LOADED,
}                      from '../constants/gen-action-types';
import ProjApi         from '../api/project';
import restAPI         from '../services';

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
        .get('contractors/' + id + '/projects', {
          params: {
            page: page,
            size: rowSize,
          },
        })
        .then(response => {
          dispatch(projectLoaded(response.data));
        });
  };
}

export function getAllProjects(page, size) {
  return function (dispatch) {
    dispatch(clearAllProjects());
    return restAPI
        .get('projects', {
          params: {
            page: page,
            size: size,
          },
        })
        .then(response => {
          dispatch(allProjectLoaded(response.data));
        });
  };
}

export function getTemplates(page, size) {
  return function (dispatch) {
    dispatch(clearTemplates());

    return restAPI
        .get('templates', {
          params: {
            page: page,
            size: size,
          },
        })
        .then(response => {
          dispatch(templatesLoaded(response.data));
        });
  };
}

export const addTemplate = (proj_id, templ_id) => dispatch =>
    ProjApi.addTemplate(proj_id, templ_id);
export const deleteTemplate = (proj_id, templ_id) => dispatch =>
    ProjApi.deleteTemplate(proj_id, templ_id);
