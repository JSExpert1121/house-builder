import { SPECS_LOADED, SPEC_LOADED, SPEC_SELECTED, SPEC_UPDATED, SPEC_DELETED, SPEC_CREATED, SPEC_SET_PAGEINFO } from '../constants/spec-action-types';

const initialState = {
    specialties: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    currentSpecId: '',
    dirty: true
}

function spec_reducer(state = initialState, action) {
    switch (action.type) {
        case SPECS_LOADED:
            return { ...state, specialties: action.payload, dirty: false };
        case SPEC_LOADED:
            return state;
        case SPEC_SELECTED:
            return { ...state, currentSpecId: action.payload };
        case SPEC_UPDATED:
            return { ...state, dirty: true };
        case SPEC_DELETED:
            return { ...state, dirty: true };
        case SPEC_CREATED:
            return { ...state, dirty: true };
        case SPEC_SET_PAGEINFO:
            return {
                ...state,
                totalItems: action.payload.totalItems,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.pageNo,
                pageSize: action.payload.pageSize
            };
        default:
            return state;
    }
}

export default spec_reducer;