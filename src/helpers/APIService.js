import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import packageJson from "../../package.json";
import { browserName, browserVersion } from "react-device-detect";

export const BASE_URL = process.env.BASE_URL;
export const API_KEY = process.env.API_KEY;
export const SECRET_KEY = process.env.SECRET_KEY;

export const errorResponse = {};
export const METHOD = {
  GET: "get",
  HEAD: "HEAD",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
  POST: "POST",
};

const singleton = Symbol();
const singletonEnforcer = Symbol();
class ApiService {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw new Error("Cannot construct singleton");
    }
    const defaultOptions = {
      baseURL: BASE_URL,
      method: METHOD.GET,
      timeout: 65000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": "fa-IR",
        "Consumer-Info": `{"api_key":"${API_KEY}","secret_key":"${SECRET_KEY}","gateway_type":"BROWSER","gateway_version":"${browserVersion}","device_model":"${browserName}","app_version":"${packageJson.version}"}`,
        "Channel-Type": "bo-web",
        "x-requested-with": "XMLHttpRequest",
      },
    };

    this.session = axios?.create(defaultOptions);

    this.session.interceptors.request.use((config) => {
      config.params = Object.assign({}, config.params || {});
      return config;
    });

    this.session.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        errorResponse.error = error.response;
        errorResponse.networkError = JSON.parse(JSON.stringify(error));
        return Promise.reject(error?.response?.data);
      }
    );
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new ApiService(singletonEnforcer);
    }

    return this[singleton];
  }

  get = (url, options = {}) =>
    trackPromise(this.session.get(url, { ...options, data: {} }));
  getWithoutLoading = (url, options = {}) =>
    this.session.get(url, { ...options, data: {} });
  post = (url, data, options = {}) =>
    trackPromise(this.session.post(url, data, { ...options }));
  postWithoutLoading = (url, data, options = {}) =>
    this.session.post(url, data, { ...options });
  put = (url, data, options = {}) =>
    trackPromise(this.session.put(url, data, { ...options }));
  putWithoutLoading = (url, data, options = {}) =>
    this.session.put(url, data, { ...options });
  delete = (url, options = {}) =>
    trackPromise(this.session.delete(url, { ...options, data: {} }));
  deleteWithoutLoading = (url, options = {}) =>
    trackPromise(this.session.delete(url, { ...options, data: {} }));
}

export default ApiService.instance;
