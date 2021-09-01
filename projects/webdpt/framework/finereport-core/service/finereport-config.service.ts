import { Injectable } from '@angular/core';

import { DwSystemConfigService } from '@webdpt/framework/config';
import { DwFinereportCoreModule } from '../finereport-core.module';

@Injectable({
  providedIn: DwFinereportCoreModule
})
export class DwFinereportConfigService {
  frUrl: string;
  constructor(
    private configService: DwSystemConfigService
  ) {
    this.configService.get('frUrl').subscribe(
      url => this.frUrl = url
    );
  }

  /**
   * 帆軟報表是否啟用
   */
  public frEnable(): boolean {
    let reportEnable = false;

    if (this.frUrl) {
      if (this.frUrl !== '' && this.frUrl !== '@FINEREPORT_URL@') {
        reportEnable = true;
      }
    }

    return reportEnable;
  }
}
