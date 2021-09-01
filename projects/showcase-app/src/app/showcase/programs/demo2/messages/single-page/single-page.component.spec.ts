import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseSinglePageComponent } from './single-page.component';

describe('ShowcaseSinglePageComponent', () => {
  let component: ShowcaseSinglePageComponent;
  let fixture: ComponentFixture<ShowcaseSinglePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseSinglePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
