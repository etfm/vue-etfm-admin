import { IPublicApiEvent } from './api/event';

export interface IEventBus extends IPublicApiEvent {
  removeListener(event: string | number | symbol, listener: (...args: any[]) => void): any;
  addListener(event: string | number | symbol, listener: (...args: any[]) => void): any;
  setMaxListeners(n: number): any;
  removeAllListeners(event?: string | number | symbol): any;
}
