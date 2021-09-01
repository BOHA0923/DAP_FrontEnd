import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { OrganizeTreeRoutingModule } from './organize-tree-routing.module';
import { OrganizeTreeComponent } from './organize-tree.component';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    OrganizeTreeRoutingModule
  ],
  declarations: [
    OrganizeTreeComponent
  ]
})
export class OrganizeTreeModule { }
