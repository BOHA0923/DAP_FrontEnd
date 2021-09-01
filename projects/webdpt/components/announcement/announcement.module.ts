import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DwCheckboxModule } from 'ng-quicksilver/checkbox';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwModalModule } from 'ng-quicksilver/modal';

import { FormsModule } from '@angular/forms';

// import { DwAnnouncementRepository } from './repository/announcement-repository';
// import { DwAnnouncementModalService } from './service/announcement-modal.service';
// import { DwAnnouncementService } from './service/announcement.service';
import { DwAnnouncementModalComponent } from './announcement-modal/announcement-modal.component';


const provides: any[] = [
  // DwAnnouncementRepository,
  // DwAnnouncementModalService,
  // DwAnnouncementService
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DwCheckboxModule,
    DwModalModule,
    DwButtonModule,
    FormsModule
  ],
  declarations: [DwAnnouncementModalComponent],
  entryComponents: [DwAnnouncementModalComponent],
  exports: [DwAnnouncementModalComponent],
  providers: [...provides]
})
export class DwAnnouncementModule { }
