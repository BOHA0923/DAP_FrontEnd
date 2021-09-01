import { Routes } from '@angular/router';

export const IMPLEMENTATION_ROUTES: Routes = [
  // 設定應用開發應用模組路由
  {
    path: '', // 首頁
    pathMatch: 'prefix',
    loadChildren: (): Promise<any> => import('./home/home.module').then(m => m.HomeModule)
  },
];
