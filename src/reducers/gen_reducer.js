import {ALL_PROJECT_LOADED, PROJECT_LOADED, TEMPLATES_LOADED,} from '../constants/gen-action-types';

const initialState = {
  messages: [],
  projects: null,
  allprojects: null,
  templates: null,
};

function gen_reducer(state = initialState, action) {
  switch (action.type) {
    case PROJECT_LOADED:
      return Object.assign({}, state, {
        projects: action.payload,
      });
    case ALL_PROJECT_LOADED:
      return Object.assign({}, state, {
        //projects: state.projects.concat(action.payload)
        allprojects: action.payload,
      });
    case 'CLEAR_PROJECTS':
      return Object.assign({}, state, {
        projects: null,
      });
    case 'CLEAR_ALL_PROJECTS':
      return Object.assign({}, state, {
        allprojects: null,
      });
    case 'CLEAR_TEMPLATES':
      return Object.assign({}, state, {
        templates: null,
      });
    case 'CLEAR_MESSAGES':
      return Object.assign({}, state, {
        messages: [],
      });
    case TEMPLATES_LOADED:
      return Object.assign({}, state, {
        //projects: state.projects.concat(action.payload)
        templates: action.payload,
      });
    default:
      return state;
  }
}

export default gen_reducer;
