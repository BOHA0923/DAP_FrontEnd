import {
  AfterContentInit,
  Directive,
  ElementRef,
  Injectable,
  Input,
  NgModule,
  Renderer2,
} from '@angular/core';
import { DwAnalytics } from './analytics';

@Injectable({ providedIn: 'root' })
// tslint:disable-next-line:directive-selector
@Directive({ selector: '[dw-analyticsOn]' })
// tslint:disable-next-line:directive-class-suffix
export class DwAnalyticsOn implements AfterContentInit {
  @Input('dw-analyticsOn') dwAnalyticsOn: string;
  @Input() angularticsAction: string;
  @Input() angularticsCategory: string;
  @Input() angularticsLabel: string;
  @Input() angularticsValue: string;
  @Input() angularticsProperties: any = {};

  constructor(
    private elRef: ElementRef,
    private dwAnalytics: DwAnalytics,
    private renderer: Renderer2
  ) { }

// tslint:disable-next-line:contextual-life-cycle
  ngAfterContentInit(): void {
    this.renderer.listen(
      this.elRef.nativeElement,
      this.dwAnalyticsOn || 'click',
      (event: Event) => this.eventTrack(event),
    );
  }

  eventTrack(event: Event): void {
    const action = this.angularticsAction; // || this.inferEventName();
    const properties: any = {
      ...this.angularticsProperties,
      eventType: event.type,
    };

    if (this.angularticsCategory) {
      properties.category = this.angularticsCategory;
    }
    if (this.angularticsLabel) {
      properties.label = this.angularticsLabel;
    }
    if (this.angularticsValue) {
      properties.value = this.angularticsValue;
    }

    this.dwAnalytics.eventTrack.next({
      action,
      properties,
    });
  }

  /*private isCommand() {
    return ['a:', 'button:', 'button:button', 'button:submit', 'input:button', 'input:submit'].indexOf(
      getDOM().tagName(this.el).toLowerCase() + ':' + (getDOM().type(this.el) || '')) >= 0;
  }

  private inferEventName() {
    if (this.isCommand()) return getDOM().getText(this.el) || getDOM().getValue(this.el);
    return getDOM().getProperty(this.el, 'id') || getDOM().getProperty(this.el, 'name') || getDOM().tagName(this.el);
  }*/
}

@NgModule({
  declarations: [DwAnalyticsOn],
  exports: [DwAnalyticsOn],
})
export class DwAnalyticsOnModule {}
