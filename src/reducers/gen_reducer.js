import {
	ADD_PROJECT,
	SET_CUR_TAB_POS,
	SET_SELECTED_PROPOSAL,
	ALL_PROJECT_LOADED,
	PROJECT_DETAIL_LOADED,
	PROPOSALS_LOADED,
	PROJECT_FILES_LOADED,
	MESSAGE_LOADED,
	TEMPLATES_LOADED
} from "../constants/gen-action-types";

const initialState = {
	selectedProject: null,
	selectedProposal: null,
	messages: [],
	projects: null,
	allprojects: null,
	proposals: null,
	templates: null
};

function gen_reducer(state = initialState, action) {
	switch (action.type) {
		case SET_CUR_TAB_POS:
			return Object.assign({}, state, {
				curTabPos: action.payload
			});
		case SET_SELECTED_PROPOSAL:
			return Object.assign({}, state, {
				selectedProposal: action.payload
			});
		case PROPOSALS_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				proposals: action.payload
			});
		case "PROJECT_LOADED":
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				projects: action.payload
			});
		case ALL_PROJECT_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				allprojects: action.payload
			});
		case PROJECT_DETAIL_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				selectedProject: action.payload
			});
		case MESSAGE_LOADED:
			return Object.assign({}, state, {
				messages: action.payload
			});
		case "CLEAR_PROJECTS":
			return Object.assign({}, state, {
				projects: null,
			});
		case "CLEAR_ALL_PROJECTS":
			return Object.assign({}, state, {
				allprojects: null,
			});
		case "CLEAR_PROPOSALS":
			return Object.assign({}, state, {
				proposals: null,
			});
		case "CLEAR_TEMPLATES":
			return Object.assign({}, state, {
				templates: null,
			});
		case "CLEAR_MESSAGES":
			return Object.assign({}, state, {
				messages: [],
			});
		case "SET_SELECTED_NULL":
			return Object.assign({}, state, {
				selectedProject: {
					budget: "",
					description: "",
					title: ""
				}
			});
		case "CLEAR_SELECTED_PROPOSAL":
			return Object.assign({}, state, {
				selectedProposal: null
			});
		case TEMPLATES_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				templates: action.payload
			});
		default:
			return state;
	}
}

export default gen_reducer;