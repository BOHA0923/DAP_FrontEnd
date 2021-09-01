import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Params, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DwPostMessageFactoryService } from '@webdpt/framework/cors-messaging';
import { DwPostMessageHub } from '@webdpt/framework/cors-messaging';
import { DwBaseIframeComponent } from '../base-iframe/dw-base-iframe.component';

import { IDwIframe, DwIframeGeneralInfoService } from '@webdpt/framework/iframe-core';


@Component({
  selector: 'dw-iframe-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.less']
})
export class DwIframeGeneralComponent implements OnInit, OnDestroy, AfterViewInit {
  itemRxjsBehavior: BehaviorSubject<IDwIframe>; // 需要透過 service 取得 url.
  @ViewChild(DwBaseIframeComponent) baseIframeComponent: DwBaseIframeComponent;
  public item: IDwIframe = {
    url: '',
    type: 'externalUrl'
  };

  private initSubscription: Subscription; // 初始化時訂閱
  private changeSubscription: Subscription; // 路由改變時訂閱
  private postMessageHub: DwPostMessageHub;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iframeGeneralInfoService: DwIframeGeneralInfoService,
    @Inject(DW_USING_TAB) public usingTab: boolean,
    messageFactory: DwPostMessageFactoryService,
  ) {
    this.postMessageHub = messageFactory.getHubInstance();
    this.itemRxjsBehavior = new BehaviorSubject<IDwIframe>(null);
  }

  ngOnInit(): void {
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
    const url = queryParam['url'];

    this.iframeGeneralInfoService.generalInfo(programId, queryParam).subscribe(
      (iframeData: IDwIframe) => {
        this.item = iframeData;
        this.itemRxjsBehavior.next(this.item);
      },
      error => {
        console.log(error);
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.baseIframeComponent && this.baseIframeComponent.iframe) {
      const contentWindow = this.baseIframeComponent.iframe.nativeElement.contentWindow;
      const url = new URL(this.baseIframeComponent.iframe.nativeElement.src);
      this.postMessageHub.addReceiver(
        contentWindow,
        `${url.protocol}//${url.host}`
      );
    }
  }
}
