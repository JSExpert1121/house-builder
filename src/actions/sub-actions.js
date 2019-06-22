import { PROPOSALS_LOADED } from '../constants/sub-action-types';
import restAPI              from '../services';

export function getProposals(cont_id, page, row, filterStr) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_PROPOSALS' });
    return restAPI
      .get('contractors/' + cont_id + '/proposals', {
        params: {
          page: page,
          size: row,
          status: filterStr,
        },
      })
      .then(res => {
        const result = res.data;
        dispatch({ type: PROPOSALS_LOADED, payload: result });
      });
  };
}

export function getInvitedProjectsByGenId(id, page, rowSize) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_PROJECTS' });
    return restAPI
      .get('projects/invites/' + id, {
        params: {
          page: page,
          size: rowSize,
        },
      })
      .then(response =>
        dispatch({ type: 'INVITED_PROJECT_LOADED', payload: response.data })
      );
  };
}
