import { Routes } from '@angular/router';

import { CUSTOMIZATION_ROUTES } from './customization/customization-routes';

export const MODULE_ROUTES: Routes = [
  // ...DW_ROUTES, // 已不使用
  {
    path: 'dpt', // 路徑為/dpt/*
    pathMatch: 'prefix',
    loadChildren: (): Promise<any> => import('./showcase/tools-routing-wrapper.module').then(m => m.ToolsRoutingWrapper)
  },
  ...CUSTOMIZATION_ROUTES
];
