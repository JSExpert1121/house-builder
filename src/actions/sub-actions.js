import restAPI                                     from '../services';
import { createAction }                            from 'redux-actions';
import { loadedProposalsAction }                   from './global-actions';
import { clearProjectsAction }                     from './gen-actions';
import { CLEAR_PROPOSALS, INVITED_PROJECT_LOADED } from '../constants/sub-action-types';

export const clearProposalAction = createAction(CLEAR_PROPOSALS);
export const loadedInvitedProjectAction = createAction(INVITED_PROJECT_LOADED);

export function getProposals(cont_id, page, row, filterStr) {
  return function(dispatch) {
    dispatch(clearProposalAction());
    return restAPI
      .get('contractors/' + cont_id + '/proposals', {
        params: {
          page: page,
          size: row,
          status: filterStr,
        },
      })
      .then(res => dispatch(loadedProposalsAction(res.data)));
  };
}
export function getInvitedProjectsByGenId(id, page, rowSize) {
  return function(dispatch) {
    dispatch(clearProjectsAction);
    return restAPI
      .get('projects/invites/' + id, {
        params: {
          page: page,
          size: rowSize,
        },
      })
      .then(response => dispatch(loadedInvitedProjectAction(response.data)));
  };
}
