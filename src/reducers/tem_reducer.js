import {
  ALL_TEMPLATES_LOADED,
  SET_SELECTED_CATEGORY,
  SET_SELECTED_OPTION,
  SET_SELECTED_TEMPLATE,
} from '../constants/tem-action-types';

const initialState = {
  templates: null,
  selectedTemplate: null,
  categories: null,
  selectedCategory: null,
  selectedOption: null,
};

function tem_reducer(state = initialState, action) {
  switch (action.type) {
    case ALL_TEMPLATES_LOADED:
      return Object.assign({}, state, {
        templates: action.payload,
      });
    case SET_SELECTED_TEMPLATE:
      return Object.assign({}, state, {
        selectedTemplate: action.payload,
      });
    case SET_SELECTED_CATEGORY:
      return Object.assign({}, state, {
        selectedCategory: Object.assign({}, action.payload, {
          tem_name: state.selectedTemplate,
        }),
      });
    case SET_SELECTED_OPTION:
      return Object.assign({}, state, {
        selectedOption: Object.assign({}, action.payload, {
          tem_name: state.selectedCategory.tem_name,
          cat_name: state.selectedCategory,
        }),
      });
    case 'CLEAR_ALL_TEMPLATES':
      return Object.assign({}, state, {
        templates: null,
      });
    case 'CLEAR_SELECTED_CATEGORY':
      return Object.assign({}, state, {
        selectedCategory: {
          isLoading: true,
        },
      });
    case 'CLEAR_SELECTED_OPTION':
      return Object.assign({}, state, {
        selectedOption: {
          isLoading: true,
        },
      });
    case 'CLEAR_SELECTED_TEMPLATE':
      return Object.assign({}, state, {
        selectedTemplate: {
          isLoading: true,
        },
      });
    default:
      return state;
  }
}

export default tem_reducer;
