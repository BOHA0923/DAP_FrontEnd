import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { DwPostMessageAuthService } from './post-message-auth.service';
import { IDwPostMessageData } from './post-message-event-target.interface';

export class DwPostMessageEventEmitter {

  private _events: { [key: string]: EventEmitter<IDwPostMessageData> } = {};
  private _subscribers: Map<string, Map<Function, Subscription>> = new Map<string, Map<Function, Subscription>>();
  private _authFunc: DwPostMessageAuthService;

  constructor(authFunction?: DwPostMessageAuthService) {
    this._authFunc = authFunction;
  }

  addListener(channelName: string, callback: (message: string) => void): void {
    let event: EventEmitter<any> = this._events[channelName];
    let subscribers: Map<Function, Subscription> = this._subscribers.get(channelName);
    if (!event) {
      event = new EventEmitter<any>(false);
      this._events[channelName] = event;
    }

    const subscriber: Subscription = event.subscribe(callback);

    if (!subscribers) {
      subscribers = new Map<Function, Subscription>();
      this._subscribers.set(channelName, subscribers);
    }

    subscribers.set(callback, subscriber);
  }

  handleMessage(messageEvent: MessageEvent): void {
    const data: IDwPostMessageData = messageEvent.data;
    const channelName = data.channelName;
    const _event = this._events[channelName];
    if (_event && (this._authFunc ? this._authFunc.auth(messageEvent.data) : true)) {
      _event.emit(messageEvent.data.data);
    }
  }

  removeAllListeners(): void {
    this._subscribers.forEach((subscribers: any, channelName: string) => {
      this.removeListener(channelName);
    });
  }

  removeListener(channelName: string, callback?: (message: any) => void): void {
    const events: Map<Function, Subscription> = this._subscribers.get(channelName);
    if (!callback) {

      if (events) {
        events.forEach(_subscriber => {
          _subscriber.unsubscribe();
        });

        events.clear();
        this._subscribers.delete(channelName);
      }

      return;
    }

    if (events) {

      const subscriber = events.get(callback);

      if (subscriber) {

        subscriber.unsubscribe();
        events.delete(callback);

        if (events.size === 0) {
          this._subscribers.delete(channelName);
        }

      }
    }
    // throw new Error('removeListener not implemented!');
  }

}
