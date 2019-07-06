import {
  ALL_CONTRACTORS_LOADED,
  CLEAR_ALL_CONTRACTORS,
  CLEAR_SELECTED_CATEGORY,
  CLEAR_SELECTED_CONTRACTOR,
  CLEAR_SELECTED_OPTION,
  CLEAR_SPECIALTIES,
  CONTRACTOR_DETAIL_LOADED,
  SET_SELECTED_CATEGORY,
  SET_SELECTED_CONTRACTOR,
  SET_SELECTED_OPTION,
  SPECIALTIES_LOADED,
} from '../constants/cont-action-types';
import { handleActions } from 'redux-actions';

const initialState = {
  contractors: null,
  selectedContractor: null,
  categories: null,
  selectedCategory: null,
  selectedOption: null,
  specialties: null,
  files: [],
};

const templateReducer = handleActions(
  {
    [ALL_CONTRACTORS_LOADED]: (state, action) => ({
      ...state,
      contractors: action.payload,
    }),
    [CLEAR_ALL_CONTRACTORS]: (state, action) => ({
      ...state,
      contractors: action.payload,
    }),
    [CLEAR_SELECTED_CATEGORY]: (state, action) => ({
      ...state,
      selectedCategory: {
        isLoading: true,
      },
    }),
    [CLEAR_SELECTED_CONTRACTOR]: (state, action) => ({
      ...state,
      selectedContractor: action.payload,
    }),
    [CLEAR_SELECTED_OPTION]: (state, action) => ({
      ...state,
      selectedOption: action.payload,
    }),
    [CLEAR_SPECIALTIES]: (state, action) => ({
      ...state,
      specialties: action.payload,
    }),
    [CONTRACTOR_DETAIL_LOADED]: (state, action) => console.log('#xxx',action.payload) || ({
      ...state,
      selectedProject: action.payload.selectedProject,
      files: action.payload.contractorFiles.slice(),
    }),
    [SET_SELECTED_CATEGORY]: (state, action) => ({
      ...state,
      selectedCategory: Object.assign({}, action.payload, {
        tem_name: state.selectedContractor,
      }),
    }),
    [SET_SELECTED_CONTRACTOR]: (state, action) => ({
      ...state,
      selectedContractor: action.payload,
    }),
    [SET_SELECTED_OPTION]: (state, action) => ({
      ...state,
      selectedOption: Object.assign({}, action.payload, {
        tem_name: state.selectedCategory.tem_name,
        cat_name: state.selectedCategory,
      }),
    }),
    [SPECIALTIES_LOADED]: (state, action) => ({ ...state, specialties: action.payload }),
  },
  initialState
);

export default templateReducer;
