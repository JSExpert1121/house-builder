import {
	ADD_PROJECT,
	SET_CUR_TAB_POS,
	SET_SELECTED_PROPOSAL,
	ALL_PROJECT_LOADED,
	PROJECT_DETAIL_LOADED,
	BIDDERS_LOADED,
	PROJECT_FILES_LOADED,
	MESSAGE_LOADED,
	SET_TEMP_VIEW_TAB,
	ALL_TEMPLATES_LOADED
} from "../constants/gen-action-types";

export function addProject(payload) {
	return { type: ADD_PROJECT, payload }
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

export function setTempViewTab(payload) {
	return { type: SET_TEMP_VIEW_TAB, payload }
}

export function getAllTemplates() {
	return function (dispatch) {
		dispatch({ type: "CLEAR_TEMPLATES" });
		return fetch("https://bcbe-service.herokuapp.com/templates", {
			headers: {
				"Content-Type": "application/hal+json"
			}
		})
			.then(response => response.json())
			.then(json => {
				dispatch({ type: ALL_TEMPLATES_LOADED, payload: json });
			})
	}
}