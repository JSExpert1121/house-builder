import {
	ADD_PROJECT,
	SET_CUR_TAB_POS,
	SET_SELECTED_PROPOSAL,
	ALL_PROJECT_LOADED,
	PROJECT_DETAIL_LOADED,
	BIDDERS_LOADED,
	PROJECT_FILES_LOADED,
	MESSAGE_LOADED
} from "../constants/action-types";

export function addProject(payload) {
	return { type: ADD_PROJECT, payload }
};

export function setCurTabPos(payload) {
	return { type: SET_CUR_TAB_POS, payload }
};

export function setSelectedProposal(payload) {
	return { type: SET_SELECTED_PROPOSAL, payload }
}

export function getAllProjects() {
	return function (dispatch) {
		dispatch({ type: "CLEAR_PROJECTS" });
		return fetch("https://bcbemock.getsandbox.com/projects")
			.then(response => response.json())
			.then(json => {
				dispatch({ type: ALL_PROJECT_LOADED, payload: json });
			})
	}
}

export function getProjectDetailById(id) {
	return function (dispatch) {
		return fetch("https://bcbemock.getsandbox.com/projects/p" + id)
			.then(response => response.json())
			.then(json => {
				dispatch({ type: PROJECT_DETAIL_LOADED, payload: json });
			})
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