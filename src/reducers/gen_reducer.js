import {
	ADD_PROJECT,
	SET_CUR_TAB_POS,
	SET_SELECTED_PROPOSAL,
	ALL_PROJECT_LOADED,
	PROJECT_DETAIL_LOADED,
	BIDDERS_LOADED,
	PROJECT_FILES_LOADED,
	MESSAGE_LOADED
} from "../constants/gen-action-types";

import uuidv1 from "uuid";

const initialState = {
	selectedProject: null,
	projectFiles: [],
	selectedProposal: null,
	messages: [],
	projects: [],
	bidders: [],
	createProjectTemp: {
		id: uuidv1(),
		name: "Project",
		status: "Active",
		PH1: "Hello Project",
		PH2: "Hello Project",
		bidders: [
			{
				id: uuidv1(),
				name: "Ivan",
				price: 100,
				duration: 3,
				proposal: "I hate Generic Bid",
				subfiles: [
					"Screenshot1.jpg",
					"Screenshot2.jpg",
					"Screenshot3.jpg"
				]
			},
			{
				id: uuidv1(),
				name: "Windi",
				price: 200,
				duration: 5,
				proposal: "I hate Generic Bid",
				subfiles: [
					"Screenshot1.jpg",
					"Screenshot2.jpg",
					"Screenshot3.jpg"
				]
			}
		],
		files: [
			{
				id: uuidv1(),
				name: "File1.XXX",
				url: "XXX"
			},
			{
				id: uuidv1(),
				name: "File2.XXX",
				url: "XXX"
			},
			{
				id: uuidv1(),
				name: "File3.XXX",
				url: "XXX"
			}
		],
		messages: []
	}
};

function gen_reducer(state = initialState, action) {
	switch (action.type) {
		case ADD_PROJECT:
			return Object.assign({}, state, {
				projects: state.projects.concat(action.payload)
			});
		case SET_CUR_TAB_POS:
			return Object.assign({}, state, {
				curTabPos: action.payload
			});
		case SET_SELECTED_PROPOSAL:
			return Object.assign({}, state, {
				selectedProposal: action.payload
			});
		case BIDDERS_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				bidders: action.payload
			});
		case ALL_PROJECT_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				projects: action.payload
			});
		case PROJECT_DETAIL_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				selectedProject: action.payload
			});
		case PROJECT_FILES_LOADED:
			return Object.assign({}, state, {
				projectFiles: action.payload
			});
		case MESSAGE_LOADED:
			return Object.assign({}, state, {
				messages: action.payload
			});
		case "CLEAR_PROJECTS":
			return Object.assign({}, state, {
				projects: [],
			});
		case "CLEAR_BIDDERS":
			return Object.assign({}, state, {
				bidders: [],
			});
		case "CLEAR_FILES":
			return Object.assign({}, state, {
				projectFiles: [],
			});
		case "CLEAR_MESSAGES":
			return Object.assign({}, state, {
				messages: [],
			});
		default:
			return state;
	}
}

export default gen_reducer;