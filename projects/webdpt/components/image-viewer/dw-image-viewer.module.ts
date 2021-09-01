import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DwIconModule } from 'ng-quicksilver/icon';
import { DwPopoverModule } from 'ng-quicksilver/popover';
import { DwProgressModule } from 'ng-quicksilver/progress';
import { DwToolTipModule } from 'ng-quicksilver/tooltip';

import { DwImageViewerComponent } from './dw-image-viewer.component';
import { DwImageViewerService } from './dw-image-viewer.service';
import { DwImageViewerFileService } from './dw-image-viewer-file.service';
import { DwImageViewerFileIconComponent } from './dw-image-viewer-file-icon.component';
import { DwImageViewerModalComponent } from './dw-image-viewer-modal/dw-image-viewer-modal.component';
import { DwImageViewerListItemComponent } from './dw-image-viewer-list/dw-image-viewer-list-item.component';
import { DwImageViewerListService } from './dw-image-viewer-list/dw-image-viewer-list.service';

@NgModule({
  declarations: [
    DwImageViewerComponent,
    DwImageViewerFileIconComponent,
    DwImageViewerModalComponent,
    DwImageViewerListItemComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    DwIconModule,
    DwPopoverModule,
    DwProgressModule,
    DwToolTipModule
  ],
  exports: [
    DwImageViewerComponent,
    DwImageViewerFileIconComponent,
    DwImageViewerModalComponent,
    DwImageViewerListItemComponent
  ],
  entryComponents: [DwImageViewerModalComponent],
  providers: [DwImageViewerService, DwImageViewerFileService, DwImageViewerListService]
})
export class DwImageViewerModule { }
