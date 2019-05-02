import {
	SET_TEMP_VIEW_TAB, ALL_TEMPLATES_LOADED
} from "../constants/action-types";

import uuidv1 from "uuid";

const initialState = {
	curTabPos: 0,
	templates: []
};

function tempViewReducer(state = initialState, action) {
	switch (action.type) {
		case SET_TEMP_VIEW_TAB:
			return Object.assign({}, state, {
				curTabPos: action.payload
			});
		case ALL_TEMPLATES_LOADED:
			return Object.assign({}, state, {
				templates: action.payload,
			});
		case "CLEAR_TEMPLATES":
			return Object.assign({}, state, {
				templates: [],
			});
		default:
			return state;
	}
}

export default tempViewReducer;