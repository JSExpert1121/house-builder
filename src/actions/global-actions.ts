import { createAction } from 'redux-actions';
import {
  CLEAR_PROPOSAL_MESSAGES,
  CLEAR_SELECTED_PROJECT,
  CLEAR_SELECTED_PROPOSAL,
  PROJECT_BIDDERS_LOADED,
  PROJECT_DETAIL_LOADED,
  PROPOSALS_LOADED,
  SEARCH_FILTER_LOADED,
  SET_CURRENT_PROJECT,
  SET_DETAIL_PROPOSAL,
  SET_PROPOSALS_COMPARE,
  SET_SELECTED_PROPOSAL,
  SET_USER_PROFILE,
} from '../constants/global-action-types';

import PropApi                 from '../api/proposal';
import ProjApi                 from '../api/project';
import ContApi                 from '../api/contractor';
import Axios                   from 'axios';
import { clearProposalAction } from './sub-actions';

export const setUserProfileAction = createAction(SET_USER_PROFILE);
export const setDetailProposalAction = createAction(SET_DETAIL_PROPOSAL);
export const setProposals4CompareAction = createAction(SET_PROPOSALS_COMPARE);
export const setSelectedProposalAction = createAction(SET_SELECTED_PROPOSAL);
export const clearSelectedProposalAction = createAction(
  CLEAR_SELECTED_PROPOSAL
);
export const loadedProposalsAction = createAction(PROPOSALS_LOADED);
export const clearSelectedProjectAction = createAction(CLEAR_SELECTED_PROJECT);
export const setLoadedProjectBiddersAction = createAction(
  PROJECT_BIDDERS_LOADED
);
export const clearProposalMessageAction = createAction(CLEAR_PROPOSAL_MESSAGES);
export const searchFilterLoadedAction = createAction(SEARCH_FILTER_LOADED);
export const setCurrentProjectAction = createAction(SET_CURRENT_PROJECT);

export function setCurrentProject(id) {
  return function(dispatch) {
    dispatch(setCurrentProjectAction(id));
  };
}

export const getProposalDetails = id => dispatch => {
  return PropApi.getDetail(id).then(data => {
    dispatch(setDetailProposalAction(data));
    return data;
  });
};
export function getProposalData(id) {
  return function(dispatch) {
    dispatch(clearSelectedProposalAction());
    return Axios.get(
      process.env.REACT_APP_PROJECT_API + 'proposals/' + id
    ).then(res => {
      dispatch(setSelectedProposalAction(res.data));
    });
  };
}

export const submitProposal = (cont_id, pro_id, proposal) => () =>
  PropApi.submit(cont_id, pro_id, proposal);

export const updateProposal = (prop_id, proposal) => () =>
  PropApi.update(prop_id, proposal);

export const deleteProposal = prop_id => () => PropApi.delete(prop_id);

export const getProposals = (cont_id, page, size, status) => dispatch => {
  ContApi.getProposals(cont_id, page, size, status).then(data => {
    dispatch(loadedProposalsAction(data));
  });
};

export const addFilesToProposal = (id, files) => () =>
  PropApi.addFiles(id, files);

export const deleteProposalFile = (id, name) => () =>
  PropApi.deleteFile(id, name);

export const addOption = (propid, catid, option) => () =>
  PropApi.addOption(propid, catid, option);

export const deleteOption = id => dispatch => PropApi.deleteOption(id);
export const updateOption = (id, option) => dispatch =>
  PropApi.updateOption(id, option);

export function getProposalsByProjectId(id, page, size) {
  return function(dispatch) {
    dispatch(clearProposalAction());
    return Axios.get(
      process.env.REACT_APP_PROJECT_API + 'projects/' + id + '/proposals',
      {
        params: {
          page: page,
          size: size,
        },
      }
    ).then(response => {
      dispatch(loadedProposalsAction(response.data));
    });
  };
}

export const addProject = (cont_id, project) => dispatch =>
  ContApi.addProject(cont_id, project).then(data => data.id);
export const addFilesToProject = (id, files) => dispatch =>
  ProjApi.addFiles(id, files);
export const deleteProject = id => dispatch => ProjApi.delete(id);

export function getProjectData(id) {
  return function(dispatch) {
    dispatch(clearSelectedProjectAction());
    return Axios.get(process.env.REACT_APP_PROJECT_API + 'projects/' + id).then(
      response => {
        dispatch({ type: PROJECT_DETAIL_LOADED, payload: response.data });
      }
    );
  };
}

export function getProjectBiddersData(id, page, size) {
  return function(dispatch) {
    return Axios.get(
      process.env.REACT_APP_PROJECT_API + 'projects/' + id + '/invites',
      {
        params: {
          page: page,
          size: size,
        },
      }
    )
      .then(response => {
        dispatch(setLoadedProjectBiddersAction(response.data));
      })
      .catch(err => console.log(err.message));
  };
}

export function deleteFileFromProject(id, name, cb) {
  return function(dispatch) {
    return Axios.delete(
      process.env.REACT_APP_PROJECT_API + 'projects/' + id + '/files/' + name
    )
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function getProposalMessages(prop_id, page, size, cb) {
  return function(dispatch) {
    dispatch(clearProposalMessageAction());
    return Axios.get(
      process.env.REACT_APP_PROJECT_API + 'messages/proposals/' + prop_id,
      {
        params: {
          page: page,
          size: size,
        },
      }
    ).then(res => {
      cb(res.data);
    });
  };
}

export function addMessageToProposal(prop_id, message, cb, cont_type) {
  return function() {
    return Axios.post(
      process.env.REACT_APP_PROJECT_API +
        'messages/proposals/' +
        prop_id +
        (cont_type === 's_cont' ? '/togencon' : '/tosubcon'),
      message
    )
      .then(res => {
        cb(res.data);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function addFileToPropMessage(msg_id, files, cb) {
  return function() {
    const formData = new FormData();
    files.forEach(async file => {
      await formData.append('file', file);
    });

    console.log('MESSAGE_ID', msg_id);
    return Axios.post(
      process.env.REACT_APP_PROJECT_API +
        'messages/' +
        msg_id +
        '/files/upload/multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
      .then(response => {
        cb(response.data);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function searchFilter(name, city, specialties) {
  return function(dispatch) {
    return Axios.post(
      process.env.REACT_APP_PROJECT_API + 'contractors/search',
      {
        data: {
          name: name,
          city: city,
          specialties: specialties,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => {
        dispatch(searchFilterLoadedAction(response.data));
      })
      .catch(err => console.log(err.message));
  };
}

export function inviteContractor(prop_id, subId, cb) {
  return function(dispatch) {
    return Axios.post(
      process.env.REACT_APP_PROJECT_API +
        'projects/' +
        prop_id +
        '/invite/' +
        subId
    )
      .then(res => {
        cb(res.data);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}
