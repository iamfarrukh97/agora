import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import {isIos} from '@helpers/UtilsHelpers';

const axiosInstance = axios.create({
  baseURL: isIos()
    ? 'http://192.168.137.104:3000'
    : 'http://192.168.137.104.:3000',
});

export default axiosInstance;
