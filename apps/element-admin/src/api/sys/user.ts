import { http } from '@etfma/http'

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry'
}

/**
 * @description: user login api
 */
export function loginApi(params: any) {
  return http.post({
    url: Api.Login,
    params
  })
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return http.get({ url: Api.GetUserInfo })
}

export function getPermCode() {
  return http.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return http.get({ url: Api.Logout })
}
