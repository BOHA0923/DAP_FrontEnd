import { Routes } from '@angular/router';

export const SHOWCASE_ROUTES: Routes = [
  {
    path: '', // 首頁
    pathMatch: 'prefix',
    loadChildren: (): Promise<any> => import('./home/home.module').then(m => m.ShowcaseHomeModule)
  },
  {
    path: 'dw-demo1', // 範本
    pathMatch: 'prefix',
    loadChildren: (): Promise<any> => import('./programs/demo1/demo1.module').then(m => m.Demo1Module)
  },
  {
    path: 'dw-demo2', // 功能範本
    pathMatch: 'prefix',
    loadChildren: (): Promise<any> => import('./programs/demo2/demo2.module').then(m => m.Demo2Module)
  }
];
