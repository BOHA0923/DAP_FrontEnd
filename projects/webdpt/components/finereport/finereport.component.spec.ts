import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwIframeFinereportComponent } from './finereport.component';

describe('DwIframeFinereportComponent', () => {
  let component: DwIframeFinereportComponent;
  let fixture: ComponentFixture<DwIframeFinereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwIframeFinereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwIframeFinereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
