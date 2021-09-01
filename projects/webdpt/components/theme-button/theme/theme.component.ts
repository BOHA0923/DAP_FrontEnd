import {
  AnimationEvent
} from '@angular/animations';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair
} from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { fadeAnimation } from '../core/animation/fade-animations';
import { DEFAULT_4_POSITIONS, POSITION_MAP } from '../core/overlay/overlay-position-map';
import { isNotNil } from '../core/util/check';
import { toBoolean } from '../core/util/convert';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-theme',
  animations: [fadeAnimation],
  templateUrl: './theme.component.html',
  styles: [`
    .ant-popover {
      position: relative;
    }
  ` ]
})
export class DwThemeComponent {

  _hasBackdrop = false;
  _prefix = 'ant-popover-placement';
  _positions: ConnectionPositionPair[] = [...DEFAULT_4_POSITIONS];
  _classMap = {};
  _placement ;
  _trigger = 'click';
  // _content: string | TemplateRef<void>;

  // used to remove DwToolTipComponent @ContentChild('dwTemplate')
   _title: string | TemplateRef<void> ;
  @ContentChild('dwTemplate') dwTemplate:  string |TemplateRef<void>;
  overlayOrigin: CdkOverlayOrigin;
  isContentString: boolean;
  isTitleString: boolean;
  visibleSource = new BehaviorSubject<boolean>(false);
  visible$: Observable<boolean> = this.visibleSource.asObservable();
  // @ContentChild('dwTemplate') _title: string | TemplateRef<void>;
  @ViewChild('overlay') overlay: CdkConnectedOverlay;
  @Output() dwVisibleChange: EventEmitter<boolean> = new EventEmitter();

  @Input() dwTooltipOverlayClassName = '';
  @Input() dwOverlayStyle: { [key: string]: string } = {};
  @Input() dwMouseEnterDelay = 0.15; // Unit: second
  @Input() dwMouseLeaveDelay = 0.1; // Unit: second
  @Input()
  set dwContent(value: string | TemplateRef<void>) {
    this.isContentString = !(value instanceof TemplateRef);
    this.dwTemplate = value;
  }

  get dwContent(): string | TemplateRef<void> {
    return this.dwTemplate;
  }

  @Input()
  set dwTitle(value: string | TemplateRef<void>) {
    this.isTitleString = !(value instanceof TemplateRef);
    this._title = value;
  }

  get dwTitle(): string | TemplateRef<void> {
    return this._title;
  }

  @Input()
  set dwTooltipVisible(value: boolean) {
    const visible = toBoolean(value);
    if (this.visibleSource.value !== visible) {
      this.visibleSource.next(visible);
      this.dwVisibleChange.emit(visible);
    }
  }

  get dwTooltipVisible(): boolean {
    return this.visibleSource.value;
  }

  @Input()
  set dwTrigger(value: string) {
    this._trigger = value;
    this._hasBackdrop = this._trigger === 'click';
  }

  get dwTrigger(): string {
    return this._trigger;
  }

  @Input()
  set dwPlacement(value: string) {
    if (value !== this._placement) {
      this._placement = value;
      this._positions.unshift(POSITION_MAP[this.dwPlacement] as ConnectionPositionPair);
    }
  }

  get dwPlacement(): string {
    return this._placement;
  }

  // Manually force updating current overlay's position
  updatePosition(): void {
    if (this.overlay && this.overlay.overlayRef) {
      this.overlay.overlayRef.updatePosition();
    }
  }

  onPositionChange($event: ConnectedOverlayPositionChange): void {
    for (const key in POSITION_MAP) {
      if (JSON.stringify($event.connectionPair) === JSON.stringify(POSITION_MAP[key])) {
        this.dwPlacement = key;
        break;
      }
    }
    this.setClassMap();
    /** TODO may cause performance problem */
    this.cdr.detectChanges();
  }

  show(): void {
    if (!this.isContentEmpty()) {
      this.dwTooltipVisible = true;
    }
  }

  hide(): void {
    this.dwTooltipVisible = false;
  }

  _afterVisibilityAnimation(e: AnimationEvent): void {
    if (e.toState === 'false' && !this.dwTooltipVisible) {
      this.dwVisibleChange.emit(false);
    }
    if (e.toState === 'true' && this.dwTooltipVisible) {
      this.dwVisibleChange.emit(true);
    }
  }

  setClassMap(): void {
    this._classMap = {
      [this.dwTooltipOverlayClassName]: true,
      [`${this._prefix}-${this._placement}`]: true
    };
  }

  setOverlayOrigin(origin: CdkOverlayOrigin): void {
    this.overlayOrigin = origin;
  }
  isContentEmpty(): boolean {
    // Pity, can't detect whether dwTemplate is empty due to can't get it's content before shown up
    return this.isTitleString ? (this.dwTitle === '' || !isNotNil(this.dwTitle)) : false;
  }
  // ** 自訂for theme component 屬性 */
  private _dwPopWidth: number = 80;
  @Input()
  set dwPopWidth(val: any) {
    this._dwPopWidth = val;
    this.listWidth = this.dwPopWidth / this.dwColorColSplit;
  }
  get dwPopWidth(): any {
    return this._dwPopWidth;
  }
  private _dwColorColSplit: number = 2;

  @Input()
  set dwColorColSplit(val: any) {
    this._dwColorColSplit = val;
    this.listWidth = this.dwPopWidth / this.dwColorColSplit;
  }
  get dwColorColSplit(): any {
    return this._dwColorColSplit;
  }
  @Input()
  dwShowDesc: boolean = false;

  listWidth: number = this.dwPopWidth / this.dwColorColSplit;
  prefix: string = 'customTheme-';
  nowThemeStyleId = 'default';
  private _themeList: any[] = [{ id: 'default', path: 'default', description: '預設樣式' }];
  @Input()
  set themeList(val: any[]) {
    const idx = val.findIndex(v => v.id === 'default');
    if (idx !== -1) {
      this._themeList = val;
    } else {
      this._themeList = [...this._themeList, ...val];
    }
    // this._themeList.forEach(i => {
    //   i.showDesc = this.dwShowDesc;
    // });
  }
  get themeList(): any[] {
    return this._themeList;
  }
  defaultTheme: any = { id: 'default', path: 'default', description: '預設樣式' };
  changeTheme(theme: any): void {
    if (theme.id === 'default') {
      this.removeOtherThemeStyle();
      this.nowThemeStyleId = 'default';
      return;
    }
    const regEx = /([^\/]+)\.css/g;
    const match = regEx.exec(theme.path);
    if (!!match) {
      const elem = document.querySelector('#' + match[1]);
      if (!elem) {
        this.removeOtherThemeStyle();
        this.http.get(theme.path, { responseType: 'text' })
          .subscribe(
            (res) => {
              const css = res;
              const head = document.head || document.getElementsByTagName('head')[0];
              const style = document.createElement('style');
              style.id = this.prefix + match[1];
              style.type = 'text/css';
              style.appendChild(document.createTextNode(css));
              head.appendChild(style);
              this.nowThemeStyleId = match[1];
            }
          );
      }
    }

  }
  removeOtherThemeStyle(): void {
    const elems = document.querySelectorAll('style');
    const head = document.head || document.getElementsByTagName('head')[0];

    if (elems.length) {
      for (let i = 0; i < elems.length; i++) {
        if (!!elems[i].id && elems[i].id.search(this.prefix) !== -1) {
          head.removeChild(elems[i]);
        }
      }
    }
  }
  // ** end */
  constructor(
    public cdr: ChangeDetectorRef,
    private http: HttpClient
    ) {
      this.http.get('assets/themes/themeJson.json')
      .pipe(
        map((res: any) => {
          res.forEach(i => {
            let id = i.id;
            i.description = id;
            switch (id) {
              case id = 'theme-green':
                i.description = '樣式-green';
                break;
              case id = 'theme-red':
                i.description = '樣式-red';
                break;
              case id = 'theme-yellow':
                i.description = '樣式-yellow';
                break;
              case id = 'theme-white':
                i.description = '樣式-white';
                break;
              default:
                break;
            }
          });
          return res;
        })
      )
      .subscribe((res: any) => {
        this.themeList = [...this.themeList, ...res];
      });
  }


}
