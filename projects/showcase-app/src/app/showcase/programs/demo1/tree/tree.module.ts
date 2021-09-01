import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { ShowcaseTreeComponent } from './tree.component';
import { ShowcaseTreeSearchPipe } from './model/searchPipe';
import { ShowcaseDataModalComponent } from './data-modal/data-modal.component';
import { ShowcaseEditShowcaseDataModalComponent } from './edit-data-modal/edit-data-modal.component';
import { DwLanguageService } from '@webdpt/framework/language';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: ShowcaseTreeComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-tree',
        programId: 'dw-tree'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ShowcaseSharedModule
  ],
  declarations: [ShowcaseTreeComponent, ShowcaseTreeSearchPipe, ShowcaseDataModalComponent, ShowcaseEditShowcaseDataModalComponent],
  entryComponents: [ShowcaseDataModalComponent, ShowcaseEditShowcaseDataModalComponent]
})
export class ShowcaseTreeModule { }
