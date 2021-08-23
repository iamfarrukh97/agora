import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import {isIos} from '@helpers/UtilsHelpers';

const axiosInstance = axios.create({
  baseURL: isIos() ? 'http://localhost:3000' : 'http://192.168.0.109:3000',
});

// const ResponseInterceptor = response => {
//   return response;
// };
// // Alter defaults after instance has been created
// axiosInstance.interceptors.response.use(ResponseInterceptor, error => {
//   const expectedErrors =
//     error.response &&
//     error.response.status >= 400 &&
//     error.response.status < 500;
//   if (!expectedErrors) {
//     console.log('error', error);
//     return;
//   } else {
//     if (error.response.status === 401) {
//       console.log('error.response :>> ', error.response.data.message);
//     }
//     return Promise.reject(error);
//   }
// });

export default axiosInstance;
