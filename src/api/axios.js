import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import {isIos} from '@helpers/UtilsHelpers';

const axiosInstance = axios.create({
  baseURL: isIos() ? 'http://localhost:5000' : 'http://192.168.137.234:5000',
});

export default axiosInstance;
