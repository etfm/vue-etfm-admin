import { Logger } from '@etfma/shared';
import { isPluginEventName } from '../utils/is/is-plugin-event-name';
import { IEditor, IEventBus, IPublicApiEvent, IPublicTypeDisposable } from '@etfma/types';

const logger = new Logger({ bizName: 'shell:event' });

type EventOptions = {
  prefix: string;
};

const eventBusSymbol = Symbol('eventBus');

export class Event implements IPublicApiEvent {
  private readonly [eventBusSymbol]: IEventBus;
  private readonly options: EventOptions;

  constructor(eventBus: IEventBus, options: EventOptions) {
    this[eventBusSymbol] = eventBus;
    this.options = options;
    if (!this.options.prefix) {
      logger.warn('prefix is required while initializing Event');
    }
  }

  /**
   * 监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event: string, listener: (...args: any[]) => void): IPublicTypeDisposable {
    if (isPluginEventName(event)) {
      return this[eventBusSymbol].on(`${this.options.prefix}:${event}`, listener);
    } else {
      logger.warn(
        `fail to monitor on event ${event}, event should have a prefix like 'somePrefix:eventName'`,
      );
      return () => {
        this.off(event, listener);
      };
    }
  }

  /**
   * 取消监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: string, listener: (...args: any[]) => void) {
    this[eventBusSymbol].off(`${this.options.prefix}:${event}`, listener);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns
   */
  emit(event: string, ...args: any[]) {
    if (!this.options.prefix) {
      logger.warn('Event#emit has been forbidden while prefix is not specified');
      return;
    }
    setTimeout(() => this[eventBusSymbol].emit(`${this.options.prefix}:${event}`, ...args));
  }
}

export function getEvent(editor: IEditor, options: any = { prefix: 'common' }) {
  return new Event(editor.eventBus, options);
}
