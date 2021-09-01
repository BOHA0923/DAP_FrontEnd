import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { IDwLoadMaskCfg, IDwLoadMaskItem } from '@webdpt/framework/http';
import { DW_LOAD_MASK_DELAY, DW_LOAD_MASK_HTTP } from '@webdpt/framework/config';
import { DwLoadingHttpComponent } from '../spin/loading-http.component';

@Injectable({
  providedIn: 'root'
})
export class DwLoadingMaskService {
  private loadingSubject: BehaviorSubject<IDwLoadMaskItem>;
  private loadingList: IDwLoadMaskItem[];

  private _container: DwLoadingHttpComponent;
  private overlayRef: OverlayRef;
  private loadingMask: IDwLoadMaskCfg;

  constructor(
    private overlay: Overlay,
    @Inject(DW_LOAD_MASK_HTTP) private dwLoadMaskHttp: boolean,
    @Inject(DW_LOAD_MASK_DELAY) private dwLoadMaskDelay: number
  ) {
    this.loadingList = [];
    this.loadingSubject = new BehaviorSubject(null);
    this.loadingSubjectNext();

    this.loadingMaskOnInit();
  }

  /**
   * 自動顯示加載遮罩
   *
   * @param spinning 是否顯示
   * @param [delay] 延遲顯示加載效果的時間毫秒（防止閃爍）
   * @param [tip] 描述
   * @returns newId 加載遮罩編號
   */
  public auto(spinning: boolean, delay?: number, tip?: string): string {
    let newId = null;

    // 環境變數
    let _spinning = this.dwLoadMaskHttp;
    let _delay = this.dwLoadMaskDelay;

    if (spinning !== null) {
      _spinning = spinning;
    }

    if (_spinning) {
      if (delay !== undefined && delay !== null) {
        _delay = delay;
      }

      newId = this.show(_delay, tip);
    }

    return newId;
  }

  /**
   * 顯示加載遮罩
   *
   * @param [delay] 延遲顯示加載效果的時間毫秒（防止閃爍）
   * @param [tip] 描述
   * @returns newId 加載遮罩編號
   */
  public show(delay?: number, tip?: string): string {
    const newId = new Date().getTime().toString() + '_' + Math.floor((Math.random() * 10000) + 1).toString();
    const newCfg: IDwLoadMaskCfg = this.newConfig();

    if (delay !== undefined && delay !== null) {
      newCfg.delay = delay;
    }

    if (tip !== undefined && tip !== null) {
      newCfg.tip = tip;
    }

    if (newCfg.delay > 0) {
      newCfg.spinning = false;
    } else {
      newCfg.spinning = true;
    }

    const _loadMaskItem: IDwLoadMaskItem = this.newLoadMaskItem();
    _loadMaskItem.id = newId;
    _loadMaskItem.config = newCfg;
    this.loadingList.push(_loadMaskItem);

    if (newCfg.delay > 0) {
      // 延遲
      setTimeout(() => {
        this.reflash(newId);
      }, newCfg.delay);
    } else {
      // 立即
      this.loadingSubjectNext(_loadMaskItem);
    }

    return newId;
  }

  private reflash(loadingMaskId: string): void {
    const _loadMaskItem: IDwLoadMaskItem = this.newLoadMaskItem();
    const len = this.loadingList.length;

    if (len === 0) {
      this.loadingSubjectNext(_loadMaskItem);
    } else {
      if (loadingMaskId !== '') {
        for (let i = len - 1; i >= 0; i--) {
          const obj = this.loadingList[i];

          if (loadingMaskId === obj.id) {
            obj.config.spinning = true;
            obj.config.delay = 0;
            break;
          }
        }
      }

      for (let i = len - 1; i >= 0; i--) {
        const obj = this.loadingList[i];

        if (obj.config.spinning) {
          const showMask = this.loadingList[i];
          _loadMaskItem.id = showMask.id;
          _loadMaskItem.config = showMask.config;
          this.loadingSubjectNext(_loadMaskItem);
          break;
        }
      }
    }
  }

  /**
   * 隱藏加載遮罩
   *
   * @param loadingMaskId 加載遮罩編號
   */
  public hide(loadingMaskId: string): void {
    if (loadingMaskId) {
      const len = this.loadingList.length;

      if (len > 0) {
        for (let i = 0; i < len; i++) {
          const obj = this.loadingList[i];

          if (loadingMaskId === obj.id) {
            this.loadingList.splice(i, 1);
            this.reflash('');
            break;
          }
        }
      }
    }
  }

  /**
   * 取得加載遮罩
   */
  public getLoadingMask(): Observable<IDwLoadMaskItem> {
    return this.loadingSubject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  public newConfig(): IDwLoadMaskCfg {
    const newCfg: IDwLoadMaskCfg = {
      spinning: false,
      delay: 0,
      tip: ''
    };

    return newCfg;
  }

  public nullConfig(): IDwLoadMaskCfg {
    const newCfg: IDwLoadMaskCfg = {
      spinning: null,
      delay: null,
      tip: null
    };

    return newCfg;
  }

  public newLoadMaskItem(): IDwLoadMaskItem {
    const newItem: IDwLoadMaskItem = {
      id: '',
      config: this.newConfig()
    };

    return newItem;
  }

  private loadingSubjectNext(loadMaskItem?: IDwLoadMaskItem): void {
    const _loadMaskItem: IDwLoadMaskItem = this.newLoadMaskItem();

    if (loadMaskItem) {
      _loadMaskItem.id = loadMaskItem.id;
      _loadMaskItem.config = Object.assign({}, loadMaskItem.config);
    }

    this.loadingSubject.next(_loadMaskItem);
  }

  /**
   * 加載遮罩畫面初始化
   */
  private loadingMaskOnInit(): void {
    this.loadingMask = this.newConfig();

    const strategy = this.overlay
      .position()
      .global()
      .width('100%')
      .height('100%');

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: strategy,
      panelClass: 'dw-f-loading-http-panel'
    });

    this.getLoadingMask().subscribe(
      (loadingMaskItem: IDwLoadMaskItem) => {
        const config = Object.assign({}, loadingMaskItem.config);
        // 父子組件同步事件廣播避免ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.loadingMask = config;

          // 動態產生加載遮罩於畫面
          if (this.loadingMask.spinning) {
            if (!(this.overlayRef && this.overlayRef.hasAttached())) {
              const portal = new ComponentPortal(DwLoadingHttpComponent);
              this._container = this.overlayRef.attach(portal).instance;
              this._container.loadingMask = this.loadingMask;
            }
          } else {
            if (this.overlayRef && this.overlayRef.hasAttached()) {
              this.overlayRef.detach();
            }
          }
        });
      }
    );
  }
}
