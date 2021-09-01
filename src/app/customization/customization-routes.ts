import { Routes } from '@angular/router';

import { IMPLEMENTATION_ROUTES } from '../implementation/implementation-routes';


export const CUSTOMIZATION_ROUTES: Routes = [
  // 設定客製應用模組路由

  // 應用開發應用模組路由
  ...IMPLEMENTATION_ROUTES
];
