import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwAccountInfoComponent } from './account-info.component';

describe('DwAccountInfoComponent', () => {
  let component: DwAccountInfoComponent;
  let fixture: ComponentFixture<DwAccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwAccountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
