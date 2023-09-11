// import { EventEmitter } from 'events';
// import { IEventBus } from '@etfm/types';
import { Logger } from '@etfm/shared';
import { Config, IConfig } from './config';

const logger = new Logger({ bizName: 'event-bus' });
const moduleLogger = new Logger({ bizName: 'module-event-bus' });

export class EventBus {
  private readonly eventEmitter: IConfig;
  private readonly name?: string;

  constructor(name?: string) {
    this.eventEmitter = new Config();
    this.name = name;
  }

  private getMsgPrefix(type: string): string {
    if (this.name && this.name.length > 0) {
      return `[${this.name}][event-${type}]`;
    } else {
      return `[*][event-${type}]`;
    }
  }

  private getLogger(): Logger {
    if (this.name && this.name.length > 0) {
      return moduleLogger;
    } else {
      return logger;
    }
  }

  /**
   * 监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event: string, listener: (...args: any[]) => void): () => void {
    this.eventEmitter.onGot(event, listener);
    this.getLogger().debug(`${this.getMsgPrefix('on')} ${event}`);
    return () => {
      this.off(event, listener);
    };
  }

  /**
   * 取消监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.delWait(event, listener);
    this.getLogger().debug(`${this.getMsgPrefix('off')} ${event}`);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns
   */
  emit(event: string, ...args: any[]) {
    this.eventEmitter.set(event, ...args);
    this.getLogger().debug(`${this.getMsgPrefix('emit')} name: ${event}, args: `, ...args);
  }
}

export const createModuleEventBus = (moduleName: string) => {
  return new EventBus(moduleName);
};

export const commonEvent = new EventBus();
