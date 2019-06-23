import { createAction } from 'redux-actions';
import {
  ALL_CONTRACTORS_LOADED,
  CLEAR_ALL_CONTRACTORS,
  CLEAR_SELECTED_CONTRACTOR, CLEAR_SELECTED_OPTION,
  CLEAR_SPECIALTIES,
  CONTRACTOR_DETAIL_LOADED,
  SET_SELECTED_CONTRACTOR,
  SPECIALTIES_LOADED,
} from '../constants/cont-action-types';
import restAPI          from '../services';

export const clearAllContractorAction = createAction(CLEAR_ALL_CONTRACTORS);
export const clearSelectedContractorAction = createAction(
  CLEAR_SELECTED_CONTRACTOR,
);
export const setSelectedContractorAction = createAction(
  SET_SELECTED_CONTRACTOR,
);
export const loadedContractorAction = createAction(ALL_CONTRACTORS_LOADED);
export const clearSpecialtiesAction = createAction(CLEAR_SPECIALTIES);
export const clearSelectedOptionAction = createAction(CLEAR_SELECTED_OPTION);

export const uploadFiles = (id, files) => dispatch => {
  const formData = new FormData();
  files.forEach(async file => {
    formData.append('file', file);
  });

  const API_URL = 'contractors/';
  return restAPI.post(API_URL + id + '/files/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export function createContractor(contractor, cb) {
  return function(dispatch) {
    dispatch(clearAllContractorAction());

    return restAPI
      .post('contractors', contractor)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
      });
  };
}

export function selectContractor(id) {
  return function(dispatch) {
    dispatch(clearSelectedContractorAction());

    return restAPI.get('contractors/' + id).then(response => {
      dispatch({
        type: SET_SELECTED_CONTRACTOR,
        payload: response.data,
      });
    });
  };
}

export function updateContractor(id) {
  return function(dispatch) {
    return restAPI
      .get('contractors/' + id)
      .then(response => {
        dispatch(setSelectedContractorAction(response.data));
      })
      .catch(err => console.log(err.message));
  };
}

export function getContrators0(page, size) {
  return function(dispatch) {
    dispatch(clearAllContractorAction());

    return restAPI
      .get('contractors', {
        params: {
          page: page,
          size: size,
        },
      })
      .then(response => {
        dispatch(loadedContractorAction(response.data));
      });
  };
}

export function deleteContractor(id, cb) {
  return function(dispatch) {
    return restAPI
      .delete('contractors/' + id)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function addFiles(id, files, cb) {
  return function(dispatch) {
    const formData = new FormData();
    files.forEach(async file => {
      await formData.append('file', file);
    });
    return restAPI
      .post('contractors/' + id + '/files/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        cb(true);
        console.log(response);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export const getContractorDetailById = id => dispatch => {
  return restAPI.get('contractors/' + id).then(response => {
    console.log(response.data);
    dispatch({ type: CONTRACTOR_DETAIL_LOADED, payload: response.data });
  });
};

export function deleteFile(id, name, cb) {
  return function(dispatch) {
    return restAPI
      .delete('contractors/' + id + '/files/' + name)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export const removeFile = (id, name) => dispatch => {
  return restAPI.delete('contractors/' + id + '/files/' + name);
};

export function approveContractor(id, data, cb) {
  return function(dispatch) {
    return restAPI
      .post('contractors/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function rejectContractor(id, data, cb) {
  return function(dispatch) {
    return restAPI
      .post('contractors/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function getSpecialties(page, size) {
  return function(dispatch) {
    dispatch(clearSpecialtiesAction());
    return restAPI
      .get('specialties', {
        params: {
          page: page,
          size: size,
        },
      })
      .then(response => {
        dispatch({ type: SPECIALTIES_LOADED, payload: response.data });
      })
      .catch(err => console.log(err.message));
  };
}

export function addSpecialty(contractorId, specialtyId, cb) {
  return function(dispatch) {
    return restAPI
      .post('contractors/' + contractorId + '/specialties/' + specialtyId)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function deleteSpecialty(contractorId, specialtyId, cb) {
  return function(dispatch) {
    return restAPI
      .delete('contractors/' + contractorId + '/specialties/' + specialtyId)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

/*export function deleteCategory(id, cb) {
  return function(dispatch) {
    return restAPI
      .delete('categories/' + id)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        console.log(err.message);
        cb(false);
      });
  };
}*/
/*
export function deleteOption(id, cb) {
  return function(dispatch) {
    return restAPI
      .delete('options/' + id)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function addCategory(id, data, cb) {
  return function(dispatch) {
    return restAPI
      .post('contractors/' + id + '/categories', data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function addOption(id, data, cb) {
  return function(dispatch) {
    return restAPI
      .post('categories/' + id + '/options', data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function editOption(id, data, cb) {
  return function(dispatch) {
    return restAPI
      .put('options/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function editCategory(id, data, cb) {
  return function(dispatch) {
    return restAPI
      .put('categories/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}

export function editContractor(id, data, cb) {
  return function(dispatch) {
    return restAPI
      .put('contractors/' + id, data)
      .then(response => {
        cb(true);
      })
      .catch(err => {
        cb(false);
        console.log(err.message);
      });
  };
}*/
/*
export function selectOption(id) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_SELECTED_OPTION' });

    return restAPI
      .get('options/' + id)
      .then(response => {
        dispatch({
          type: SET_SELECTED_OPTION,
          payload: response.data,
        });
      })
      .catch(err => console.log(err.message));
  };
}

export function selectCategory(id) {
  return function(dispatch) {
    dispatch({ type: 'CLEAR_SELECTED_CATEGORY' });

    return restAPI
      .get('categories/' + id)
      .then(response => {
        dispatch({
          type: SET_SELECTED_CATEGORY,
          payload: response.data,
        });
      })
      .catch(err => console.log(err.message));
  };
}
*/
