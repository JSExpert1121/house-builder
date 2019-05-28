import {
	PROPOSALS_LOADED, SET_SELECTED_PROPOSAL
} from '../constants/sub-action-types';

import Axios from 'axios';

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

export function getProposals(cont_id, page, row, filterStr) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_PROPOSALS" });
		return Axios.get(process.env.PROJECT_API + 'contractors/' + cont_id + '/proposals', {
			params: {
				'page': page,
				'size': row
			}
		})
			.then(res => {
				const result = res.data;
				console.log(result);
				//result.content = result.content.filter(cont => cont.status === filterStr);
				dispatch({ type: PROPOSALS_LOADED, payload: result });
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