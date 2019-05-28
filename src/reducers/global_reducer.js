import {
	SET_USER_PROFILE, SET_SELECTED_PROPOSAL,
	SET_REDIRECT_TO, PROPOSALS_LOADED,
	PROJECT_DETAIL_LOADED
} from "../constants/global-action-types";

const initialState = {
	userProfile: null,
	proposals: null,
	proposal: null,
	project: null,
	redirectTo: null
}

function global_reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER_PROFILE:
			return Object.assign({}, state, {
				userProfile: action.payload
			});
		case SET_SELECTED_PROPOSAL:
			return Object.assign({}, state, {
				proposal: action.payload
			});
		case SET_REDIRECT_TO:
			return Object.assign({}, state, {
				redirectTo: action.payload
			});
		case PROPOSALS_LOADED:
			return Object.assign({}, state, {
				proposals: action.payload
			});
		case PROJECT_DETAIL_LOADED:
			return Object.assign({}, state, {
				project: action.payload
			});
		case "CLEAR_SELECTED_PROJECT":
			return Object.assign({}, state, {
				project: null
			})
		case "CLEAR_PROPOSALS":
			return Object.assign({}, state, {
				proposals: null
			});
		case "CLEAR_SELECTED_PROPOSAL":
			return Object.assign({}, state, {
				proposal: null
			});
		default:
			return state;
	}
}

export default global_reducer;