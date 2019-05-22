import {
	SET_SELECTED_PROPOSAL,
	ALL_PROJECT_LOADED,
	PROJECT_DETAIL_LOADED,
	BIDDERS_LOADED,
	PROJECT_FILES_LOADED,
	MESSAGE_LOADED
} from "../constants/gen-action-types";
import Axios from "axios";

export function setSelectedProposal(payload) {
	return { type: SET_SELECTED_PROPOSAL, payload }
}

export function getProjectsByGenId(id, page, rowSize) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_PROJECTS" });
		return Axios.get(process.env.PROJECT_API + "contractors/" + id + "/projects", {
			params: {
				"page": page,
				"size": rowSize
			}
		})
			.then(response => dispatch({ type: "PROJECT_LOADED", payload: response.data }))
			.catch(err => console.log(err.message))
	}
}

export function getAllProjects(page, size) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_ALL_PROJECTS" });
		return Axios.get(process.env.PROJECT_API + "projects", {
			params: {
				'page': page,
				'size': size
			}
		})
			.then(response => {
				dispatch({ type: ALL_PROJECT_LOADED, payload: response.data });
			})
			.catch(err => console.log(err))
	}
}

export function getProjectDetailById(id) {
	return function (dispatch) {
		return Axios.get(process.env.PROJECT_API + "projects/" + id)
			.then(response => {
				dispatch({ type: PROJECT_DETAIL_LOADED, payload: response.data })
			})
			.catch(err => console.log(err.message));
	}
}

export function getProjectBidders(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_BIDDERS" });
		return fetch("https://bcbemock.getsandbox.com/" + id + "/bidders")
			.then(response => response.json())
			.then(json => {
				dispatch({ type: BIDDERS_LOADED, payload: json });
			})
	}
}

export function getProjectMessage(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_MESSAGES" });
		return fetch("https://bcbemock.getsandbox.com/" + id + "/messages")
			.then(response => response.json())
			.then(json => {
				dispatch({ type: MESSAGE_LOADED, payload: json });
			})
	}
}

export function addProject(id, data, cb) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "contractors/" + id + "/projects", data)
			.then((response) => {
				cb(response.data.id);
			}).catch(err => {
				console.log(err.message);
				cb(false);
			});
	}
}

export function addFiles(id, files, cb) {
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

export function deleteFile(id, name, cb) {
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