import { EventEmitter } from '@angular/core';
import { Subscriber } from 'rxjs';
import { DwPostMessageAuthService } from './post-message-auth.service';
import { DwPostMessageEventEmitter } from './post-message-event-emitter';
import { IDwPostMessageData, IDwPostMessageEventTarget } from './post-message-event-target.interface';

export class DwPostMessageConnect extends DwPostMessageEventEmitter {

  private _source: IDwPostMessageEventTarget;
  private _target: IDwPostMessageEventTarget;

  constructor(
    source: IDwPostMessageEventTarget,
    target: IDwPostMessageEventTarget,
    authFunction?: DwPostMessageAuthService) {
    super(authFunction);
    this._source = source;
    this._target = target;
    source.addEventListener('message', (ev: MessageEvent) => this.handleMessage(ev));
  }

  disconnect(): void {

  }

  send(message: Partial<IDwPostMessageData>, targetOptions?: any): void {
    // 再把封裝window.postMessage()封裝起來，與hub共用？
    this._target.postMessage({
      ...message,
      sourceUrl: `${window.location.protocol}//${window.location.host}`
    }, targetOptions || '*');
  }
}
