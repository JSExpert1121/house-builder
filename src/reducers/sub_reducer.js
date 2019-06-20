import {INVITED_PROJECT_LOADED, PROPOSALS_LOADED} from '../constants/sub-action-types';

const initialState = {
  proposals: null,
  projects: null,
};

function sub_reducer(state = initialState, action) {
  switch (action.type) {
    case PROPOSALS_LOADED:
      return Object.assign({}, state, {
        proposals: action.payload,
      });
    case INVITED_PROJECT_LOADED:
      return Object.assign({}, state, {
        projects: action.payload,
      });

    case 'CLEAR_PROPOSALS':
      return Object.assign({}, state, {
        proposals: null,
      });
    default:
      return state;
  }
}

export default sub_reducer;
