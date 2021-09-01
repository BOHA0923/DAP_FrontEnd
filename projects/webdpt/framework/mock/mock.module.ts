import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { DwMockInMemoryService } from './mock-in-memory.service';
import { DW_MOCK } from '@webdpt/framework/config';


export const  httpClientInMemoryForRoot = HttpClientInMemoryWebApiModule.forRoot(
  DwMockInMemoryService,
  {
    passThruUnknownUrl: true,
    apiBase: '/'
  });

/**
 * 模擬資料
 *
 * @export
 */
@NgModule({
  imports: [
    CommonModule,
    httpClientInMemoryForRoot
  ],
  providers: [
    {
      provide: DW_MOCK,
      useValue: {
        db: {},
        methods: {}
      }
    },
  ]
})
export class DwMockModule { }
