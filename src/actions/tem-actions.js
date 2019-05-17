import Axios from 'axios';

import { ALL_TEMPLATES_LOADED, SET_SELECTED_TEMPLATE, SET_SELECTED_CATEGORY, SET_SELECTED_OPTION } from '../constants/tem-action-types';

export function createTemplate(template) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_ALL_TEMPLATES" });

		return Axios.post(process.env.PROJECT_API + "templates", template)
			.then(response => {
			})
			.catch(err => console.log(err.message))
	}
}

export function selectTemplate(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_SELECTED_TEMPLATE" });

		return Axios.get(process.env.PROJECT_API + "templates/" + id)
			.then(response => {
				dispatch({
					type: SET_SELECTED_TEMPLATE,
					payload: response.data
				})
			})
			.catch(err => console.log(err.message))
	}
}

export function selectOption(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_SELECTED_OPTION" });

		return Axios.get(process.env.PROJECT_API + "options/" + id)
			.then(response => {
				dispatch({
					type: SET_SELECTED_OPTION,
					payload: response.data
				})
			})
			.catch(err => console.log(err.message))
	}
}

export function selectCategory(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_SELECTED_CATEGORY" });

		return Axios.get(process.env.PROJECT_API + "categories/" + id)
			.then(response => {
				dispatch({
					type: SET_SELECTED_CATEGORY,
					payload: response.data
				})
			})
			.catch(err => console.log(err.message))
	}
}

export function getTemplatesO(page, size) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_ALL_TEMPLATES" });

		return Axios.get(process.env.PROJECT_API + "templates", {
			params: {
				"page": page,
				"size": size
			}
		})
			.then(response => {
				dispatch({ type: ALL_TEMPLATES_LOADED, payload: response.data })
			})
			.catch(err => console.log(err.message))
	}
}

export function deleteTemplate(id, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "templates/" + id)
			.then(response => {
				cb(false);
			})
			.catch(err => {
				cb(true);
				console.log(err.message)
			})
	}
}

export function deleteCategory(id, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "categories/" + id)
			.then(response => {
				cb(false);
			})
			.catch(err => {
				console.log(err.message)
				cb(true);
			})
	}
}

export function deleteOption(id) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "options/" + id)
			.then(response => {
			})
			.catch(err => console.log(err.message))
	}
}

export function addCategory(id, data) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "templates/" + id + "/categories", data)
			.then(response => {

			}).catch(err => console.log(err.message))
	}
}

export function addOption(id, data) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "categories/" + id + "/options", data)
			.then(response => {

			}).catch(err => console.log(err.message))
	}
}

export function editOption(id, data) {
	return function (dispatch) {
		return Axios.put(process.env.PROJECT_API + "options/" + id, data)
			.then(response => {

			}).catch(err => console.log(err.message))
	}
}

export function editCategory(id, data) {
	return function (dispatch) {
		return Axios.put(process.env.PROJECT_API + "categories/" + id, data)
			.then(response => {

			}).catch(err => console.log(err.message))
	}
}

export function editTemplate(id, data) {
	return function (dispatch) {
		return Axios.put(process.env.PROJECT_API + "templates/" + id, data)
			.then(response => {

			}).catch(err => console.log(err.message))
	}
}