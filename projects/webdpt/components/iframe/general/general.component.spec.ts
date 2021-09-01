import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwIframeGeneralComponent } from './general.component';

describe('DwIframeGeneralComponent', () => {
  let component: DwIframeGeneralComponent;
  let fixture: ComponentFixture<DwIframeGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwIframeGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwIframeGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
