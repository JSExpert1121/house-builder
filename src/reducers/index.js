import { combineReducers } from 'redux';
import globalReducer       from './global_reducer';
import gen_reducer         from './gen_reducer';
import tem_reducer         from './tem_reducer';
import cont_reducer        from './cont_reducer';
import spec_reducer        from './spec_reducer';
import sub_reducer         from './sub_reducer';

export default combineReducers({
  global_data: globalReducer,
  gen_data: gen_reducer,
  tem_data: tem_reducer,
  cont_data: cont_reducer,
  spec_data: spec_reducer,
  sub_data: sub_reducer,
});
