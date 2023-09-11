import {
  createMemoryHistory,
  createWebHashHistory,
  createWebHistory,
  type RouterHistory,
} from 'vue-router';

let history: RouterHistory;
export function createHistory(opts: any) {
  if (opts.type === 'hash') {
    history = createWebHashHistory(opts.basename);
  } else if (opts.type === 'memory') {
    history = createMemoryHistory(opts.basename);
  } else {
    history = createWebHistory(opts.basename);
  }
  return history;
}

export { history };
