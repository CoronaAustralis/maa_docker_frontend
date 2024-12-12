import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: window.location.origin +"/api", // 这里可以配置你的 API 基础路径
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers["'Content-Type'"] = 'application/json'
    return config;
  },
  error => {
    console.error(error); // for debug
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  error => {
    console.error('err' + error); // for debug
    return Promise.reject(error);
  }
);


export default service;
