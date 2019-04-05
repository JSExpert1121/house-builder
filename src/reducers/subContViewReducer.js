import { ADD_REPORT } from "../constants/action-types";

const initialState = {
	reports: [

	]
};

function subContViewReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_REPORT:
			return Object.assign({}, state, {
				projects: state.projects.concat(action.payload)
			});
		default:
			return state;
	}
}

export default subContViewReducer;