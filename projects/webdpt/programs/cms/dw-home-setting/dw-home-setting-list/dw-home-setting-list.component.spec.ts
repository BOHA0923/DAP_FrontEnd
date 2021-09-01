import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwHomeSettingListComponent } from './dw-home-setting-list.component';

describe('DwHomeSettingListComponent', () => {
  let component: DwHomeSettingListComponent;
  let fixture: ComponentFixture<DwHomeSettingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwHomeSettingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwHomeSettingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
