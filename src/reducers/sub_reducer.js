import { PROPOSALS_LOADED, SET_SELECTED_PROPOSAL } from '../constants/sub-action-types';

const initialState = {
	proposals: null
};

function sub_reducer(state = initialState, action) {
	switch (action.type) {
		case PROPOSALS_LOADED:
			return Object.assign({}, state, {
				proposals: action.payload
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