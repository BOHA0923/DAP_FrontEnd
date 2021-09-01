import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwImageViewerModule } from '@webdpt/components/image-viewer';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DwDemoImageViewerComponent } from './dw-demo-image-viewer.component';
import { DwDemoImageViewerRoutingModule } from './dw-demo-image-viewer-routing.module';
import { DwDemoImageViewerListComponent } from './dw-demo-image-viewer-list/dw-demo-image-viewer-list.component';
import { DwDemoImageViewerService } from './service/dw-demo-image-viewer.service';
import { DwDemoImageViewerUploadComponent } from './dw-demo-image-viewer-upload/dw-demo-image-viewer-upload.component';

@NgModule({
  imports: [
    CommonModule,
    DwDemoImageViewerRoutingModule,
    ShowcaseSharedModule,
    DwImageViewerModule
  ],
  declarations: [
    DwDemoImageViewerComponent,
    DwDemoImageViewerListComponent,
    DwDemoImageViewerUploadComponent
  ],
  entryComponents: [],
  providers: [
    DwDemoImageViewerService
  ]
})

export class DwDemoImageViewerModule { }
