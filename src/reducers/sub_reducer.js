import { PROPOSALS_LOADED, SET_SELECTED_PROPOSAL } from '../constants/sub-action-types';

const initialState = {
	proposals: null,
	proposal: null
};

function sub_reducer(state = initialState, action) {
	switch (action.type) {
		case PROPOSALS_LOADED:
			return Object.assign({}, state, {
				proposals: action.payload
			});
		case SET_SELECTED_PROPOSAL:
			return Object.assign({}, state, {
				proposal: action.payload
			})
		case "CLEAR_SELECTED_PROPOSAL":
			return Object.assign({}, state, {
				proposal: null
			});
		case "CLEAR_PROPOSALS":
			return Object.assign({}, state, {
				proposals: null
			});
		default:
			return state;
	}
}

export default sub_reducer;