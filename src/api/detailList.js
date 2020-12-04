/**
 *@desc: 精选相关接口
 *@author: XinD
 *@date: 2020/3/31
 */
import Axios from '@/utils/Axios';
// 查询首页轮播图
export const queryBannerList = (params, isLoading) =>{
    return Axios.post('/picchealth/basic/banner/queryBannerList?adverCode=1', params, '', '', isLoading);
};
