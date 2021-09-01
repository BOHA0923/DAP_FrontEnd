import {
  AfterViewInit,
  ComponentFactory,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { isNotNil } from '../core/util/check';
import { DwThemeComponent } from './theme.component';
@Directive({
  selector: '[dwThemeDirective]'
})
export class DwThemeDirective implements AfterViewInit, OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  // [NOTE] Here hard coded, and dwTitle used only under DwTooltipDirective currently.
  isTooltipOpen: boolean = false;
  isDynamicTooltip = false; // Indicate whether current tooltip is dynamic created
  delayTimer; // Timer for delay enter/leave
  _title: string | TemplateRef<void>;
  _content: string | TemplateRef<void>;
  _overlayClassName: string;
  _overlayStyle: { [key: string]: string };
  _mouseEnterDelay: number;
  _mouseLeaveDelay: number;
  _visible: boolean;
  _trigger: string = 'click';
  _placement: string = 'bottom';
  factory: ComponentFactory<DwThemeComponent> = this.resolver.resolveComponentFactory(DwThemeComponent);
  @Output() dwVisibleChange = new EventEmitter<boolean>();

  @Input('dw-tooltip')
  set dwTitle(title: string | TemplateRef<void>) {
    this._title = title;
    this.updateCompValue('dwTitle', title);
  }

  get dwTitle(): string | TemplateRef<void> {
    return this._title;
  }

  @Input('dwTitle')
  set setTitle(title: string | TemplateRef<void>) {
    this.dwTitle = title;
  }
  @Input()
  dwReference: string;
  @Input()
  set dwContent(value: string | TemplateRef<void>) {
    this._content = value;
    this.updateCompValue('dwContent', value);
  }

  get dwContent(): string | TemplateRef<void> {
    return this._content;
  }

  @Input()
  set dwTooltipOverlayClassName(value: string) {
    this._overlayClassName = value;
    this.updateCompValue('dwTooltipOverlayClassName', value);
  }

  get dwTooltipOverlayClassName(): string {
    return this._overlayClassName;
  }

  @Input()
  set dwOverlayStyle(value: { [key: string]: string }) {
    this._overlayStyle = value;
    this.updateCompValue('dwOverlayStyle', value);
  }

  get dwOverlayStyle(): { [key: string]: string } {
    return this._overlayStyle;
  }

  @Input()
  set dwMouseEnterDelay(value: number) {
    this._mouseEnterDelay = value;
    this.updateCompValue('dwMouseEnterDelay', value);
  }

  get dwMouseEnterDelay(): number {
    return this._mouseEnterDelay;
  }

  @Input()
  set dwMouseLeaveDelay(value: number) {
    this._mouseLeaveDelay = value;
    this.updateCompValue('dwMouseLeaveDelay', value);
  }

  get dwMouseLeaveDelay(): number {
    return this._mouseEnterDelay;
  }

  @Input()
  set dwTooltipVisible(value: boolean) {
    this._visible = value;
    this.updateCompValue('dwTooltipVisible', value);
  }

  get dwTooltipVisible(): boolean {
    return this._visible;
  }

  @Input()
  set dwTrigger(value: string) {
    this._trigger = value;
    this.updateCompValue('dwTrigger', value);
  }

  get dwTrigger(): string {
    return this._trigger;
  }

  @Input()
  set dwPlacement(value: string) {
    this._placement = value;
    this.updateCompValue('dwPlacement', value);
  }

  get dwPlacement(): string {
    return this._placement;
  }
  private _dwPopWidth: number = 80;
  @Input()
  set dwPopWidth(val: any) {
    this._dwPopWidth = val;
    this.updateCompValue('dwPopWidth', val);
  }
  get dwPopWidth(): any {
    return this._dwPopWidth;
  }
  @HostBinding('class.ant-tooltip-open')
  get isOpen(): boolean {
    return this.isTooltipOpen;
  }

  private show(): void {
    this.tooltip.show();
    this.isTooltipOpen = true;
  }

  private hide(): void {
    this.tooltip.hide();
    this.isTooltipOpen = false;
  }

  private delayEnterLeave(isOrigin: boolean, isEnter: boolean, delay: number = -1): void {
    if (this.delayTimer) { // Clear timer during the delay time
      window.clearTimeout(this.delayTimer);
      this.delayTimer = null;
    } else if (delay > 0) {
      this.delayTimer = window.setTimeout(() => {
        this.delayTimer = null;
        isEnter ? this.show() : this.hide();
      }, delay * 1000);
    } else {
      // [Compatible] The "isOrigin" is used due to the tooltip will not hide immediately (may caused by the fade-out animation)
      isEnter && isOrigin ? this.show() : this.hide();
    }
  }

  // tslint:disable-next-line:no-any
  updateCompValue(key: string, value: any): void {
    if (this.isDynamicTooltip && isNotNil(value)) {
      this.tooltip[key] = value;
    }
  }

  constructor(
    public elementRef: ElementRef,
    public hostView: ViewContainerRef,
    public resolver: ComponentFactoryResolver,
    public renderer: Renderer2,
    @Optional() public tooltip: DwThemeComponent) {
  }

  ngOnInit(): void {
    // Support faster tooltip mode: <a dw-tooltip="xxx"></a>. [NOTE] Used only under DwTooltipDirective currently.
    if (!this.tooltip) {
      const tooltipComponent = this.hostView.createComponent(this.factory);
      this.tooltip = tooltipComponent.instance;
      // Remove element when use directive https://github.com/NG-ZORRO/ng-zorro-antd/issues/1967
      this.renderer.removeChild(this.renderer.parentNode(this.elementRef.nativeElement), tooltipComponent.location.nativeElement);
      this.isDynamicTooltip = true;
      const properties = ['dwTitle', 'dwContent', 'dwTooltipOverlayClassName', 'dwOverlayStyle',
        'dwMouseEnterDelay', 'dwMouseLeaveDelay', 'dwTooltipVisible', 'dwTrigger', 'dwPlacement', 'dwPopWidth'];
      properties.forEach(property => this.updateCompValue(property, this[property]));
      this.tooltip.dwVisibleChange.pipe(takeUntil(this.unsubscribe$), distinctUntilChanged()).subscribe(data => {
        this._visible = data;
        this.dwVisibleChange.emit(data);
      });
    }
    this.tooltip.setOverlayOrigin(this);
    this.elementRef.nativeElement.style.cursor = 'pointer';
    if (this.dwReference) {
      this.elementRef.nativeElement.title = this.dwReference;
    }
  }

  ngAfterViewInit(): void {
    if (this.tooltip.dwTrigger === 'hover') {
      let overlayElement;
      this.renderer.listen(this.elementRef.nativeElement, 'mouseenter',
        () => this.delayEnterLeave(true, true, this.tooltip.dwMouseEnterDelay));
      this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => {
        this.delayEnterLeave(true, false, this.tooltip.dwMouseLeaveDelay);
        // NOTE: we bind events under "mouseleave" due to the overlayRef is only created after the overlay was completely shown up
        if (this.tooltip.overlay.overlayRef && !overlayElement) {
          overlayElement = this.tooltip.overlay.overlayRef.overlayElement;
          this.renderer.listen(overlayElement, 'mouseenter', () => this.delayEnterLeave(false, true));
          this.renderer.listen(overlayElement, 'mouseleave', () => this.delayEnterLeave(false, false));
        }
      });
    } else if (this.tooltip.dwTrigger === 'focus') {
      this.renderer.listen(this.elementRef.nativeElement, 'focus', () => this.show());
      this.renderer.listen(this.elementRef.nativeElement, 'blur', () => this.hide());
    } else if (this.tooltip.dwTrigger === 'click') {
      this.renderer.listen(this.elementRef.nativeElement, 'click', (e) => {
        e.preventDefault();
        this.show();
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

