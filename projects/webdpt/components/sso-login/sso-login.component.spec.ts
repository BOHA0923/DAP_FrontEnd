import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwSsoLoginComponent } from './sso-login.component';

describe('DwSsoLoginComponent', () => {
  let component: DwSsoLoginComponent;
  let fixture: ComponentFixture<DwSsoLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwSsoLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSsoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
