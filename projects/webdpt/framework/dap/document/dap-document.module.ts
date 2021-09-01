import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwCreateService } from '@webdpt/framework/document';
import { DwReadService } from '@webdpt/framework/document';
import { DwUpdateService } from '@webdpt/framework/document';
import { DwDeleteService } from '@webdpt/framework/document';
import { DwListService } from '@webdpt/framework/document';

import { DwDapCreateService } from './create.service';
import { DwDapReadService } from './read.service';
import { DwDapUpdateService } from './update.service';
import { DwDapDeleteService } from './delete.service';
import { DwDapListService } from './list.service';

import { DwMetadataService } from '@webdpt/framework/document';


/**
 * DapDocument Module
 *
 * @export
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DwMetadataService,
    DwReadService,
    DwCreateService,
    DwUpdateService,
    DwDeleteService,
    DwListService,
    {
      provide: 'DocumentID',
      useValue: ''
    },
    {
      provide: 'DocumentResource',
      useValue: ''
    },
    DwDapCreateService,
    {
      provide: DwCreateService,
      useExisting: DwDapCreateService
    },
    DwDapReadService,
    {
      provide: DwReadService,
      useExisting: DwDapReadService
    },
    DwDapUpdateService,
    {
      provide: DwUpdateService,
      useExisting: DwDapUpdateService
    },
    DwDapDeleteService,
    {
      provide: DwDeleteService,
      useExisting: DwDapDeleteService
    },
    DwDapListService,
    {
      provide: DwListService,
      useExisting: DwDapListService
    }
  ]
})
export class DwDapDocumentModule { }
