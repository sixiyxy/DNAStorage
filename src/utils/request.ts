/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
// 引入 axios 用于 ajax 请求
import axios from 'axios';
// 引入 ant-d 的组件
import {API_PREFIX} from '../common/Config';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

axios.defaults.baseURL = API_PREFIX;

// // 添加请求拦截器设置 token
// axios.interceptors.request.use(
//   function (config) {
//     // 在发送请求之前做些什么
//
//     const loginResult = StorageUtil.getLoginResult();
//
//     // 添加 loginToken
//     if (loginResult && loginResult['token']) {
//       config.headers.Authorization = loginResult['token'];
//     }
//
//     return config;
//   },
//   function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   },
// );

export { axios };


/**
 * 能发送 ajax 请求的函数模块，其基于 axios
 * 该函数的返回值是 promise 对象，而 axios.get()/post() 返回的就是 promise 对象
 * 但我们要返回自己创建的 promise 对象，以便能 :
 *      统一处理请求异常
 *      异步返回结果数据 , 而不是包含结果数据的 response
 * @param url 请求地址
 * @param params 请求参数
 * @param body 请求体
 * @param method 请求方法
 * @param full
 * @returns {Promise<unknown>}
 */
const request = (url, { params = {}, body = {}, method = 'GET', full = false } = {}) => {
  return new Promise(function (resolve, reject) {
    let promise; // 自定义的 promise 对象

    // config 对象
    const config = {
      url,
      params, // 路径参数
      data: body, // 请求体，get 方法无效
      method,
    };

    promise = axios.request(config);

    promise
      .then((response) => {
        // response.data 即为 Http 响应体，本项目对应 ResBean 的内容
        const responseBody = response.data;
        resolve(responseBody);
      })
      .catch((error) => {
        reject(error);
      });

    return promise;
  });
};

export const doGet = (url, { params = {}, body = {} } = {}) =>
  request(url, { params, body, method: 'GET' });
export const doPost = (url, { params = {}, body = {} } = {}) =>
  request(url, { params, body, method: 'POST' });
export const doPut = (url, { params = {}, body = {} } = {}) =>
  request(url, { params, body, method: 'PUT' });
export const doDelete = (url, { params = {}, body = {} } = {}) =>
  request(url, { params, body, method: 'DELETE' });

export default request;
