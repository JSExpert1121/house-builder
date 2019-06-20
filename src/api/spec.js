import Axios from 'axios';

const SPEC_API_PATH = process.env.PROJECT_API + 'specialties/';

export default {
  loadPage: (pageNo, pageSize) => {
    return Axios.get(SPEC_API_PATH, {
      params: {
        page: pageNo,
        size: pageSize,
      },
    }).then(res => res.data);
  },

  load: specId => Axios.get(SPEC_API_PATH + specId).then(res => res.data),
  update: spec =>
    Axios.put(SPEC_API_PATH + spec.id, spec).then(res => res.data),
  delete: specid => Axios.delete(SPEC_API_PATH + specid),
  create: spec => Axios.post(SPEC_API_PATH, spec),
};
