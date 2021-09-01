<img 
    src="../../../assets/svg/segment.svg" 
    alt="Segment logo"
    height="100px"
    width="200px" />

# Segment
__homepage__: [segment.com](https://segment.com/)  
__docs__: [segment.com/docs/sources/website/analytics.js](https://segment.com/docs/sources/website/analytics.js/)  
__import__: `import { NgxAnalyticsSegment } from 'ngx-analytics/segment';`

## Setup
1. Add `NgxAnalyticsModule` to your root NgModule passing an array of providers to enable
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { NgxAnalyticsModule } from 'ngx-analytics';
import { NgxAnalyticsSegment } from 'ngx-analytics/segment';

const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),

    // added to imports
    NgxAnalyticsModule.forRoot([NgxAnalyticsSegment]),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
```
2. __Required__: Import your providers in the root component. This starts the tracking of route changes.
```ts
// component
import { NgxAnalyticsSegment } from 'ngx-analytics/segment';

@Component({  ...  })
export class AppComponent {
  constructor(ngx-analyticsSegment: NgxAnalyticsSegment) {}
}
```
