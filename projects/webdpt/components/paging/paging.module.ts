import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DwPaginationClientSideWrapperComponent } from './pagination-client-side-wrapper.component';
import { DwPaginationServerSideWrapperComponent } from './pagination-server-side-wrapper.component';
import { DwPaginationModule } from 'ng-quicksilver/pagination';
import { DwIconModule } from 'ng-quicksilver/icon';

@NgModule({
  imports: [
    CommonModule,
    DwPaginationModule,
    DwIconModule
  ],
  declarations: [
    DwPaginationClientSideWrapperComponent,
    DwPaginationServerSideWrapperComponent
  ],
  exports: [
    DwPaginationClientSideWrapperComponent,
    DwPaginationServerSideWrapperComponent
  ]
})
export class DwPagingModule {}
