import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DwOrganizeTreeModalModule } from '@webdpt/components/modals/organize-tree';
import { DwSelectModalModule } from '@webdpt/components/modals/select';
import { DwUpdatePasswordModalModule } from '@webdpt/components/modals/update-password';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DwOrganizeTreeModalModule,
    DwSelectModalModule,
    DwUpdatePasswordModalModule
  ]
})
export class DwModalsModule {}
