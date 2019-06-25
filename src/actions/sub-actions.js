import restAPI                                    from '../services';
import {createActions}                            from 'redux-actions';
import {proposalsLoaded}                          from './global-actions';
import {clearProjects}                            from './gen-actions';
import {CLEAR_PROPOSALS, INVITED_PROJECT_LOADED,} from '../constants/sub-action-types';

export const {clearProposals, invitedProjectLoaded} = createActions({
  [CLEAR_PROPOSALS]: () => null,
  [INVITED_PROJECT_LOADED]: () => null,
});

export function getProposals(cont_id, page, row, filterStr) {
  return function (dispatch) {
    dispatch(clearProposals());
    return restAPI
        .get('contractors/' + cont_id + '/proposals', {
          params: {
            page: page,
            size: row,
            status: filterStr,
          },
        })
        .then(res => dispatch(proposalsLoaded(res.data)));
  };
}

export function getInvitedProjectsByGenId(id, page, rowSize) {
  return function (dispatch) {
    dispatch(clearProjects);
    return restAPI
        .get('projects/invites/' + id, {
          params: {
            page: page,
            size: rowSize,
          },
        })
        .then(response => dispatch(invitedProjectLoaded(response.data)));
  };
}
