import {
	ALL_PROJECT_LOADED,
	PROJECT_FILES_LOADED,
	TEMPLATES_LOADED,
	PROPOSALS_LOADED
} from "../constants/gen-action-types";
import Axios from "axios";

import ProjApi from '../api/project';

export function awardProject(id, cb) {
	return function (dispatch) {
		return Axios.put(process.env.PROJECT_API + "proposals/" + id, {
			"status": "AWARDED"
		})
			.then(response => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function getProjectsByGenId(id, page, rowSize) {
	return function (dispatch) {
		// dispatch({ type: "CLEAR_PROJECTS" });
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

export function getTemplates(page, size) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_TEMPLATES" });

		return Axios.get(process.env.PROJECT_API + "templates", {
			params: {
				"page": page,
				"size": size
			}
		})
			.then(response => {
				dispatch({ type: TEMPLATES_LOADED, payload: response.data })
			})
			.catch(err => console.log(err.message))
	}
}

export const addTemplate = (proj_id, templ_id) => dispatch => ProjApi.addTemplate(proj_id, templ_id);
export const deleteTemplate = (proj_id, templ_id) => dispatch => ProjApi.deleteTemplate(proj_id, templ_id);

export function updateProject(id) {
	return function (dispatch) {

		return Axios.get(process.env.PROJECT_API + "projects/" + id)
			.then(response => {
				dispatch({
					type: 'PROJECT_DETAIL_LOADED',
					payload: response.data
				})
			})
			.catch(err => console.log(err.message))
	}
}