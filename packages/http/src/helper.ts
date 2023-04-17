import { lodash } from '@etfm/vea-shared'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function joinTimestamp<T extends boolean>(
  join: boolean,
  restful: T
): T extends true ? string : object

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {}
  }
  const now = new Date().getTime()
  if (restful) {
    return `?_t=${now}`
  }
  return { _t: now }
}

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return
  }

  for (const key in params) {
    const format = params[key]?.format ?? null
    if (format && typeof format === 'function') {
      params[key] = params[key].format(DATE_TIME_FORMAT)
    }
    if (lodash.isString(key)) {
      const value = params[key]
      if (value) {
        try {
          params[key] = lodash.isString(value) ? value.trim() : value
        } catch (error: any) {
          throw new Error(error)
        }
      }
    }
    if (lodash.isObject(params[key])) {
      formatRequestDate(params[key])
    }
  }
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  appendUrlParams('www.google.com', obj)
 *  ==>www.google.com?a=3&b=4
 */
export function appendUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}
