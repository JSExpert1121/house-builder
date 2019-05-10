import { SET_USER_PROFILE } from "../constants/global-action-types";

const initialState = {
	userProfile: null
}

function global_reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER_PROFILE:
			return Object.assign({}, state, {
				userProfile: action.payload
			});
		default:
			return state;
	}
}

export default global_reducer;