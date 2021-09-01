import { DwPostMessageEventEmitter } from './post-message-event-emitter';
import { IDwPostMessageData, IDwPostMessageEventTarget } from './post-message-event-target.interface';

export class DwPostMessageHub extends DwPostMessageEventEmitter {
  _source: IDwPostMessageEventTarget;
  _targets: Array<{ origin: string, target: IDwPostMessageEventTarget }> = [];

  constructor(eventTarget: EventTarget) {
    super();
    eventTarget.addEventListener('message', (ev: MessageEvent) => this.handleMessage(ev));
  }

  send(message: Partial<IDwPostMessageData>): void {
    for (let i = 0; i < this._targets.length; i++) {
      const target = this._targets[i];
      const url = new URL(target.origin);
      // 再把封裝window.postMessage()封裝起來，與connect同行為？
      target.target.postMessage({
        ...message,
        sourceUrl: `${window.location.protocol}//${window.location.host}`
      }, `${url.protocol}//${url.host}`);
    }
  }

  addReceiver(receiver: IDwPostMessageEventTarget, origin: string): void {
    const target = this._targets.find(_target => _target.target === receiver);
    if (!target) {
      this._targets.push({
        origin,
        target: receiver
      });
    }
  }

  removeReceiver(receiver: IDwPostMessageEventTarget): void {
    let index = -1;
    for (let i = 0; i < this._targets.length; i++) {
      if (this._targets[i].target === receiver) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      this._targets.splice(index, 1);
    }
  }
}
