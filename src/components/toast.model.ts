/* eslint-disable @typescript-eslint/no-explicit-any */
import mitt, { Emitter } from 'mitt';
import { SnotifyToastConfig } from '../interfaces';
import { SnotifyEvent } from '../types';
import { SnotifyStyle } from '../enums';
/**
 * Toast model
 */
export class SnotifyToast {
  /**
   * Emits {SnotifyEvent}
   */
  readonly eventEmitter: Emitter<Record<SnotifyEvent, any>> = mitt();
  /**
   * Holds all subscribers because we need to unsubscribe from all before toast get destroyed
   */
  private _eventsHolder: { event: string; action: (toast: any) => void }[] = [];
  /**
   * Toast prompt value
   */
  value = '';
  /**
   * Toast validator
   */
  valid: boolean | undefined = undefined;
  constructor(
    public id: number | string,
    public title: string,
    public body: string,
    public config?: SnotifyToastConfig
  ) {
    if (this.config?.type === SnotifyStyle.prompt) {
      this.value = '';
    }
    this.on('hidden', () => {
      // eslint-disable-next-line no-underscore-dangle
      this._eventsHolder.forEach((o) => {
        this.eventEmitter.off(o.event as any, o.action);
      });
    });
  }
  /**
   * Subscribe to toast events
   */
  on(event: SnotifyEvent, action: (responseCode: SnotifyToast) => void): this {
    // eslint-disable-next-line no-underscore-dangle
    this._eventsHolder.push({ event, action });
    this.eventEmitter.on(event, () => action(this));
    return this;
  }
}
