import {
	SET_USER_PROFILE, SET_SELECTED_PROPOSAL,
	SET_REDIRECT_TO, PROPOSALS_LOADED,
	PROJECT_DETAIL_LOADED,
	PROPOSAL_MESSAGES_LOADED
} from '../constants/global-action-types'

import Axios from 'axios';

export function setUserProfile(payload) {
	return { type: SET_USER_PROFILE, payload }
}

export function getProposalData(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_SELECTED_PROPOSAL" });

		return Axios.get(process.env.PROJECT_API + 'proposals/' + id)
			.then(res => {
				dispatch({ type: SET_SELECTED_PROPOSAL, payload: res.data });
			})
			.catch(err => {
				console.log(err.message);
			})
	}
}

export function deleteProposal(pro_id, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + 'proposals/' + pro_id)
			.then(res => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function addFilesToProposal(id, files, cb) {
	return function (dispatch) {
		const formData = new FormData();
		files.forEach(async (file) => {
			await formData.append('file', file);
		});

		return Axios.post(process.env.PROJECT_API + "proposals/" + id + "/files/upload/multiple",
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message);
			});
	}
}

export function deleteProposalFile(id, name, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "proposals/" + id + "/files/" + name)
			.then(response => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function getProposalsByProjectId(id, page, size) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_PROPOSALS" });
		return Axios.get(process.env.PROJECT_API + "projects/" + id + "/proposals", {
			params: {
				"page": page,
				"size": size
			}
		})
			.then((response) => {
				dispatch({ type: PROPOSALS_LOADED, payload: response.data });
			})
			.catch(err => console.log(err.message))
	}
}

export function deleteProject(id, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "projects/" + id)
			.then(response => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function getProjectData(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_SELECTED_PROJECT" });
		return Axios.get(process.env.PROJECT_API + "projects/" + id)
			.then(response => {
				dispatch({ type: PROJECT_DETAIL_LOADED, payload: response.data })
			})
			.catch(err => console.log(err.message));
	}
}

export function deleteFileFromProject(id, name, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "projects/" + id + "/files/" + name)
			.then((response) => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function addFilesToProject(id, files, cb) {
	return function (dispatch) {
		const formData = new FormData();
		files.forEach(async (file) => {
			await formData.append('file', file);
		});

		return Axios.post(process.env.PROJECT_API + "projects/" + id + "/files/upload/multiple",
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				cb(true);
				console.log(response);
			}).catch(err => {
				cb(false);
				console.log(err.message);
			});
	}
}

export function submitProposal(cont_id, pro_id, proposal, cb) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "contractors/" + cont_id + "/projects/" + pro_id + "/proposals", proposal)
			.then(async (response) => {
				cb(response.data.id);
			})
			.catch(err => {
				cb(false);
				console.log(err.message)
			});
	}
}

export function getProposalMessages(prop_id, page, cb) {
	return function (dispatch) {
		dispatch({ type: 'CLEAR_PROPOSAL_MESSAGES' });
		return Axios.get(process.env.PROJECT_API + "messages/proposals/" + prop_id, {
			params: {
				'page': page,
				'size': 20,
			}
		})
			.then(res => {
				//dispatch({ type: PROPOSAL_MESSAGES_LOADED, payload: res.data });
				cb(res.data);
			})
			.catch(err => {
				cb(null);
				console.log(err.message);
			})
	}
}

export function addMessageToProposal(prop_id, message, cb, cont_type) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "messages/proposals/" +
			prop_id + (cont_type === 's_cont' ? '/togencon' : '/tosubcon'), message).then(res => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}