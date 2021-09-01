import { CommonModule } from '@angular/common';
import { Component, Injectable, NgModule } from '@angular/core';
import { tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UIRouterModule } from '@uirouter/angular';

import { DwAnalytics } from './core/analytics';
import { DwAnalyticsModule} from './core/analytics.module';

@Injectable()
export class DummyProvider {
  eventSpy: any;
  constructor(ngxAnalytics: DwAnalytics) {
    // @ts-ignore
    this.eventSpy = jasmine.createSpy('eventSpy');
    ngxAnalytics.pageTrack.subscribe((x) => this.eventSpy(x));
  }
}

// tslint:disable-next-line:component-selector
@Component({ selector: 'hello-cmp', template: `{{ greeting }}` })

// tslint:disable-next-line:component-class-suffix
export class HelloCmp {
  greeting: string;
  constructor() {
    this.greeting = 'hello';
  }
}

// tslint:disable-next-line:component-selector
@Component({ selector: 'hello-cmp2', template: `<div>2</div>` })
// tslint:disable-next-line:component-class-suffix
export class HelloCmp2 {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'hello-cmp3', template: `<div>3</div>` })
// tslint:disable-next-line:component-class-suffix
export class HelloCmp3 {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'hello-cmp4', template: `<div>4</div>` })
// tslint:disable-next-line:component-class-suffix
export class HelloCmp4 {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'hello-cmp5', template: `<div>5</div>` })
// tslint:disable-next-line:component-class-suffix
export class HelloCmp5 {}

export const RoutesConfig: Routes = [
  { path: '', component: HelloCmp },
  { path: 'abc', component: HelloCmp2 },
  { path: 'def', component: HelloCmp3 },
  { path: 'ghi', component: HelloCmp4 },
  { path: 'sections/123/pages/456', component: HelloCmp5 },
  { path: 'sections/01234567-9ABC-DEF0-1234-56789ABCDEF0/pages/456', component: HelloCmp5 },
  { path: '0sections0/01234567-9ABC-DEF0-1234-56789ABCDEF0/pages', component: HelloCmp5 },
  { path: '0sections0/a01/pages/page/2/summary', component: HelloCmp5 },
];

@Component({
// tslint:disable-next-line:component-selector
  selector: 'root-comp',
  template: `<router-outlet></router-outlet>`,
})
// tslint:disable-next-line:component-class-suffix
export class RootCmp {
  constructor(dummy: DummyProvider) {}
}

@Component({
// tslint:disable-next-line:component-selector
  selector: 'root-dummy-comp',
  template: `hello`,
})
// tslint:disable-next-line:component-class-suffix
export class RouterlessRootCmp {
  constructor(dummy: DummyProvider) {}
}

@Component({
// tslint:disable-next-line:component-selector
  selector: 'root-comp',
  template: `<ui-view></ui-view>`,
})
// tslint:disable-next-line:component-class-suffix
export class UIRootCmp {
  constructor(dummy: DummyProvider) {}
}

export const UIRoutesConfig = [
  { name: 'home', component: HelloCmp, url: '/home' },
  { name: 'def', component: HelloCmp2, url: '/' },
];

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

export function createRoot(type: any): ComponentFixture<any> {
  const f = TestBed.createComponent(type);
  advance(f);
  return f;
}

export function createRootWithRouter(
  router: Router,
  type: any,
): ComponentFixture<any> {
  const f = TestBed.createComponent(type);
  advance(f);
  router.initialNavigation();
  advance(f);
  return f;
}

@NgModule({
  imports: [
    CommonModule,
    UIRouterModule.forRoot({
      states: UIRoutesConfig,
      useHash: true,
      otherwise: { state: 'home' },
    }),
    DwAnalyticsModule.forRoot([ DummyProvider ]),
  ],
  entryComponents: [UIRootCmp],
  declarations: [
    HelloCmp,
    HelloCmp2,
    UIRootCmp,
  ],
})
export class UITestModule {
}

@NgModule({
  imports: [
    CommonModule,
    RouterTestingModule,
    DwAnalyticsModule.forRoot([ DummyProvider ]),
  ],
  entryComponents: [RootCmp],
  declarations: [
    HelloCmp,
    HelloCmp2,
    HelloCmp3,
    HelloCmp4,
    HelloCmp5,
    RootCmp,
  ],
})
export class TestModule {
}
