import {
	SET_USER_PROFILE, SET_SELECTED_PROPOSAL,
	PROPOSALS_LOADED,
	PROJECT_DETAIL_LOADED,
	SET_DETAIL_PROPOSAL,
	PROPOSAL_MESSAGES_LOADED,
	SET_PROPOSALS_COMPARE
} from "../constants/global-action-types";

const initialState = {
	userProfile: null,
	proposals: null,
	proposalMessages: null,
	proposal: null,
	project: null,
	proposalDetail: null,
	compareProps: null
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
			return {
				...state,
				project: null
			}
		case "CLEAR_PROPOSALS":
		case "CLEAR_SELECTED_PROPOSAL":
			return {
				...state,
				proposal: null
			}
		case "CLEAR_PROPOSAL_MESSAGES":
			return {
				...state,
				proposalMessages: null
			}
		case SET_PROPOSALS_COMPARE:
			return {
				...state,
				compareProps: [...action.payload]
			}
		default:
			return state;
	}
}

export default global_reducer;