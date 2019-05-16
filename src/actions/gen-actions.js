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

export function getProjectsByGenId(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_PROJECTS" });
		return fetch(process.env.PROJECT_API + "contractors/" + id + "/projects")
			.then(response => response.json())
			.then(json => {
				dispatch({ type: "PROJECT_LOADED", payload: json });
			})
	}
}

export function getAllProjects() {
	return function (dispatch) {
		dispatch({ type: "CLEAR_ALL_PROJECTS" });
		return fetch(process.env.PROJECT_API + "projects")
			.then(response => response.json())
			.then(json => {
				dispatch({ type: ALL_PROJECT_LOADED, payload: json });
			})
	}
}

export function getProjectDetailById(id) {
	return function (dispatch) {
		return Axios.get(process.env.PROJECT_API + "projects/" + id)
			.then(response => {
				console.log(response.data);
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

export function getProjectFiles(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_FILES" });
		return fetch("https://bcbemock.getsandbox.com/" + id + "/files")
			.then(response => response.json())
			.then(json => {
				dispatch({ type: PROJECT_FILES_LOADED, payload: json });
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