import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoThemeComponent } from './demo-theme.component';

describe('DemoThemeComponent', () => {
  let component: DemoThemeComponent;
  let fixture: ComponentFixture<DemoThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
