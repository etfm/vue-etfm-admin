import { IPublicApiEvent } from './api/event';

export interface IEventBus extends IPublicApiEvent {
  removeListener(event: string | number, listener: (...args: any[]) => void): any;
  addListener(event: string | number, listener: (...args: any[]) => void): any;
  setMaxListeners(n: number): any;
  removeAllListeners(event?: string | number): any;
}
