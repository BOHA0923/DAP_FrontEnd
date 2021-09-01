import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwSsoButtonComponent } from './sso-button.component';

describe('DwSsoButtonComponent', () => {
  let component: DwSsoButtonComponent;
  let fixture: ComponentFixture<DwSsoButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwSsoButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSsoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
