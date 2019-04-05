import { combineReducers } from 'redux';
import genContViewReducer from './genContViewReducer';
import subContViewReducer from './subContViewReducer';

/*const appReducer = asyncReducers =>
	combineReducers({
		genContViewData: genContViewReducer,
		subContViewData: subContViewReducer,
		...asyncReducers,
	});

function rootReducer(asyncReducers) {
	return appReducer(asyncReducers);
}

export default rootReducer;*/

export default combineReducers({
	genContViewData: genContViewReducer,
	subContViewData: subContViewReducer
});