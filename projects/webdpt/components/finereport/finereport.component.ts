import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd, Params } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { switchMap, filter, withLatestFrom } from 'rxjs/operators';

import { IDwIframe } from '@webdpt/framework/iframe-core';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DwIframeFinereportInfoService } from '@webdpt/framework/finereport-core';

@Component({
  selector: 'dw-iframe-finereport',
  templateUrl: './finereport.component.html',
  styleUrls: ['./finereport.component.less']
})
export class DwIframeFinereportComponent implements OnInit, OnDestroy {
  itemRxjsBehavior: BehaviorSubject<IDwIframe>; // 需要透過 service 取得 url.
  item: IDwIframe = {
    url: '',
    type: 'fineReport'
  };

  private initSubscription: Subscription; // 初始化時訂閱
  private changeSubscription: Subscription; // 路由改變時訂閱

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iframeFinereportInfoService: DwIframeFinereportInfoService,
    @Inject(DW_USING_TAB) public usingTab: boolean
  ) {
    this.itemRxjsBehavior = new BehaviorSubject<IDwIframe>(null);
    // this.item.attr = 'allow-forms allow-scripts allow-popups'; // iframe 的 屬性. 要配合報表主機設定
  }

  ngOnInit(): void {
    // TODO：[多頁佈局首頁內嵌iframe非同步混亂] (dw-tab-routing.component.ts)
    // 暫解：首頁內嵌iframe時，1.提供programId='home'做辨識 2.作業資訊指定type

    if (!this.usingTab) { // 頁籤自行處理iframe
      // 初始化時，paramMap和queryParam各取一次
      let isInit = false;

      this.initSubscription = this.activatedRoute.paramMap.pipe(
        switchMap(
          (routeParam: ParamMap) => {
            return this.activatedRoute.queryParamMap;
          },
          (routeParam: ParamMap, queryParam: ParamMap) => {
            const actParams = {
              routeParam: routeParam,
              queryParam: queryParam
            };

            return actParams;
          }
        )
      ).subscribe(
        actParams => {
          if (!isInit) {
            isInit = true;
            this.setIframe(actParams.routeParam, actParams.queryParam['params']);
          }

          if (this.initSubscription) {
            this.initSubscription.unsubscribe();
          }
        }
      );

      // 路由改變時，queryParam比paramMap早改變，並且paramMap和queryParam不一定都會改變值，所以必須用路由事件判斷
      this.changeSubscription = this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        withLatestFrom(this.activatedRoute.paramMap, this.activatedRoute.queryParamMap)
      ).subscribe(([e, routeParam, queryParam]) => {
        this.setIframe(routeParam, queryParam['params']);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }

    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  private setIframe(routeParam: ParamMap, queryParam: Params): void {
    const programId = routeParam.get('programId');

    if (programId) {
      this.iframeFinereportInfoService.finereportInfo(programId, queryParam).subscribe(
        (iframeData: IDwIframe) => {
          this.item = iframeData;
          // this.item.programId = 'home';
          this.itemRxjsBehavior.next(this.item);
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
