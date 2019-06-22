import axios from 'axios';

const baseConfig = {
  baseURL: process.env['REACT_APP_PROJECT_API'],
  withCredentials: false,
};

export default class RestAPI {
  constructor(config = {}) {
    const mergedConfig = Object.assign({}, baseConfig, config);
    this.axios = axios.create(mergedConfig);

    this.catchError = this.catchError.bind(this);
  }

  catchError(error) {
    // throw new Error(error);
    return null;
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

  put(url, params) {
    return this.execute({
      method: 'put',
      url,
      params,
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
