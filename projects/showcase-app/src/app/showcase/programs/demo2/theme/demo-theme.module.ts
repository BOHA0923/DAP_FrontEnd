import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwCardModule } from 'ng-quicksilver/card';
import { DwTabsModule } from 'ng-quicksilver/tabs';

import { DemoThemeComponent } from './demo-theme/demo-theme.component';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { ThemeBaseComponent } from './demo-theme/theme-base/theme-base.component';
import { ThemePopComponent } from './demo-theme/theme-pop/theme-pop.component';
import { ThemeButtonTemplateComponent } from './demo-theme/theme-button-template/theme-button.template';
import { ColorSketchModule } from 'ngx-color/sketch';
import { HighlightModule } from 'ngx-highlightjs';
import { ShowcaseSharedModule } from '../../../shared/shared.module';

const ROUTES: Routes = [
  {
    path: '',
    component: DemoThemeComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-demo-theme',
        dwAuthId: 'dw-demo-theme'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];
@NgModule({
  imports: [
    CommonModule,
    DwLayoutModule,
    DwGridModule,
    DwIconModule,
    DwCardModule,
    DwTabsModule,
    ShowcaseSharedModule,
    RouterModule.forChild(ROUTES),
    ColorSketchModule,
    HighlightModule.forRoot({ theme: 'agate' })
  ],
  declarations: [DemoThemeComponent, ThemeBaseComponent, ThemePopComponent, ThemeButtonTemplateComponent],
  entryComponents: [ThemeBaseComponent, ThemePopComponent, ThemeButtonTemplateComponent]
})
export class DemoThemeModule { }
