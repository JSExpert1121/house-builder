import Axios from 'axios';

const TEMPL_API_PATH = process.env.REACT_APP_PROJECT_API + 'templates/';

export default {
  get: (page, size) =>
    Axios.post(TEMPL_API_PATH, {
      params: { page: page, size: size },
    }).then(res => res.data),
};
