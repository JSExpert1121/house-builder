import Axios from 'axios';

const CONT_API_PATH = process.env.PROJECT_API + 'contractors/';

export default {
  getProjects: (id, page, size) =>
    Axios.get(CONT_API_PATH + id + '/projects', {
      params: { page: page, size: size },
    }).then(res => res.data),
  addProject: (id, project) =>
    Axios.post(CONT_API_PATH + id + '/projects', project).then(res => res.data),
  getProposals: (id, page, size, status) =>
    Axios.get(CONT_API_PATH + id + '/proposals', {
      params: {
        page: page,
        size: size,
        status: status,
      },
    }).then(res => res.data),
};
