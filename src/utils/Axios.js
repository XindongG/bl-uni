/**
 *@desc 请求处理
 *@author jiay
 *@date 2020/3/24 上午9:46
 */
import Request from './request';
import config from '@/config';
const Axios = new Request(config.baseURL);
export default Axios;
