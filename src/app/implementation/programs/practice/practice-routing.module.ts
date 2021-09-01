import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'boha14660'
  },
  {
    path: 'boha14660', // boha14660 add by BOHA 210901
    loadChildren: (): any => import('./boha14660/boha14660.module').then(m => m.Boha14660Module)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeRoutingModule { }
