import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwSysMenuEditNameComponent } from './dw-sys-menu-edit-name.component';

describe('DwSysMenuEditNameComponent', () => {
  let component: DwSysMenuEditNameComponent;
  let fixture: ComponentFixture<DwSysMenuEditNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwSysMenuEditNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSysMenuEditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
