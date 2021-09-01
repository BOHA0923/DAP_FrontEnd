import { ElementRef, Injectable } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { DwMessageContainerComponent } from 'ng-quicksilver';
import { NavigationEnd, Router } from '@angular/router';
import { DwMessageDataFilled, DwMessageDataOptions } from 'ng-quicksilver';
import { ComponentPortal } from '@angular/cdk/portal';

/**
 * https://github.com/angular/angular/issues/20515
 * 子組件使用DwMessageService，報ExpressionChangedAfterItHasBeenCheckedError錯誤
 *
 * 因以上原因，先自己實作
 */

@Injectable({
  providedIn: 'root'
})
export class DwRoutingMessageService {
  _container: DwMessageContainerComponent;
  protected _counter = 0; // Id counter for messages
  routedMessages: string[] = [];
  messages: string[] = [];
  _idPrefix = '';

  constructor(private router: Router,
              private overlay: Overlay) {
    this.router.events
      .subscribe(
        (event) => {
          if (event instanceof NavigationEnd) {
            this._flushRoutedMessage();
          }
        }
      );
  }

  addToRoute(content: string): void {
    this.routedMessages.push(content);
  }

  add(content: string): void {
    this.messages.push(content);
  }

  private _flushRoutedMessage(): DwMessageDataFilled {
    if (this.routedMessages.length > 0) {
      const html = this.routedMessages.join('<br/>');
      this.routedMessages.splice(0);
      this.send(html);
    }
    return <DwMessageDataFilled>{};
  }

  flush(options?: DwMessageDataOptions): DwMessageDataFilled {
    if (this.messages.length > 0) {
      const html = this.messages.join('<br/>');
      this.messages.splice(0);
      return this.html(html, options);
    }
    return <DwMessageDataFilled>{};
  }

  // Shortcut methods
  success(content: string, options?: DwMessageDataOptions): DwMessageDataFilled {
    return this.createMessage({type: 'success', content}, options);
  }

  error(content: string, options?: DwMessageDataOptions): DwMessageDataFilled {
    return this.createMessage({type: 'error', content}, options);
  }

  info(content: string, options?: DwMessageDataOptions): DwMessageDataFilled {
    return this.createMessage({type: 'info', content}, options);
  }

  warning(content: string, options?: DwMessageDataOptions): DwMessageDataFilled {
    return this.createMessage({type: 'warning', content}, options);
  }

  loading(content: string, options?: DwMessageDataOptions): DwMessageDataFilled {
    return this.createMessage({type: 'loading', content}, options);
  }

  create(type: string, content: string, options?: DwMessageDataOptions): DwMessageDataFilled {
    return this.createMessage({type, content}, options);
  }

  /**   以下為實驗性質，搭配<dw-message-holder></dw-message-holder>使用 **/

  html(html: string, options?: DwMessageDataOptions): DwMessageDataFilled {
    return this.createMessage({html}, options);
  }

  send(content: string): void {
    this.createMessage({content});
  }

  // 相對於elementRef的位置。但nz自己的.ant-message CSS位置要修正
  setHost(elementRef: ElementRef): void {
    this._setHost(elementRef);
  }

  createMessage(message: object, options?: any): any {
    if (!this._container) {
      this._setHost();
    }
    const resultMessage: any = {
      ...message,
      ...{
        messageId: this._generateMessageId(),
        options,
        createdAt: new Date()
      }
    };
    this._container.create(resultMessage);

    return resultMessage;
  }

  protected _setHost(elementRef?: ElementRef): void {
    let positionStrategy;
    if (elementRef) {
      const position = [
        new ConnectionPositionPair(
          {originX: 'start', originY: 'bottom'},
          {overlayX: 'end', overlayY: 'top'}
        )
      ];
      positionStrategy = this.overlay.position().flexibleConnectedTo(
        elementRef
      ).withPositions(position);
    } else {
      positionStrategy = this.overlay.position().global();
    }
    const overlayRef = this.overlay.create(new OverlayConfig({
      positionStrategy: positionStrategy
    }));
    this._container = overlayRef.attach(new ComponentPortal(DwMessageContainerComponent)).instance;
  }

  protected _generateMessageId(): string {
    return this._idPrefix + this._counter++;
  }

}
