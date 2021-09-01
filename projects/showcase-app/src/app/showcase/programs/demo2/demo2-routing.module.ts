import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dw-mock-demo'
  },
  {
    path: 'dw-mock-demo',
    loadChildren: (): Promise<any> => import('./mock-demo/mock-demo.module').then(m => m.ShowcaseMockDemoModule)
  },
  {
    path: 'dw-messages',
    loadChildren: (): Promise<any> => import('./messages/messages.module').then(m => m.ShowcaseMessagesModule)
  },
  {
    path: 'input-listwin',
    loadChildren: (): Promise<any> => import('./input-listwin/input-listwin.module').then(m => m.InputListwinModule)
  },
  {
    path: 'form-items',
    loadChildren: (): Promise<any> => import('./form-items/demo-form-items.module').then(m => m.DemoFormItemsModule)
  },
  {
    path: 'demo-theme',
    loadChildren: (): Promise<any> => import('./theme/demo-theme.module').then(m => m.DemoThemeModule)
  },
  {
    path: 'language-style',
    loadChildren: (): Promise<any> => import('./language-style/language-style.module').then(m => m.LanguageStyleModule)
  },
  {
    path: 'ag-grid',
    loadChildren: (): Promise<any> => import('./ag-grid/ag-grid-demo.module').then(m => m.DwAgGridDemoModule)
  },
  {
    path: 'pagination',
    loadChildren: (): Promise<any> => import('./pagination/pagination-demo.module').then(m => m.PaginationDemoModule)
  },
  {
    path: 'organize-tree',
    loadChildren: (): Promise<any> => import('./organize-tree/organize-tree.module').then(m => m.OrganizeTreeModule)
  },
  {
    path: 'update-password',
    loadChildren: (): Promise<any> => import('./update-password/update-password.module').then(m => m.UpdatePasswordModule)
  },
  {
    path: 'job-schedule',
    loadChildren: (): Promise<any> => import('./job-schedule/job-schedule.module').then(m => m.DwJobScheduleModule)
  },
  {
    path: 'calendar',
    loadChildren: (): Promise<any> => import('./full-calendar/full-calendar.module').then(m => m.DwFullCalendarModule)
  },
  {
    path: 'dw-demo-image-viewer',
    loadChildren: (): Promise<any> => import('./dw-demo-image-viewer/dw-demo-image-viewer.module').then(m => m.DwDemoImageViewerModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Demo2RoutingModule { }
