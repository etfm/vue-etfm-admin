import { http } from '@etfm/vea-http'

enum Api {
  GetMenuList = '/getMenuList1'
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return http.get({ url: Api.GetMenuList })
}
