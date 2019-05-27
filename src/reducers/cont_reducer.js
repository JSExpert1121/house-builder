import {
	ALL_CONTRACTORS_LOADED, SET_SELECTED_CONTRACTOR,
	SET_SELECTED_CATEGORY, SET_SELECTED_OPTION,
	CONTRACTOR_DETAIL_LOADED, SPECIALTIES_LOADED
} from "../constants/cont-action-types";

const initialState = {
	contractors: null,
	selectedContractor: null,
	categories: null,
	selectedCategory: null,
	selectedOption: null,
	specialties: null,
	files: []
}

function tem_reducer(state = initialState, action) {
	switch (action.type) {
		case ALL_CONTRACTORS_LOADED:
			return Object.assign({}, state, {
				contractors: action.payload
			});
		case SET_SELECTED_CONTRACTOR:
			return Object.assign({}, state, {
				selectedContractor: action.payload
			});
		case SET_SELECTED_CATEGORY:
			return Object.assign({}, state, {
				selectedCategory: Object.assign({}, action.payload, {
					tem_name: state.selectedContractor
				})
			});
		case SET_SELECTED_OPTION:
			return Object.assign({}, state, {
				selectedOption: Object.assign({}, action.payload, {
					tem_name: state.selectedCategory.tem_name, 
					cat_name: state.selectedCategory
				})
			});
		case "CLEAR_ALL_CONTRACTORS":
			return Object.assign({}, state, {
				contractors: null,
			});
		case "CLEAR_SPECIALTIES":
			return Object.assign({}, state, {
				specialties: null,
			});
		case "CLEAR_SELECTED_CATEGORY":
			return Object.assign({}, state, {
				selectedCategory: {
					isLoading: true
				}
			});
		case "CLEAR_SELECTED_OPTION":
			return Object.assign({}, state, {
				selectedOption: {
					isLoading: true
				}
			});
		case "CLEAR_SELECTED_CONTRACTOR":
			return Object.assign({}, state, {
				selectedContractor: {
					isLoading: true
				}
			});
		case CONTRACTOR_DETAIL_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				selectedProject: action.payload,
				files: action.payload.contractorFiles.slice()
			});
		case SPECIALTIES_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				specialties: action.payload
			});			
		default:
			return state;
	}
}

export default tem_reducer;