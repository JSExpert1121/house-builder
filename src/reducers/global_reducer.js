import {
	SET_USER_PROFILE, SET_SELECTED_PROPOSAL,
	SET_REDIRECT_TO, PROPOSALS_LOADED,
	PROJECT_DETAIL_LOADED,
	SET_DETAIL_PROPOSAL,
	PROPOSAL_MESSAGES_LOADED
} from "../constants/global-action-types";

const initialState = {
	userProfile: null,
	proposals: null,
	proposalMessages: null,
	proposal: null,
	project: null,
	proposalDetail: null
}

function global_reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER_PROFILE:
			return Object.assign({}, state, {
				userProfile: action.payload
			});
		case SET_DETAIL_PROPOSAL:
			return {
				...state,
				proposalDetail: action.payload
			}
		case SET_SELECTED_PROPOSAL:
			return Object.assign({}, state, {
				proposal: action.payload
			});
		case PROPOSALS_LOADED:
			return Object.assign({}, state, {
				proposals: action.payload
			});
		case PROJECT_DETAIL_LOADED:
			return Object.assign({}, state, {
				project: action.payload
			});
		case PROPOSAL_MESSAGES_LOADED:
			return Object.assign({}, state, {
				proposalMessages: action.payload
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
		case "CLEAR_PROPOSAL_MESSAGES":
			return Object.assign({}, state, {
				proposalMessages: null
			});
		default:
			return state;
	}
}

export default global_reducer;