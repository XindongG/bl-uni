/**
 *@desc: 精选相关接口
 *@author: XinD
 *@date: 2020/3/31
 */
import Axios from '@/utils/Axios';
// 模拟接口1
export const getUserInfo = (params) =>{
	return Axios.post('/getUserInfo', params, '', '');
};
