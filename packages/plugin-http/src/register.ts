import { lodash } from '@etfma/shared';
import { VAxios } from './Axios';
import { ContentTypeEnum } from './enum';
import type { IHttpContext } from '@etfma/types';

export let context: IHttpContext = {
  // 自定义后端返回的字段
  resultField: {
    code: 'code',
    message: 'message',
    data: 'data',
  },
  // 后端返回数据格式，请求成功的依据
  successCode: 0,
  // 响应的过期时间
  timeout: 10 * 1000,
  // 基础接口地址
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  // 默认将prefix 添加到url
  joinPrefix: true,
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse: false,
  // 需要对返回数据进行处理
  isTransformResponse: true,
  // post请求的时候添加参数到url
  joinParamsToUrl: false,
  // 格式化提交参数时间
  formatDate: true,
  // 接口地址
  apiUrl: '',
  // 接口拼接地址
  urlPrefix: '',
  //  是否加入时间戳
  joinTime: true,
  // 忽略重复请求
  ignoreCancelToken: true,
  // 是否携带token
  withToken: true,
};

export let http: VAxios;

export async function register(...opts: IHttpContext[]) {
  context = lodash.merge(context, ...opts);

  http = new VAxios(context);

  return http;
}
