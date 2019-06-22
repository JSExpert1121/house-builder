import {
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

import PropApi from '../api/proposal';
import ProjApi from '../api/project';
import ContApi from '../api/contractor';
import Axios   from 'axios';

export function setUserProfile(payload) {
  return { type: SET_USER_PROFILE, payload };
}

export const clearProposalDetail = () => {
  return {
    type: SET_DETAIL_PROPOSAL,
    payload: null,
  };
};

export const getProposalDetails = id => dispatch => {
  return PropApi.getDetail(id).then(data => {
    dispatch({ type: SET_DETAIL_PROPOSAL, payload: data });
    return data;
  });
};

export const setProposals4Compare = proposals => ({
  type: SET_PROPOSALS_COMPARE,
  payload: proposals,
});

export function getProposalData(id) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_SELECTED_PROPOSAL' });

    return Axios.get(process.env.REACT_APP_PROJECT_API + 'proposals/' + id)
      .then(res => {
        dispatch({ type: SET_SELECTED_PROPOSAL, payload: res.data });
      })
      .catch(err => {
        console.log(err.message);
      });
  };
}

export const submitProposal = (cont_id, pro_id, proposal) => dispatch =>
  PropApi.submit(cont_id, pro_id, proposal);
export const updateProposal = (prop_id, proposal) => dispatch =>
  PropApi.update(prop_id, proposal);
export const deleteProposal = prop_id => dispatch => PropApi.delete(prop_id);

export const getProposals = (cont_id, page, size, status) => dispatch => {
  ContApi.getProposals(cont_id, page, size, status).then(data => {
    dispatch({ type: PROPOSALS_LOADED, payload: data });
  });
};

export const addFilesToProposal = (id, files) => dispatch =>
  PropApi.addFiles(id, files);
export const deleteProposalFile = (id, name) => dispatch =>
  PropApi.deleteFile(id, name);

export const addOption = (propid, catid, option) => dispatch =>
  PropApi.addOption(propid, catid, option);
export const deleteOption = id => dispatch => PropApi.deleteOption(id);
export const updateOption = (id, option) => dispatch =>
  PropApi.updateOption(id, option);

export function getProposalsByProjectId(id, page, size) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_PROPOSALS' });
    return Axios.get(
      process.env.REACT_APP_PROJECT_API + 'projects/' + id + '/proposals',
      {
        params: {
          page: page,
          size: size,
        },
      }
    )
      .then(response => {
        dispatch({ type: PROPOSALS_LOADED, payload: response.data });
      })
      .catch(err => console.log(err.message));
  };
}

export const addProject = (cont_id, project) => dispatch =>
  ContApi.addProject(cont_id, project).then(data => data.id);
export const addFilesToProject = (id, files) => dispatch =>
  ProjApi.addFiles(id, files);
export const deleteProject = id => dispatch => ProjApi.delete(id);

export function getProjectData(id) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_SELECTED_PROJECT' });
    return Axios.get(process.env.REACT_APP_PROJECT_API + 'projects/' + id)
      .then(response => {
        dispatch({ type: PROJECT_DETAIL_LOADED, payload: response.data });
      })
      .catch(err => console.log(err.message));
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
        dispatch({ type: PROJECT_BIDDERS_LOADED, payload: response.data });
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
    dispatch({ type: 'CLEAR_PROPOSAL_MESSAGES' });
    return Axios.get(
      process.env.REACT_APP_PROJECT_API + 'messages/proposals/' + prop_id,
      {
        params: {
          page: page,
          size: size,
        },
      }
    )
      .then(res => {
        cb(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };
}

export function addMessageToProposal(prop_id, message, cb, cont_type) {
  return function(dispatch) {
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
  return function(dispatch) {
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
        dispatch({ type: SEARCH_FILTER_LOADED, payload: response.data });
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

export function setCurrentProject(id) {
  return function(dispatch) {
    dispatch({ type: SET_CURRENT_PROJECT, payload: id });
  };
}
