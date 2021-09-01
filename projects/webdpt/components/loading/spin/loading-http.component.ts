import { Component, OnInit, OnDestroy } from '@angular/core';

import { IDwLoadMaskCfg } from '@webdpt/framework/http';

/**
 * HTTP加載遮罩
 */
@Component({
  selector: 'dw-loading-http',
  templateUrl: './loading-http.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush // 避免ExpressionChangedAfterItHasBeenCheckedError
})
export class DwLoadingHttpComponent implements OnInit, OnDestroy {
  public loadingMask: IDwLoadMaskCfg;

  constructor() {
  }
  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }
}
