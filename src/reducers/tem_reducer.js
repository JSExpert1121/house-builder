import { ALL_TEMPLATES_LOADED, SET_SELECTED_TEMPLATE, SET_SELECTED_CATEGORY } from "../constants/tem-action-types";

const initialState = {
	templates: null,
	selectedTemplate: null,
	categories: null,
	selectedCategory: null
}

function tem_reducer(state = initialState, action) {
	switch (action.type) {
		case ALL_TEMPLATES_LOADED:
			return Object.assign({}, state, {
				templates: action.payload
			});
		case SET_SELECTED_TEMPLATE:
			return Object.assign({}, state, {
				selectedTemplate: action.payload
			});
		case SET_SELECTED_CATEGORY:
			return Object.assign({}, state, {
				selectedCategory: action.payload
			});
		case "CLEAR_ALL_TEMPLATES":
			return Object.assign({}, state, {
				templates: null,
			});
		case "CLEAR_SELECTED_CATEGORY":
			return Object.assign({}, state, {
				selectedCategory: {
					isLoading: true
				}
			});
		case "CLEAR_SELECTED_TEMPLATE":
			return Object.assign({}, state, {
				selectedTemplate: {
					isLoading: true
				}
			});
		default:
			return state;
	}
}

export default tem_reducer;