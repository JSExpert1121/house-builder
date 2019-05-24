import Axios from 'axios';

import { ALL_CONTRACTORS_LOADED, SET_SELECTED_CONTRACTOR, SET_SELECTED_CATEGORY, SET_SELECTED_OPTION, SPECIALTIES_LOADED } from '../constants/cont-action-types';

export function createCONTRACTOR(contractor, cb) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_ALL_CONTRACTORS" });

		return Axios.post(process.env.PROJECT_API + "contractors", contractor)
			.then(response => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function selectContractor(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_SELECTED_CONTRACTOR" });

		return Axios.get(process.env.PROJECT_API + "contractors/" + id)
			.then(response => {
				dispatch({
					type: SET_SELECTED_CONTRACTOR,
					payload: response.data
				})
			})
			.catch(err => console.log(err.message))
	}
}

export function updateContractor(id) {
	return function (dispatch) {

		return Axios.get(process.env.PROJECT_API + "contractors/" + id)
			.then(response => {
				dispatch({
					type: SET_SELECTED_CONTRACTOR,
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

export function getContrators0(page, size) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_ALL_CONTRACTORS" });

		return Axios.get(process.env.PROJECT_API + "contractors", {
			params: {
				"page": page,
				"size": size
			}
		})
			.then(response => {
				dispatch({ type: ALL_CONTRACTORS_LOADED, payload: response.data })
			})
			.catch(err => console.log(err.message))
	}
}

export function deleteContractor(id, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "contractors/" + id)
			.then(response => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message)
			})
	}
}

export function deleteCategory(id, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "categories/" + id)
			.then(response => {
				cb(true);
			})
			.catch(err => {
				console.log(err.message)
				cb(false);
			})
	}
}

export function deleteOption(id, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "options/" + id)
			.then(response => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function addCategory(id, data, cb) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "contractors/" + id + "/categories", data)
			.then(response => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function addOption(id, data, cb) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "categories/" + id + "/options", data)
			.then(response => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function editOption(id, data, cb) {
	return function (dispatch) {
		return Axios.put(process.env.PROJECT_API + "options/" + id, data)
			.then(response => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message)
			})
	}
}

export function editCategory(id, data, cb) {
	return function (dispatch) {
		return Axios.put(process.env.PROJECT_API + "categories/" + id, data)
			.then(response => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message)
			})
	}
}

export function editContractor(id, data, cb) {
	return function (dispatch) {
		return Axios.put(process.env.PROJECT_API + "contractors/" + id, data)
			.then(response => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message)
			})
	}
}


export function addFiles(id, files, cb) {
	return function (dispatch) {
		const formData = new FormData();
		files.forEach(async (file) => {
			await formData.append('file', file);
		});
		return Axios.post(process.env.PROJECT_API + "contractors/" + id + "/files/upload/multiple",
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

export function getContractorDetailById(id) {
	return function (dispatch) {
		return Axios.get(process.env.PROJECT_API + "contractors/" + id)
			.then(response => {
				dispatch({ type: CONTRACTOR_DETAIL_LOADED, payload: response.data })
			})
			.catch(err => console.log(err.message));
	}
}

export function deleteFile(id, name, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API + "contractors/" + id + "/files/" + name)
			.then((response) => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function approveContractor(id, data, cb) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "contractors/" + id, data)
			.then(response => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function rejectContractor(id, data, cb) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "contractors/" + id, data)
			.then(response => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function getSpecialties(page, size) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_SPECIALTIES" });

			return Axios.get(process.env.PROJECT_API + "specialties", {
				params: {
					"page": page,
					"size": size
				}
			})
			.then(response => {
				dispatch({ type: SPECIALTIES_LOADED, payload: response.data })
			})
			.catch(err => console.log(err.message))
	}
}

export function addSpecialty(contractorId, specialtyId, cb) {
	return function (dispatch) {
		return Axios.post(process.env.PROJECT_API + "contractors/" + contractorId + "/specialties/" + specialtyId)
			.then(response => {
				cb(true);
			}).catch(err => {
				cb(false);
				console.log(err.message);
			})
	}
}

export function deleteSpecialty(contractorId, specialtyId, cb) {
	return function (dispatch) {
		return Axios.delete(process.env.PROJECT_API +"contractors/" + contractorId + "/specialties/" + specialtyId)
			.then(response => {
				cb(true);
			})
			.catch(err => {
				cb(false);
				console.log(err.message)
			})
	}
}