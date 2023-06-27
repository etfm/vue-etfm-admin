import { h } from 'vue';
import { isComponent } from './is';

export function createElement(content: any, props?: Record<string, unknown>): any {
  if (content && isComponent(content)) {
    return h(content, props);
  }

  return content;
}
