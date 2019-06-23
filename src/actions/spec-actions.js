import SpecApi from '../api/spec';

import {
  SPEC_CREATED,
  SPEC_DELETED,
  SPEC_LOADED,
  SPEC_SELECTED,
  SPEC_SET_PAGEINFO,
  SPEC_UPDATED,
  SPECS_LOADED,
} from '../constants/spec-action-types';

const SpecCreated = spec => ({
  type: SPEC_CREATED,
  payload: spec,
});

const SpecDeleted = () => ({
  type: SPEC_DELETED,
});

const SpecUpdated = spec => ({
  type: SPEC_UPDATED,
  payload: spec,
});

const SpecsLoaded = specs => ({
  type: SPECS_LOADED,
  payload: specs,
});

const SpecLoaded = spec => ({
  type: SPEC_LOADED,
  payload: spec,
});

const SetPageInfo = (pageNo, pageSize, totalPages, totalItems) => ({
  type: SPEC_SET_PAGEINFO,
  payload: { pageNo, pageSize, totalPages, totalItems },
});

export const SelectSpec = specid => ({
  type: SPEC_SELECTED,
  payload: specid,
});

export const CreateSpec = spec => dispatch => {
  return SpecApi.create(spec).then(res => {
    dispatch(SpecCreated(spec));
    return res.data;
  });
};

export const UpdateSpec = spec => dispatch => {
  return SpecApi.update(spec).then(res => {
    dispatch(SpecUpdated(spec));
    return res;
  });
};

export const DeleteSpec = specid => dispatch => {
  return SpecApi.delete(specid).then(res => {
    dispatch(SpecDeleted());
    return res;
  });
};

export const LoadSpecs = (pageNo, pageSize) => dispatch => {
  return SpecApi.loadPage(pageNo, pageSize).then(data => {
    dispatch(
      SetPageInfo(data.number, data.size, data.totalPages, data.totalElements)
    );
    dispatch(SpecsLoaded(data.content));
    return data.content;
  });
};

export const LoadSpec = specid => dispatch => {
  return SpecApi.load(specid).then(data => {
    dispatch(SpecLoaded(data));
    return data;
  });
};
