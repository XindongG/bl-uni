/**
 *@desc: axios请求
 *@author: XinD
 *@date: 2020/12/8
 */
import Request from './request';
import config from '@/config';
const Axios = new Request(config.baseURL);
export default Axios;
