import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwHomeSettingComponent } from './dw-home-setting.component';

describe('DwHomeSettingComponent', () => {
  let component: DwHomeSettingComponent;
  let fixture: ComponentFixture<DwHomeSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwHomeSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwHomeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
