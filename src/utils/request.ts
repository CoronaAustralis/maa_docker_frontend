import axios from 'axios';
import { useToast } from "vue-toastification";

const toast = useToast()
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
    if(response.data.code){
      toast.error(response.data.msg)
    }
    return Promise.resolve(response);
  },
  error => {
    if(error.response?.status == 400){
      toast.error(error.response.data.msg)
    }else{
      toast.error("服务器错误")
    }
    return Promise.reject(error);
  }
);


export default service;
