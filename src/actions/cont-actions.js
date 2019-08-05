import { createActions } from 'redux-actions';
import {
	ALL_CONTRACTORS_LOADED,
	CLEAR_ALL_CONTRACTORS,
	CLEAR_SELECTED_CONTRACTOR,
	CLEAR_SELECTED_OPTION,
	CLEAR_SPECIALTIES,
	CONTRACTOR_DETAIL_LOADED,
	SET_SELECTED_CONTRACTOR,
	SPECIALTIES_LOADED,
} from '../constants/cont-action-types';

import ContApi from '../api/contractor';
import SpecApi from '../api/spec';
import restAPI from '../services';

export const {
	allContractorsLoaded,
	clearAllContractors,
	clearSelectedContractor,
	clearSelectedOption,
	clearSpecialties,
	contractorDetailLoaded,
	setSelectedContractor,
	specialtiesLoaded,
} = createActions({
	[ALL_CONTRACTORS_LOADED]: contractors => contractors,
	[CLEAR_ALL_CONTRACTORS]: () => null,
	[CLEAR_SELECTED_CONTRACTOR]: () => null,
	[CLEAR_SELECTED_OPTION]: () => null,
	[CLEAR_SPECIALTIES]: () => null,
	[CONTRACTOR_DETAIL_LOADED]: (response) => response,
	[SET_SELECTED_CONTRACTOR]: contractor => contractor,
	[SPECIALTIES_LOADED]: specialties => specialties,
});


export const createContractor = contractor => dispatch => ContApi.createContractor(contractor);
export const deleteContractor = id => dispatch => ContApi.deleteContractor(id);
export const selectContractor = id => dispatch => {
	dispatch(clearSelectedContractor());
	return ContApi.selectContractor(id).then(data => {
		dispatch({
			type: SET_SELECTED_CONTRACTOR,
			payload: data,
		});
	});
};
export const updateContractor = id => dispatch => {
	return ContApi.selectContractor(id).then(data => {
		dispatch({
			type: SET_SELECTED_CONTRACTOR,
			payload: data,
		});
	});
}

export const getContractors = (page, size) => dispatch => {
	dispatch(clearAllContractors());
	return ContApi.getContractors(page, size).then(data => {
		dispatch(allContractorsLoaded(data));
	});
}
export const getContractorDetailById = id => dispatch => {
	return ContApi.getContractorById(id).then(data => {
		dispatch(contractorDetailLoaded(data));
	});
};

export const uploadFiles = (id, files) => dispatch => ContApi.uploadFiles(id, files);
export const removeFile = (id, name) => dispatch => ContApi.deleteFile(id, name);

export const approveContractor = (id, data) => dispatch => ContApi.approve(id, data);
export const rejectContractor = (id, data) => dispatch => ContApi.approve(id, data);

export const addSpecialty = (contid, specid) => dispatch => restAPI.post('contractors/' + contid + '/specialties/' + specid);
export const deleteSpecialty = (contid, specid) => dispatch => restAPI.delete('contractors/' + contid + '/specialties/' + specid);
export const getSpecialties = (page, size) => dispatch => SpecApi.loadPage(page, size).then(data => {
	dispatch(specialtiesLoaded(data));
});

export const searchContractors = (name, city, specialties) => dispatch => {
	return ContApi.search(name, city, specialties).then(data => {
		dispatch(allContractorsLoaded(data));
	});
}

