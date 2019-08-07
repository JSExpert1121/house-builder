import TempApi from 'services/template';
import {
	ALL_TEMPLATES_LOADED,
	SET_SELECTED_CATEGORY,
	SET_SELECTED_OPTION,
	SET_SELECTED_TEMPLATE,
	CLEAR_SELECTED_TEMPLATE
} from '../constants/tem-action-types';
import { clearSelectedOption } from './cont-actions';
import { createActions } from "redux-actions";
import { CLEAR_SELECTED_CATEGORY } from "../constants/cont-action-types";

const {
	allTemplatesLoaded,
	setSelectedCategory,
	setSelectedOption,
	setSelectedTemplate,
	clearSelectedTemplate,
} = createActions({
	[ALL_TEMPLATES_LOADED]: (templates) => templates,
	[SET_SELECTED_CATEGORY]: (data) => data,
	[SET_SELECTED_OPTION]: (selectedOption) => selectedOption,
	[SET_SELECTED_TEMPLATE]: (selectedTemplate) => selectedTemplate,
	[CLEAR_SELECTED_TEMPLATE]: () => null,
});

export const createTemplate = template => dispatch => TempApi.create(template);

export const selectTemplate = id => dispatch => {
	dispatch(clearSelectedTemplate());
	return TempApi.getById(id).then(data => {
		dispatch(setSelectedTemplate(data));
	});
}

export const selectCategory = id => dispatch => {
	dispatch({ type: CLEAR_SELECTED_CATEGORY });
	return TempApi.getCatById(id).then(data => {
		dispatch(setSelectedCategory(data));
	})
}

export const selectOption = id => dispatch => {
	dispatch(clearSelectedOption());
	return TempApi.getOptById(id).then(data => {
		dispatch(setSelectedOption(data));
	})
}

export const getTemplates = (page, size) => dispatch => TempApi.get(page, size).then(data => {
	dispatch(allTemplatesLoaded(data));
});

export const deleteTemplate = id => dispatch => TempApi.delete(id);
export const deleteCategory = id => dispatch => TempApi.deleteCategory(id);
export const deleteOption = id => dispatch => TempApi.deleteOption(id);

export const addCategory = (id, data) => dispatch => TempApi.addCat(id, data);
export const addOption = (id, data) => dispatch => TempApi.addOpt(id, data);

export const editTemplate = (id, data) => dispatch => TempApi.editTemplate(id, data);
export const editCategory = (id, data) => dispatch => TempApi.editCategory(id, data);
export const editOption = (id, data) => dispatch => TempApi.editOption(id, data);
