import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
  ViewChildren, QueryList, OnDestroy
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { IDwIframe } from '@webdpt/framework/iframe-core';

@Component({
  selector: 'dw-base-iframe',
  templateUrl: './dw-base-iframe.component.html',
  styleUrls: ['./dw-base-iframe.component.less']
})
export class DwBaseIframeComponent implements OnInit, AfterViewInit {

  @Input() item: IDwIframe;

  @Input() itemObserve: BehaviorSubject<IDwIframe>; // optional: 當需要透過 service 取得 url 時.
  @Input() showMask: boolean; // 是否顯示遮罩.
  @ViewChild('dwIframe') iframe: ElementRef; // 存取 child component[iframe], 藉此存取 child component 的 public field 與 method.
  @ViewChildren('dwIframe') iframes: QueryList<ElementRef>;
  constructor(public _elementRef: ElementRef) { }

  // 在 ngOnInit 時, [iframe: ElementRef] 尚未產生, 不能在此 subscribe 並給 iframe 值.
  ngOnInit(): void {

  }

  // 為了不要使用屬性綁定, 因為會造成持續的reload.
  ngAfterViewInit(): void {
    this.iframes.changes.subscribe((queryList) => {
      if (queryList.length && !!this.item) {
        queryList.first.nativeElement.src = this.item.url;
      }
    });
    if (this.itemObserve) {
      this.itemObserve.subscribe(
        response => {
          if (response) {
            this.item = response;
            this.iframe.nativeElement.src = this.item.url;
          }
        },
        (error: any) => {
        }
      );
    } else if (this.iframe) {
      this.iframe.nativeElement.src = this.item.url;
    }
    // this.iframe.nativeElement.src = (<any>this.src).changingThisBreaksApplicationSecurity;
  }
}
