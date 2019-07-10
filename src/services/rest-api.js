import axios from 'axios';

const baseConfig = {
  baseURL: process.env['REACT_APP_PROJECT_API'],
  withCredentials: false,
  headers: {
    'content-type': 'application/json',
  }
};

export default class RestAPI {
  constructor(config = {}) {
    const mergedConfig = Object.assign({}, baseConfig, config);
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    this.axios = axios.create(mergedConfig);

    this.catchError = this.catchError.bind(this);
  }

  catchError(error) {
    // throw new Error(error);
    return [];
  }

  get(url, params = {}) {
    return this.execute({
      method: 'get',
      url,
      params,
    });
  }

  post(url, data) {
    return this.execute({
      method: 'post',
      url,
      data,
    });
  }

  put(url, data) {
    return this.execute({
      method: 'put',
      url,
      data,
    });
  }

  delete(url, params) {
    return this.execute({
      method: 'delete',
      url,
      params,
    });
  }

  patch(url, params) {
    return this.execute({
      method: 'patch',
      url,
      params,
    });
  }

  execute({ method, url, ...rest }) {
    return this.axios({
      method,
      url,
      ...rest,
    })
      .then(resp => resp)
      .catch(this.catchError);
  }
}
