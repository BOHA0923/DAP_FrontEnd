import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseRouteBackPageComponent } from './route-back-page.component';

describe('ShowcaseRouteBackPageComponent', () => {
  let component: ShowcaseRouteBackPageComponent;
  let fixture: ComponentFixture<ShowcaseRouteBackPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseRouteBackPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseRouteBackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
