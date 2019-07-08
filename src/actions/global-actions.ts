import { allContractorsLoaded } from "actions/cont-actions";
import { createActions }        from 'redux-actions';

import {
  CLEAR_PROPOSAL_MESSAGES,
  CLEAR_SELECTED_PROJECT,
  CLEAR_SELECTED_PROPOSAL,
  PROJECT_BIDDERS_LOADED,
  PROJECT_DETAIL_LOADED,
  PROPOSALS_LOADED,
  SET_CURRENT_PROJECT,
  SET_DETAIL_PROPOSAL,
  SET_PROPOSALS_COMPARE,
  SET_SELECTED_PROPOSAL,
  SET_USER_PROFILE,
} from '../constants/global-action-types';

import PropApi from '../api/proposal';
import ProjApi from '../api/project';
import ContApi from '../api/contractor';
import Axios from 'axios';
import { clearProposals } from './sub-actions';

export const {
  clearProposalMessages,
  clearSelectedProject,
  clearSelectedProposal,
  projectBiddersLoaded,
  projectDetailLoaded,
  proposalsLoaded,
  setCurrentProject,
  setDetailProposal,
  setProposalsCompare,
  setSelectedProposal,
  setUserProfile,
} = createActions({
  [CLEAR_PROPOSAL_MESSAGES]: () => null,
  [CLEAR_SELECTED_PROJECT]: () => null,
  [CLEAR_SELECTED_PROPOSAL]: () => null,
  [PROJECT_BIDDERS_LOADED]: projectBidders => projectBidders,
  [PROJECT_DETAIL_LOADED]: project => project,
  [PROPOSALS_LOADED]: proposals => proposals,
  [SET_CURRENT_PROJECT]: currentProjectId => currentProjectId,
  [SET_DETAIL_PROPOSAL]: proposalDetail => proposalDetail,
  [SET_PROPOSALS_COMPARE]: compareProps => compareProps,
  [SET_SELECTED_PROPOSAL]: proposal => proposal,
  [SET_USER_PROFILE]: userProfile => userProfile,
});

export const getProposalDetails = id => dispatch => {
  return PropApi.getDetail(id).then(data => {
    dispatch(setDetailProposal(data));
    return data;
  });
};
export function getProposalData(id) {
  return function (dispatch) {
    dispatch(clearSelectedProposal());
    return Axios.get(
      process.env.REACT_APP_PROJECT_API + 'proposals/' + id
    ).then(res => {
      dispatch(setSelectedProposal(res.data));
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
    dispatch(proposalsLoaded(data));
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
  return function (dispatch) {
    dispatch(clearProposals());
    return Axios.get(
      process.env.REACT_APP_PROJECT_API + 'projects/' + id + '/proposals',
      {
        params: {
          page: page,
          size: size,
        },
      }
    ).then(response => {
      dispatch(proposalsLoaded(response.data));
    });
  };
}

export const addProject = (cont_id, project) => dispatch => ContApi.addProject(cont_id, project).then(data => data.id);
export const updateProject = (id, project) => dispatch => ProjApi.update(id, project);
export const addFilesToProject = (id, files) => dispatch => ProjApi.addFiles(id, files);
export const deleteProject = id => dispatch => ProjApi.delete(id);
export const archiveProject = id => dispatch => ProjApi.archive(id);

export function getProjectData(id) {
  return function (dispatch) {
    dispatch(clearSelectedProject());
    return Axios.get(process.env.REACT_APP_PROJECT_API + 'projects/' + id).then(
      response => {
        dispatch(projectDetailLoaded(response.data));
      }
    );
  };
}

export function getProjectBiddersData(id, page, size) {
  return function (dispatch) {
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
        dispatch(projectBiddersLoaded(response.data));
      })
      .catch(err => console.log(err.message));
  };
}

export const deleteFileFromProject = (id, name) => dispatch => ProjApi.deleteFile(id, name);
// export function deleteFileFromProject(id, name, cb) {
//   return function (dispatch) {
//     return Axios.delete(
//       process.env.REACT_APP_PROJECT_API + 'projects/' + id + '/files/' + name
//     )
//       .then(response => {
//         cb(true);
//       })
//       .catch(err => {
//         cb(false);
//         console.log(err.message);
//       });
//   };
// }

export function getProposalMessages(prop_id, page, size, cb) {
  return function (dispatch) {
    dispatch(clearProposalMessages());
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
  return function () {
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
  return function () {
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
  return function (dispatch) {
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
      .then(response => dispatch(allContractorsLoaded(response.data)))
  };
}

export function inviteContractor(prop_id, subId, cb) {
  return function (dispatch) {
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
