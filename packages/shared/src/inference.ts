function is(value: unknown, type: string) {
  return toString.call(value) === `[object ${type}]`;
}

/**
 * @description 判断所给字符串是否为url类型，这里只判断是否 http/http,其他格式不支持
 * @param pathname
 * @returns
 */
function isHttpUrl(url: string) {
  // Regular expression to match HTTP(S) URL
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}

function isMap(value: unknown): value is Map<any, any> {
  return is(value, 'Map') || value instanceof Map;
}

function isWindow(value: any): value is Window {
  return typeof window !== 'undefined' && value !== null && value === value.window;
}

export { is, isHttpUrl, isMap, isWindow };
