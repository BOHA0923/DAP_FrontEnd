import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { DwThemeButtonComponent } from './theme-button.component';
import { DwPopoverModule } from 'ng-quicksilver/popover';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwThemeDirective } from './theme/theme.directive';
import { DwThemeComponent } from './theme/theme.component';
// import { CheckCircleFill, CheckCircleOutline } from '@ant-design/icons-angular/icons';
import { DwIconModule} from 'ng-quicksilver/icon';
// import { IconDefinition } from '@ant-design/icons-angular';
// const icons: IconDefinition[] = [ CheckCircleFill, CheckCircleOutline ];
@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    DwPopoverModule,
    DwButtonModule,
    DwIconModule
  ],
  entryComponents: [ DwThemeComponent ],
  declarations: [DwThemeButtonComponent, DwThemeDirective, DwThemeComponent],
  exports: [DwThemeButtonComponent, DwThemeDirective, DwThemeComponent],
  // providers: [{ provide: DW_ICONS, useValue: icons }]
})
export class DwThemeButtonModule { }
