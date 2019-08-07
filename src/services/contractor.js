import Axios from 'axios';

const CONT_API_PATH = process.env.REACT_APP_PROJECT_API + 'contractors/';

export default {
	// create, select, delete contractor
	createContractor: contractor => Axios.post(CONT_API_PATH, contractor),
	selectContractor: id => Axios.get(CONT_API_PATH + id).then(res => res.data),
	deleteContractor: id => Axios.delete(CONT_API_PATH + id),

	// approve/reject contractor
	approve: (id, data) => Axios.post(CONT_API_PATH + id, data),


	// get contractor information
	getContractors: (page, size) => Axios.get(CONT_API_PATH, {
		params: { page, size }
	}).then(res => res.data),
	search: (name, city, specialties) => Axios.post(CONT_API_PATH + 'search', {
		name, city, specialties
	}).then(res => res.data),
	getContractorById: id => dispatch => Axios.get(CONT_API_PATH + id).then(res => res.data),

	// upload/delete file
	uploadFiles: (id, files) => {
		const formData = new FormData();
		files.forEach(async file => {
			formData.append('file', file);
		});
		return Axios.post(CONT_API_PATH + id + '/files/upload/multiple', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	},
	deleteFile: (id, name) => Axios.delete(CONT_API_PATH + id + '/files/' + name),

	// specialty
	addSpecialty: (id, specid) => Axios.post(CONT_API_PATH + id + '/specialties/' + specid),
	deleteSpecialty: (id, specid) => Axios.delete(CONT_API_PATH + id + '/specialties/' + specid),

	// general contractor
	addProject: (id, project) => Axios.post(CONT_API_PATH + id + '/projects', project).then(res => res.data),
	getProjects: (id, page, size, status) => Axios.get(CONT_API_PATH + id + '/projects', {
		params: { page, size, status },
	}).then(res => res.data),

	// sub contractor
	getProposals: (id, page, size, status) => Axios.get(CONT_API_PATH + id + '/proposals', {
		params: { page, size, status }
	}).then(res => res.data),
	getInvitedProjects: (id, page, size) => Axios.get(process.env.REACT_APP_PROJECT_API + 'projects/invites/' + id, {
		params: { page, size }
	}).then(res => res.data),
};
