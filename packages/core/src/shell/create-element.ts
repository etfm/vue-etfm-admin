import { h } from 'vue'
import { isComponent } from './is'

export function createElement(
  content: any,
  props?: Record<string, unknown>
): any {
  if (content && isComponent(content)) {
    return h(content, props)
  }

  // if (isVNode(content)) {
  //   return props ? cloneVNode(content, props) : content
  // }

  // if (isFunction(content)) {
  //   return createVNode(content, props)
  // }

  return content
}
