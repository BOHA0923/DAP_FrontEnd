import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DwSystemConfigService } from '@webdpt/framework/config';
import { DwUpdatePasswordModalService } from '@webdpt/components/modals/update-password';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  endpoint: string;
  dwMultiTenant: boolean;
  constructor(
    private dwUpdatePasswordModalService: DwUpdatePasswordModalService,
    private translateService: TranslateService,
    private configService: DwSystemConfigService
  ) {
    this.configService.get('multiTenant').subscribe(
      multiTenant => this.dwMultiTenant = multiTenant
    );
  }


  ngOnInit(): void {
    this.endpoint = this.translateService.instant('dw-update-password-demo-cloud');
    if (!this.dwMultiTenant) {
      this.endpoint = this.translateService.instant('dw-update-password-demo-ground');
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /**
   * 修改密碼
   *
   */
  updatePassword($event: any): void {
    $event.preventDefault();

    this.subscription.add(
      this.dwUpdatePasswordModalService.open().subscribe(
        (ret) => {
          console.log('ret>>>', ret);
        }
      )
    );
  }


  /**
   * 修改密碼-指定驗證方式
   *
   */
  updatePasswordSpecific($event: any): void {
    $event.preventDefault();

    this.subscription.add(
      this.dwUpdatePasswordModalService.open({
        formVerifyType: 'email' // 驗證方式 full: 全部, email: 電子信箱, mobilephone: 手機號.
      }).subscribe(
        (ret) => {
          console.log('ret>>>', ret);
        }
      )
    );

  }



}
