import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwSysMenuListComponent } from './dw-sys-menu-list.component';

describe('DwSysMenuListComponent', () => {
  let component: DwSysMenuListComponent;
  let fixture: ComponentFixture<DwSysMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwSysMenuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSysMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
